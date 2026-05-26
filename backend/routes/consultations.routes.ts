import { Router, Request, Response } from 'express';
import Consultation from '../models/Consultation.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';

const router = Router();

// ── GET /api/consultations — Public ──────────────────────────────────────────
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const consultations = await Consultation.find({ actif: true }).sort({ ordre: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération consultations', error: (error as Error).message });
  }
});

// ── GET /api/consultations/all — Admin ────────────────────────────────────────
router.get('/all', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const consultations = await Consultation.find().sort({ ordre: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/consultations ───────────────────────────────────────────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    await logAction(`Consultation "${consultation.titre}" créée`, 'parametre', 'Admin');
    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création', error: (error as Error).message });
  }
});

// ── PATCH /api/consultations/:id ──────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!consultation) { res.status(404).json({ success: false, message: 'Consultation introuvable' }); return; }
    await logAction(`Consultation "${consultation.titre}" modifiée`, 'parametre', 'Admin');
    res.json({ success: true, data: consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/consultations/:id ─────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) { res.status(404).json({ success: false, message: 'Consultation introuvable' }); return; }
    await logAction(`Consultation "${consultation.titre}" supprimée`, 'parametre', 'Admin');
    res.json({ success: true, message: 'Consultation supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
