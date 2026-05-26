import { Router, Request, Response } from 'express';
import Promotion from '../models/Promotion.model.js';
import PromoCode from '../models/PromoCode.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';

const router = Router();

// ── GET /api/promotions ───────────────────────────────────────────────────────
router.get('/', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération promotions', error: (error as Error).message });
  }
});

// ── GET /api/promotions/active — Pour le front client ─────────────────────────
router.get('/active', async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      active: true,
      dateDebut: { $lte: now },
      dateFin:   { $gte: now },
    }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/promotions ──────────────────────────────────────────────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    await logAction(`Promotion "${promotion.nom}" créée`, 'promotion', 'Admin');
    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création promotion', error: (error as Error).message });
  }
});

// ── PATCH /api/promotions/:id ─────────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!promotion) { res.status(404).json({ success: false, message: 'Promotion introuvable' }); return; }
    await logAction(`Promotion "${promotion.nom}" modifiée`, 'promotion', 'Admin');
    res.json({ success: true, data: promotion });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/promotions/:id ────────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) { res.status(404).json({ success: false, message: 'Promotion introuvable' }); return; }
    await logAction(`Promotion "${promotion.nom}" supprimée`, 'promotion', 'Admin');
    res.json({ success: true, message: 'Promotion supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

// ── GET /api/promotions/codes ─────────────────────────────────────────────────
router.get('/codes', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const codes = await PromoCode.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: codes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération codes', error: (error as Error).message });
  }
});

// ── POST /api/promotions/codes/validate — Valider un code (front client) ─────
router.post('/codes/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, montant } = req.body as { code: string; montant: number };
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), active: true });

    if (!promo) { res.status(404).json({ success: false, message: 'Code invalide' }); return; }
    if (promo.expiry && promo.expiry < new Date()) { res.status(400).json({ success: false, message: 'Code expiré' }); return; }
    if (promo.maxUtilisations && promo.utilisations >= promo.maxUtilisations) {
      res.status(400).json({ success: false, message: 'Code épuisé' }); return;
    }
    if (promo.minCommande && montant < promo.minCommande) {
      res.status(400).json({ success: false, message: `Commande minimum : ${promo.minCommande} XAF` }); return;
    }

    const remise = promo.typeReduction === 'pourcentage'
      ? (montant * promo.reduction) / 100
      : promo.reduction;

    res.json({ success: true, data: { reduction: remise, type: promo.typeReduction, code: promo.code } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur validation code', error: (error as Error).message });
  }
});

// ── POST /api/promotions/codes ────────────────────────────────────────────────
router.post('/codes', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const promoCode = new PromoCode(req.body);
    await promoCode.save();
    await logAction(`Code promo "${promoCode.code}" créé`, 'promotion', 'Admin');
    res.status(201).json({ success: true, data: promoCode });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création code', error: (error as Error).message });
  }
});

// ── PATCH /api/promotions/codes/:id ──────────────────────────────────────────
router.patch('/codes/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!promoCode) { res.status(404).json({ success: false, message: 'Code introuvable' }); return; }
    res.json({ success: true, data: promoCode });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/promotions/codes/:id ─────────────────────────────────────────
router.delete('/codes/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) { res.status(404).json({ success: false, message: 'Code introuvable' }); return; }
    await logAction(`Code promo "${promoCode.code}" supprimé`, 'promotion', 'Admin');
    res.json({ success: true, message: 'Code supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
