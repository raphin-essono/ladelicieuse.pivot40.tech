import { Router, Request, Response } from 'express';
import FAQ from '../models/FAQ.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';

const router = Router();

// ── GET /api/faqs?page=consultations — Public ─────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = { actif: true };
    if (req.query.page) filter.page = req.query.page;
    const faqs = await FAQ.find(filter).sort({ ordre: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération FAQs', error: (error as Error).message });
  }
});

// ── GET /api/faqs/all — Admin ─────────────────────────────────────────────────
router.get('/all', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.page) filter.page = req.query.page;
    const faqs = await FAQ.find(filter).sort({ page: 1, ordre: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/faqs ────────────────────────────────────────────────────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    await logAction(`FAQ "${faq.question.substring(0, 40)}..." créée`, 'parametre', 'Admin');
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création', error: (error as Error).message });
  }
});

// ── PATCH /api/faqs/:id ───────────────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) { res.status(404).json({ success: false, message: 'FAQ introuvable' }); return; }
    await logAction(`FAQ modifiée (${faq.page})`, 'parametre', 'Admin');
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/faqs/:id ──────────────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) { res.status(404).json({ success: false, message: 'FAQ introuvable' }); return; }
    await logAction(`FAQ supprimée (${faq.page})`, 'parametre', 'Admin');
    res.json({ success: true, message: 'FAQ supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
