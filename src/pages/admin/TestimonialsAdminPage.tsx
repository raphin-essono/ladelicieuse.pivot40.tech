import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { toast } from 'sonner';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/services/adminApiService';

type PageType = 'consultations' | 'abonnement';

interface Testimonial {
  _id: string;
  nom: string;
  texte: string;
  note: number;
  page: PageType;
  actif: boolean;
}

const EMPTY: Omit<Testimonial, '_id'> = { nom: '', texte: '', note: 5, page: 'consultations', actif: true };

export default function TestimonialsAdminPage() {
  const [items, setItems]       = useState<Testimonial[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<PageType>('consultations');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState<Omit<Testimonial, '_id'>>(EMPTY);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    let mounted = true;
    adminGet<{ data: Testimonial[] }>('/testimonials/all')
      .then(r => { if (mounted) setItems(r.data); })
      .catch(() => toast.error('Erreur chargement'))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = items.filter(t => t.page === tab);

  function openNew() { setForm({ ...EMPTY, page: tab }); setEditId(null); setShowForm(true); }
  function openEdit(t: Testimonial) {
    setForm({ nom: t.nom, texte: t.texte, note: t.note, page: t.page, actif: t.actif });
    setEditId(t._id);
    setShowForm(true);
  }
  function closeForm() { setShowForm(false); setEditId(null); }

  async function handleSave() {
    if (!form.nom.trim() || !form.texte.trim()) { toast.error('Nom et témoignage requis'); return; }
    setSaving(true);
    try {
      if (editId) {
        const res = await adminPatch<{ data: Testimonial }>(`/testimonials/${editId}`, form);
        setItems(prev => prev.map(i => i._id === editId ? res.data : i));
        toast.success('Témoignage mis à jour');
      } else {
        const res = await adminPost<{ data: Testimonial }>('/testimonials', form);
        setItems(prev => [...prev, res.data]);
        toast.success('Témoignage créé');
      }
      closeForm();
    } catch { toast.error('Erreur sauvegarde'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, nom: string) {
    if (!confirm(`Supprimer le témoignage de "${nom}" ?`)) return;
    try {
      await adminDelete(`/testimonials/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Témoignage supprimé');
    } catch { toast.error('Erreur suppression'); }
  }

  async function toggleActif(t: Testimonial) {
    try {
      const res = await adminPatch<{ data: Testimonial }>(`/testimonials/${t._id}`, { actif: !t.actif });
      setItems(prev => prev.map(i => i._id === t._id ? res.data : i));
    } catch { toast.error('Erreur'); }
  }

  const PAGE_LABELS: Record<PageType, string> = { consultations: 'Consultations', abonnement: 'Abonnement' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl text-foreground">Témoignages clients</h2>
          <p className="font-body text-sm text-muted-foreground">{items.length} témoignage(s) — gérez les avis affichés sur les pages publiques</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Nouveau témoignage
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['consultations', 'abonnement'] as PageType[]).map(p => (
          <button
            key={p}
            onClick={() => setTab(p)}
            className={`px-4 py-2.5 font-body text-sm transition-colors border-b-2 -mb-px ${tab === p ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {PAGE_LABELS[p]} ({items.filter(t => t.page === p).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-background border border-border rounded-lg p-12 text-center font-body text-sm text-muted-foreground">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-12 text-center font-body text-sm text-muted-foreground">
          Aucun témoignage pour « {PAGE_LABELS[tab]} ». <button onClick={openNew} className="text-primary hover:underline">Ajouter le premier</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(t => (
            <div key={t._id} className={`bg-background border border-border rounded-lg p-4 flex flex-col gap-3 ${!t.actif ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < t.note ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground italic flex-1">"{t.texte}"</p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="font-display text-sm text-foreground">{t.nom}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActif(t)} className={`transition-colors ${t.actif ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {t.actif ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-muted transition-colors"><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(t._id, t.nom)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
          <div className="bg-background rounded-xl w-full max-w-lg p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-foreground">{editId ? 'Modifier' : 'Nouveau'} témoignage</h3>
              <button onClick={closeForm}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Nom *</label>
                  <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} className="w-full h-10 px-3 bg-muted border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ex : Marie-Claire O." />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Note</label>
                  <select value={form.note} onChange={e => setForm(f => ({ ...f, note: Number(e.target.value) }))} className="w-full h-10 px-3 bg-muted border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Page</label>
                <select value={form.page} onChange={e => setForm(f => ({ ...f, page: e.target.value as PageType }))} className="w-full h-10 px-3 bg-muted border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="consultations">Consultations</option>
                  <option value="abonnement">Abonnement</option>
                </select>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Témoignage *</label>
                <textarea value={form.texte} onChange={e => setForm(f => ({ ...f, texte: e.target.value }))} rows={4} className="w-full px-3 py-2 bg-muted border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Ce que le client a dit..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.actif} onChange={e => setForm(f => ({ ...f, actif: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="font-body text-sm text-foreground">Visible sur le site</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={closeForm} className="flex-1 py-2 border border-border rounded-md font-body text-sm hover:bg-muted transition-colors">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
