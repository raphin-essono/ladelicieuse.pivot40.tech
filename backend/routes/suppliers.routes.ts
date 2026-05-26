import { Router, Request, Response } from 'express';
import Supplier from '../models/Supplier.model.js';
import { logAction } from '../models/HistoryLog.model.js';
import { verifyJWT } from './auth.routes.js';

const router = Router();

// ── GET /api/suppliers ────────────────────────────────────────────────────────
router.get('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, actif } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (actif !== undefined) filter.actif = actif === 'true';
    if (search) {
      filter.$or = [
        { nom:     { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
      ];
    }

    const suppliers = await Supplier.find(filter).sort({ nom: 1 }).lean();
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur récupération fournisseurs', error: (error as Error).message });
  }
});

// ── GET /api/suppliers/:id ────────────────────────────────────────────────────
router.get('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.findById(req.params.id).lean();
    if (!supplier) { res.status(404).json({ success: false, message: 'Fournisseur introuvable' }); return; }
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur', error: (error as Error).message });
  }
});

// ── POST /api/suppliers ───────────────────────────────────────────────────────
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    await logAction(`Fournisseur "${supplier.nom}" créé`, 'stock', 'Admin');
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur création fournisseur', error: (error as Error).message });
  }
});

// ── PATCH /api/suppliers/:id ──────────────────────────────────────────────────
router.patch('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!supplier) { res.status(404).json({ success: false, message: 'Fournisseur introuvable' }); return; }
    await logAction(`Fournisseur "${supplier.nom}" modifié`, 'stock', 'Admin');
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erreur modification', error: (error as Error).message });
  }
});

// ── DELETE /api/suppliers/:id ─────────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) { res.status(404).json({ success: false, message: 'Fournisseur introuvable' }); return; }
    await logAction(`Fournisseur "${supplier.nom}" supprimé`, 'stock', 'Admin');
    res.json({ success: true, message: 'Fournisseur supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur suppression', error: (error as Error).message });
  }
});

export default router;
