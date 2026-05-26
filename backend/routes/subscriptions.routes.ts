import { Router, Request, Response } from 'express';
import Subscription from '../models/Subscription.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';

const router = Router();

// ── GET /api/subscriptions ────────────────────────────────────────────────────
router.get('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { statut, search, page = '1', limit = '50' } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (statut && statut !== 'tous') filter.statut = statut;
    if (search) {
      filter.$or = [
        { clientNom:   { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { planName:    { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Subscription.countDocuments(filter);
    const subs  = await Subscription.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();

    res.json({ success: true, data: subs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération abonnements', error: (error as Error).message });
  }
});

// ── GET /api/subscriptions/stats ──────────────────────────────────────────────
router.get('/stats', verifyJWT, async (_req: Request, res: Response): Promise<void> => {
  try {
    const [statuts, revenue] = await Promise.all([
      Subscription.aggregate([{ $group: { _id: '$statut', count: { $sum: 1 } } }]),
      Subscription.aggregate([
        { $match: { statut: 'active' } },
        { $group: { _id: null, mrr: { $sum: '$price' } } },
      ]),
    ]);
    res.json({
      success: true,
      data: {
        parStatut: Object.fromEntries(statuts.map(s => [s._id, s.count])),
        mrr: revenue[0]?.mrr ?? 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur stats', error: (error as Error).message });
  }
});

// ── GET /api/subscriptions/:id ────────────────────────────────────────────────
router.get('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const sub = await Subscription.findById(req.params.id).lean();
    if (!sub) { res.status(404).json({ success: false, message: 'Abonnement introuvable' }); return; }
    res.json({ success: true, data: sub });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/subscriptions — Créer un abonnement (front client) ──────────────
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const sub = new Subscription(req.body);
    await sub.save();
    await logAction(`Abonnement ${sub.planName} créé pour ${sub.clientNom}`, 'commande', sub.clientNom);
    res.status(201).json({ success: true, data: sub });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création abonnement', error: (error as Error).message });
  }
});

// ── PATCH /api/subscriptions/:id/status ──────────────────────────────────────
router.patch('/:id/status', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { statut } = req.body as { statut: 'active' | 'paused' | 'cancelled' };
    const sub = await Subscription.findByIdAndUpdate(req.params.id, { statut }, { new: true });
    if (!sub) { res.status(404).json({ success: false, message: 'Abonnement introuvable' }); return; }
    await logAction(`Abonnement de ${sub.clientNom} : statut → ${statut}`, 'commande', 'Admin');
    res.json({ success: true, data: sub });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur mise à jour statut', error: (error as Error).message });
  }
});

export default router;
