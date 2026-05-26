import { Router, Request, Response } from 'express';
import DailyMenu from '../models/DailyMenu.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';
import { cache, invalidateCache } from '../middleware/cache.js';

const router = Router();

const invalidateMenu = () => invalidateCache('/api/menu');

// ── GET /api/menu — Menu du jour (public) ─────────────────────────────────────
router.get('/', cache(600), async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const menu = await DailyMenu.findOne({ date: today, published: true }).populate('repas');
    if (!menu) { res.json({ success: true, data: null }); return; }
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération menu', error: (error as Error).message });
  }
});

// ── GET /api/menu/:date — Menu pour une date (public) ─────────────────────────
router.get('/:date', cache(600), async (req: Request, res: Response): Promise<void> => {
  try {
    const menu = await DailyMenu.findOne({ date: req.params.date }).populate('repas');
    if (!menu) { res.status(404).json({ success: false, message: 'Menu introuvable' }); return; }
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── GET /api/menu/admin/list — Liste tous les menus (admin) ──────────────────
router.get('/admin/list', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '30' } = req.query as Record<string, string>;
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await DailyMenu.countDocuments();
    const menus = await DailyMenu.find().sort({ date: -1 }).skip(skip).limit(parseInt(limit)).populate('repas', 'nom prix image');
    res.json({ success: true, data: menus, total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/menu — Créer ou remplacer le menu d'une date (admin) ────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, repas } = req.body as { date: string; repas: string[] };
    const menu = await DailyMenu.findOneAndUpdate(
      { date },
      { date, repas },
      { upsert: true, new: true, runValidators: true }
    );
    await logAction(`Menu du ${date} mis à jour`, 'menu', 'Admin');
    await invalidateMenu();
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création menu', error: (error as Error).message });
  }
});

// ── PATCH /api/menu/:date/publish — Publier / dépublier ──────────────────────
router.patch('/:date/publish', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { published } = req.body as { published: boolean };
    const menu = await DailyMenu.findOneAndUpdate({ date: req.params.date }, { published }, { new: true });
    if (!menu) { res.status(404).json({ success: false, message: 'Menu introuvable' }); return; }
    await logAction(`Menu du ${req.params.date} ${published ? 'publié' : 'dépublié'}`, 'menu', 'Admin');
    await invalidateMenu();
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur publication', error: (error as Error).message });
  }
});

// ── DELETE /api/menu/:date ────────────────────────────────────────────────────
router.delete('/:date', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const menu = await DailyMenu.findOneAndDelete({ date: req.params.date });
    if (!menu) { res.status(404).json({ success: false, message: 'Menu introuvable' }); return; }
    await logAction(`Menu du ${req.params.date} supprimé`, 'menu', 'Admin');
    await invalidateMenu();
    res.json({ success: true, message: 'Menu supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
