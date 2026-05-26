import { Search, UserCheck, UserX, Eye, X, Mail, Phone, Star, Award, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { adminGet, adminDelete } from '@/services/adminApiService';

interface RawUser {
  _id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  adresse: string;
  points: number;
  tier: 'bronze' | 'argent' | 'or' | 'platine';
  statut: 'actif' | 'inactif';
  emailVerified: boolean;
  subscription?: { planName: string; status: string; billing: string; endDate: string };
  createdAt: string;
}

const TIER_COLOR: Record<string, string> = {
  bronze:  'bg-amber-100 text-amber-800',
  argent:  'bg-gray-100 text-gray-700',
  or:      'bg-yellow-100 text-yellow-800',
  platine: 'bg-violet-100 text-violet-700',
};

const TIER_LABEL: Record<string, string> = {
  bronze: 'Bronze', argent: 'Argent', or: 'Or', platine: 'Platine',
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR');

function Skeleton() {
  return (
    <tr className="border-b border-border/50">
      {[1,2,3,4,5].map(i => (
        <td key={i} className="p-4"><div className="h-4 bg-muted rounded animate-pulse" /></td>
      ))}
    </tr>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<RawUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<RawUser | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await adminGet<{ data: RawUser[]; total: number }>('/users?limit=500');
        if (mounted) setUsers(res.data);
      } catch {
        if (mounted) toast.error('Erreur chargement utilisateurs');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function handleDelete(userId: string) {
    setDeleting(true);
    try {
      await adminDelete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setSelectedUser(null);
      setConfirmDeleteId(null);
      toast.success('Utilisateur supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  }

  const stats = useMemo(() => {
    const actifs = users.filter(u => u.statut === 'actif').length;
    const abonnes = users.filter(u => u.subscription?.status === 'active').length;
    const avgPoints = users.length ? Math.round(users.reduce((s, u) => s + u.points, 0) / users.length) : 0;
    return { total: users.length, actifs, abonnes, avgPoints };
  }, [users]);

  const filtered = users.filter(u =>
    !search
    || u.nom.toLowerCase().includes(search.toLowerCase())
    || (u.prenoms || '').toLowerCase().includes(search.toLowerCase())
    || u.email.toLowerCase().includes(search.toLowerCase())
    || u.telephone.includes(search)
  );

  return (
    <div className="space-y-6 bg-muted/30 -m-6 p-6 min-h-screen">
      <div>
        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-1">Utilisateurs</h2>
        <p className="font-body text-sm text-muted-foreground">{stats.total} clients enregistrés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Total clients</p>
          {loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse mt-1" /> : <p className="font-display text-2xl text-foreground mt-1">{stats.total}</p>}
        </div>
        <div className="bg-background border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Actifs</p>
          {loading ? <div className="h-8 w-12 bg-muted rounded animate-pulse mt-1" /> : <p className="font-display text-2xl text-secondary mt-1">{stats.actifs}</p>}
        </div>
        <div className="bg-background border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Abonnés actifs</p>
          {loading ? <div className="h-8 w-12 bg-muted rounded animate-pulse mt-1" /> : <p className="font-display text-2xl text-foreground mt-1">{stats.abonnes}</p>}
        </div>
        <div className="bg-background border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Points moyens</p>
          {loading ? <div className="h-8 w-12 bg-muted rounded animate-pulse mt-1" /> : <p className="font-display text-2xl text-foreground mt-1">{stats.avgPoints}</p>}
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, email, téléphone…"
          className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div className="bg-background border border-border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Client</th>
              <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Téléphone</th>
              <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Points</th>
              <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Tier</th>
              <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Statut</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
              : filtered.map(u => (
                  <tr key={u._id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <td className="p-4">
                      <p className="font-body font-medium text-foreground">{u.prenoms ? `${u.prenoms} ${u.nom}` : u.nom}</p>
                      <p className="font-body text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="p-4 font-body text-muted-foreground hidden md:table-cell">{u.telephone || '—'}</td>
                    <td className="p-4 font-body text-foreground hidden lg:table-cell">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{u.points}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-medium ${TIER_COLOR[u.tier]}`}>
                        <Award className="w-3 h-3" />{TIER_LABEL[u.tier]}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body ${u.statut === 'actif' ? 'bg-secondary/20 text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {u.statut === 'actif' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {u.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
            }
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 font-body text-sm text-muted-foreground">Aucun utilisateur trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation suppression */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/70 px-4">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h4 className="font-display text-lg text-foreground">Supprimer l'utilisateur</h4>
                <p className="font-body text-sm text-muted-foreground">Cette action est irréversible.</p>
              </div>
            </div>
            <p className="font-body text-sm text-foreground">
              Voulez-vous vraiment supprimer <strong>{(() => { const u = users.find(u => u._id === confirmDeleteId); return u ? (u.prenoms ? `${u.prenoms} ${u.nom}` : u.nom) : ''; })()}</strong> ?
              Toutes ses données seront effacées définitivement.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-body border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-body bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 px-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="font-display text-xl text-foreground">
                  {selectedUser.prenoms ? `${selectedUser.prenoms} ${selectedUser.nom}` : selectedUser.nom}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-medium ${TIER_COLOR[selectedUser.tier]}`}>
                  <Award className="w-3 h-3" />{TIER_LABEL[selectedUser.tier]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmDeleteId(selectedUser._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Supprimer
                </button>
                <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-sm font-body text-foreground">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{selectedUser.email}</span>
                  {selectedUser.emailVerified && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Vérifié</span>}
                </div>
                {selectedUser.telephone && (
                  <div className="flex items-center gap-2 text-sm font-body text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" /> {selectedUser.telephone}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="font-display text-xl text-foreground flex items-center justify-center gap-1"><Star className="w-4 h-4 text-amber-400" />{selectedUser.points}</p>
                  <p className="font-body text-xs text-muted-foreground">Points</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-medium ${TIER_COLOR[selectedUser.tier]}`}>
                    {TIER_LABEL[selectedUser.tier]}
                  </span>
                  <p className="font-body text-xs text-muted-foreground mt-1">Tier</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="font-display text-sm text-foreground">{fmtDate(selectedUser.createdAt)}</p>
                  <p className="font-body text-xs text-muted-foreground">Inscrit</p>
                </div>
              </div>
              {selectedUser.adresse && (
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Adresse</p>
                  <p className="font-body text-sm text-foreground">{selectedUser.adresse}</p>
                </div>
              )}
              {selectedUser.subscription && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Abonnement</p>
                  <p className="font-body text-sm font-medium text-foreground">{selectedUser.subscription.planName}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {selectedUser.subscription.billing === 'monthly' ? 'Mensuel' : 'Annuel'} · expire le {fmtDate(selectedUser.subscription.endDate)}
                  </p>
                  <span className={`inline-block mt-1 text-xs font-body px-2 py-0.5 rounded-full ${selectedUser.subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {selectedUser.subscription.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
