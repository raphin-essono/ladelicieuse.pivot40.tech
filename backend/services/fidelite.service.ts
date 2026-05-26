import { Types } from 'mongoose';
import { logger } from '../config/logger.js';
import crypto from 'crypto';
import User from '../models/User.model.js';
import FideliteTransaction from '../models/FideliteTransaction.model.js';
import FideliteTier from '../models/FideliteTier.model.js';
import PromoCode from '../models/PromoCode.model.js';
import { logAction } from '../models/HistoryLog.model.js';

// Tiers par défaut — utilisés pour le seed et le fallback
export const DEFAULT_TIERS = [
  { slug: 'bronze',  nom: 'Bronze',  pointsMin: 0,    pointsMax: 499,  couleur: 'bronze',  ordre: 0 },
  { slug: 'argent',  nom: 'Argent',  pointsMin: 500,  pointsMax: 1499, couleur: 'argent',  ordre: 1 },
  { slug: 'or',      nom: 'Or',      pointsMin: 1500, pointsMax: 3499, couleur: 'or',      ordre: 2 },
  { slug: 'platine', nom: 'Platine', pointsMin: 3500, pointsMax: null, couleur: 'platine', ordre: 3 },
];

async function computeTierDB(points: number): Promise<string> {
  const tiers = await FideliteTier.find().sort({ pointsMin: -1 }).lean();
  if (tiers.length === 0) return points >= 3500 ? 'platine' : points >= 1500 ? 'or' : points >= 500 ? 'argent' : 'bronze';
  const match = tiers.find(t => points >= t.pointsMin);
  return match?.slug ?? 'bronze';
}

// ── Règles de fidélité ────────────────────────────────────────────────────────
// 1 point par 100 FCFA dépensés (arrondi à l'entier inférieur)
const POINTS_PAR_100_FCFA = 1;

// Valeur d'un point en FCFA lors du rachat
const FCFA_PAR_POINT = 5; // 100 pts = 500 FCFA

// Points minimum requis pour un rachat
const MIN_POINTS_RACHAT = 100;

// ── Calcul des points gagnés ──────────────────────────────────────────────────
export function calculerPointsGagnes(montantFCFA: number): number {
  return Math.floor((montantFCFA / 100) * POINTS_PAR_100_FCFA);
}

// ── Récompense depuis les points ─────────────────────────────────────────────
export function calculerValeurRachat(points: number): number {
  return points * FCFA_PAR_POINT;
}

// ── Attribuer des points après livraison ─────────────────────────────────────
export async function attributerPoints(
  userId: string | Types.ObjectId,
  montantFCFA: number,
  orderId?: string | Types.ObjectId,
): Promise<{ pointsGagnes: number; soldeApres: number; tierAvant: string; tierApres: string }> {
  const userBefore = await User.findById(userId).lean();
  if (!userBefore) throw new Error('Utilisateur introuvable');

  const points = calculerPointsGagnes(montantFCFA);
  if (points <= 0) {
    return { pointsGagnes: 0, soldeApres: userBefore.points, tierAvant: userBefore.tier, tierApres: userBefore.tier };
  }

  // $inc atomique — une seule opération MongoDB, pas de race condition sur le solde
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { points } },
    { new: true, runValidators: false },
  );
  if (!updatedUser) throw new Error('Utilisateur introuvable après update');

  const tierApres = (await computeTierDB(updatedUser.points)) as typeof updatedUser.tier;
  if (tierApres !== updatedUser.tier) {
    updatedUser.tier = tierApres;
    await updatedUser.save();
  }

  const tierAvant = userBefore.tier;

  // Enregistrement de la transaction — idempotent grâce à l'index unique (userId, orderId, type)
  try {
    await FideliteTransaction.create({
      userId:      updatedUser._id,
      orderId:     orderId ?? undefined,
      type:        'gain',
      points,
      soldeApres:  updatedUser.points,
      description: `Commande livrée — +${points} pts (${montantFCFA.toLocaleString('fr-FR')} FCFA)`,
    });
  } catch (err: unknown) {
    const isDuplicate = (err as { code?: number }).code === 11000;
    if (isDuplicate) {
      logger.warn('[Fidélité] Transaction déjà enregistrée (doublon ignoré)', { userId, orderId });
    } else {
      logger.error('[Fidélité] Échec enregistrement transaction — points attribués mais non tracés', { userId, orderId, error: (err as Error).message });
    }
  }

  if (tierApres !== tierAvant) {
    await logAction(
      `Fidélité : ${updatedUser.nom} passe de ${tierAvant} à ${tierApres} (${updatedUser.points} pts)`,
      'utilisateur',
      updatedUser.nom,
    );
  }

  return { pointsGagnes: points, soldeApres: updatedUser.points, tierAvant, tierApres };
}

// ── Ajustement manuel (admin) ─────────────────────────────────────────────────
export async function ajusterPoints(
  userId: string,
  delta: number,
  description: string,
  par: string = 'Admin',
): Promise<{ soldeApres: number; tier: string }> {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur introuvable');

  user.points = Math.max(0, user.points + delta);
  user.tier   = (await computeTierDB(user.points)) as typeof user.tier;
  await user.save();

  await FideliteTransaction.create({
    userId:     user._id,
    type:       'ajustement',
    points:     delta,
    soldeApres: user.points,
    description,
  });

  await logAction(`Points ajustés (${delta > 0 ? '+' : ''}${delta}) pour ${user.nom} — ${description}`, 'utilisateur', par);

  return { soldeApres: user.points, tier: user.tier };
}

// ── Rachat de points (génère un code promo) ───────────────────────────────────
export async function rachatPoints(
  userId: string,
  pointsARacheter: number,
): Promise<{ code: string; valeurFCFA: number; soldeApres: number }> {
  if (pointsARacheter < MIN_POINTS_RACHAT) {
    throw new Error(`Minimum ${MIN_POINTS_RACHAT} points requis pour un rachat.`);
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur introuvable');
  if (user.points < pointsARacheter) throw new Error('Solde de points insuffisant.');

  const valeurFCFA = calculerValeurRachat(pointsARacheter);
  const code       = `FIDELITE-${user.nom.replace(/\s+/g, '').toUpperCase().slice(0, 5)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // Créer le code promo usage unique (montant fixe en réduction)
  await PromoCode.create({
    code,
    reduction:       valeurFCFA,
    typeReduction:   'fixe',
    minCommande:     0,
    active:          true,
    maxUtilisations: 1,
    utilisations:    0,
    expiry:          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
  });

  user.points = user.points - pointsARacheter;
  user.tier   = (await computeTierDB(user.points)) as typeof user.tier;
  await user.save();

  await FideliteTransaction.create({
    userId:     user._id,
    type:       'rachat',
    points:     -pointsARacheter,
    soldeApres: user.points,
    description: `Rachat ${pointsARacheter} pts → code ${code} (${valeurFCFA.toLocaleString('fr-FR')} FCFA)`,
  });

  await logAction(`Rachat fidélité : ${user.nom} — ${pointsARacheter} pts → ${code}`, 'utilisateur', user.nom);

  return { code, valeurFCFA, soldeApres: user.points };
}

// ── Historique des transactions fidélité ──────────────────────────────────────
export async function getHistoriqueFidelite(userId: string, limit = 20) {
  return FideliteTransaction
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
