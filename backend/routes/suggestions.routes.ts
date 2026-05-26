import { Router, Request, Response } from 'express';
import Suggestion from '../models/Suggestion.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';
import { cache, invalidateCache } from '../middleware/cache.js';

const router = Router();

const invalidateSuggestions = () => invalidateCache('/api/suggestions');

// ── GET /api/suggestions — Public (actives, filtrables par type) ──────────────
router.get('/', cache(300), async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = { actif: true };
    if (req.query.type) filter.type = req.query.type;
    const suggestions = await Suggestion.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération suggestions', error: (error as Error).message });
  }
});

// ── GET /api/suggestions/all — Admin (toutes, filtrables, pas de cache) ───────
router.get('/all', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.actif !== undefined) filter.actif = req.query.actif === 'true';
    const suggestions = await Suggestion.find(filter).sort({ type: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/suggestions ─────────────────────────────────────────────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const suggestion = new Suggestion(req.body);
    await suggestion.save();
    await logAction(`Suggestion "${suggestion.nom}" créée`, 'menu', 'Admin');
    await invalidateSuggestions();
    res.status(201).json({ success: true, data: suggestion });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création suggestion', error: (error as Error).message });
  }
});

// ── PATCH /api/suggestions/:id ────────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!suggestion) { res.status(404).json({ success: false, message: 'Suggestion introuvable' }); return; }
    await logAction(`Suggestion "${suggestion.nom}" modifiée`, 'menu', 'Admin');
    await invalidateSuggestions();
    res.json({ success: true, data: suggestion });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/suggestions/:id ───────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) { res.status(404).json({ success: false, message: 'Suggestion introuvable' }); return; }
    await logAction(`Suggestion "${suggestion.nom}" supprimée`, 'menu', 'Admin');
    await invalidateSuggestions();
    res.json({ success: true, message: 'Suggestion supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
