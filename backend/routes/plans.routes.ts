import { Router, Request, Response } from 'express';
import Plan from '../models/Plan.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';

const router = Router();

// ── GET /api/plans — Public ───────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const plans = await Plan.find({ actif: true }).sort({ ordre: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération plans', error: (error as Error).message });
  }
});

// ── GET /api/plans/all — Admin ────────────────────────────────────────────────
router.get('/all', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const plans = await Plan.find().sort({ ordre: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/plans ───────────────────────────────────────────────────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    await logAction(`Plan "${plan.nom}" créé`, 'parametre', 'Admin');
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création', error: (error as Error).message });
  }
});

// ── PATCH /api/plans/:id ──────────────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) { res.status(404).json({ success: false, message: 'Plan introuvable' }); return; }
    await logAction(`Plan "${plan.nom}" modifié`, 'parametre', 'Admin');
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/plans/:id ─────────────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) { res.status(404).json({ success: false, message: 'Plan introuvable' }); return; }
    await logAction(`Plan "${plan.nom}" supprimé`, 'parametre', 'Admin');
    res.json({ success: true, message: 'Plan supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
