import { Router, Request, Response } from 'express';
import HistoryLog from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';

const router = Router();

// ── GET /api/history ──────────────────────────────────────────────────────────
router.get('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, search, page = '1', limit = '100' } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (type && type !== 'tous') filter.type = type;
    if (search) {
      filter.$or = [
        { action: { $regex: search, $options: 'i' } },
        { user:   { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await HistoryLog.countDocuments(filter);
    const logs  = await HistoryLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();

    res.json({ success: true, data: logs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération historique', error: (error as Error).message });
  }
});

// ── DELETE /api/history — Purge (admin) ──────────────────────────────────────
router.delete('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { before } = req.query as { before?: string };
    const filter: Record<string, unknown> = {};
    if (before) filter.createdAt = { $lt: new Date(before) };

    const result = await HistoryLog.deleteMany(filter);
    res.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur purge', error: (error as Error).message });
  }
});

export default router;
