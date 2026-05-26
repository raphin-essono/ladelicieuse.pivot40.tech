import { Router, Request, Response } from 'express';
import { verifyJWT } from './auth.routes.js';
import FideliteTransaction from '../models/FideliteTransaction.model.js';
import LoyaltyReward from '../models/LoyaltyReward.model.js';
import FideliteTier from '../models/FideliteTier.model.js';
import { ajusterPoints, DEFAULT_TIERS } from '../services/fidelite.service.js';
import { logAction } from '../models/HistoryLog.model.js';

const router = Router();

// ── GET /api/fidelite/tiers/public — Public : niveaux de fidélité pour le front ─
router.get('/tiers/public', async (_req: Request, res: Response): Promise<void> => {
  try {
    let tiers = await FideliteTier.find().sort({ ordre: 1, pointsMin: 1 }).lean();
    if (tiers.length === 0) {
      await FideliteTier.insertMany(DEFAULT_TIERS);
      tiers = await FideliteTier.find().sort({ ordre: 1, pointsMin: 1 }).lean();
    }
    res.json({ success: true, data: tiers });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// ── GET /api/fidelite/recent — Admin : 50 dernières transactions ──────────────
router.get('/recent', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const txs = await FideliteTransaction
      .find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, data: txs });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// ── GET /api/fidelite/user/:userId — Admin : historique d'un utilisateur ──────
router.get('/user/:userId', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const txs = await FideliteTransaction
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ success: true, data: txs });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// ── POST /api/fidelite/ajuster — Admin : ajustement manuel de points ──────────
router.post('/ajuster', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  const { userId, delta, description } = req.body as { userId: string; delta: number; description: string };
  if (!userId || delta === undefined || !description) {
    res.status(400).json({ success: false, message: 'userId, delta et description requis' });
    return;
  }
  try {
    const result = await ajusterPoints(userId, delta, description);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: (err as Error).message });
  }
});

// ── GET /api/fidelite/rewards — Admin : catalogue récompenses ─────────────────
router.get('/rewards', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const rewards = await LoyaltyReward.find().sort({ ordre: 1, points: 1 });
    res.json({ success: true, data: rewards });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// ── POST /api/fidelite/rewards ────────────────────────────────────────────────
router.post('/rewards', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const reward = new LoyaltyReward(req.body);
    await reward.save();
    await logAction(`Récompense fidélité "${reward.nom}" créée`, 'parametre', 'Admin');
    res.status(201).json({ success: true, data: reward });
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: (err as Error).message });
  }
});

// ── PATCH /api/fidelite/rewards/:id ──────────────────────────────────────────
router.patch('/rewards/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const reward = await LoyaltyReward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!reward) { res.status(404).json({ success: false, message: 'Récompense introuvable' }); return; }
    await logAction(`Récompense fidélité "${reward.nom}" modifiée`, 'parametre', 'Admin');
    res.json({ success: true, data: reward });
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: (err as Error).message });
  }
});

// ── DELETE /api/fidelite/rewards/:id ─────────────────────────────────────────
router.delete('/rewards/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const reward = await LoyaltyReward.findByIdAndDelete(req.params.id);
    if (!reward) { res.status(404).json({ success: false, message: 'Récompense introuvable' }); return; }
    await logAction(`Récompense fidélité "${reward.nom}" supprimée`, 'parametre', 'Admin');
    res.json({ success: true, message: 'Récompense supprimée' });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// ── GET /api/fidelite/tiers — Admin : niveaux de fidélité ────────────────────
router.get('/tiers', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await FideliteTier.find().sort({ ordre: 1, pointsMin: 1 });
    res.json({ success: true, data: tiers });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// ── POST /api/fidelite/tiers ──────────────────────────────────────────────────
router.post('/tiers', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const tier = new FideliteTier(req.body);
    await tier.save();
    await logAction(`Niveau fidélité "${tier.nom}" créé`, 'parametre', 'Admin');
    res.status(201).json({ success: true, data: tier });
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: (err as Error).message });
  }
});

// ── PATCH /api/fidelite/tiers/:id ─────────────────────────────────────────────
router.patch('/tiers/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const tier = await FideliteTier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tier) { res.status(404).json({ success: false, message: 'Niveau introuvable' }); return; }
    await logAction(`Niveau fidélité "${tier.nom}" modifié`, 'parametre', 'Admin');
    res.json({ success: true, data: tier });
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: (err as Error).message });
  }
});

// ── DELETE /api/fidelite/tiers/:id ────────────────────────────────────────────
router.delete('/tiers/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const tier = await FideliteTier.findByIdAndDelete(req.params.id);
    if (!tier) { res.status(404).json({ success: false, message: 'Niveau introuvable' }); return; }
    await logAction(`Niveau fidélité "${tier.nom}" supprimé`, 'parametre', 'Admin');
    res.json({ success: true, message: 'Niveau supprimé' });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

export default router;
