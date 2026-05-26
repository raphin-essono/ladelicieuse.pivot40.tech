import { Router, Request, Response } from 'express';
import Category from '../models/Category.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';
import { cache, invalidateCache } from '../middleware/cache.js';

const router = Router();

const invalidateCategories = () => invalidateCache('/api/categories');

// ── GET /api/categories — Public (actives seulement) ─────────────────────────
router.get('/', cache(600), async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ active: true }).sort({ ordre: 1, nom: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération catégories', error: (error as Error).message });
  }
});

// ── GET /api/categories/all — Admin (toutes, pas de cache) ───────────────────
router.get('/all', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ ordre: 1, nom: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/categories ──────────────────────────────────────────────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const category = new Category(req.body);
    await category.save();
    await logAction(`Catégorie "${category.nom}" créée`, 'menu', 'Admin');
    await invalidateCategories();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création catégorie', error: (error as Error).message });
  }
});

// ── PATCH /api/categories/:id ─────────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) { res.status(404).json({ success: false, message: 'Catégorie introuvable' }); return; }
    await logAction(`Catégorie "${category.nom}" modifiée`, 'menu', 'Admin');
    await invalidateCategories();
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/categories/:id ────────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) { res.status(404).json({ success: false, message: 'Catégorie introuvable' }); return; }
    await logAction(`Catégorie "${category.nom}" supprimée`, 'menu', 'Admin');
    await invalidateCategories();
    res.json({ success: true, message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
