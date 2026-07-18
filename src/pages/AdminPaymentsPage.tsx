import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RefreshCw, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

type PaymentEvent = {
  id: string;
  stripe_event_id: string | null;
  event_type: string;
  status: string;
  user_id: string | null;
  user_email: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount: number | null;
  currency: string | null;
  error_message: string | null;
  payload: unknown;
  created_at: string;
};

const statusVariant = (s: string) => {
  if (s === 'premium_activated') return { icon: CheckCircle2, cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' };
  if (s === 'failed' || s === 'handler_error') return { icon: XCircle, cls: 'bg-destructive/15 text-destructive' };
  if (s === 'unmatched_user' || s === 'skipped_not_paid') return { icon: AlertCircle, cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' };
  return { icon: Clock, cls: 'bg-muted text-muted-foreground' };
};

const fmtAmount = (a: number | null, c: string | null) => {
  if (a == null) return '—';
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: (c || 'eur').toUpperCase() }).format(a / 100);
  } catch {
    return `${(a / 100).toFixed(2)} ${c ?? ''}`;
  }
};

export default function AdminPaymentsPage() {
  const { isAdmin, isLoading } = useAdmin();
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PaymentEvent | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('payment_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setEvents((data as PaymentEvent[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      [e.event_type, e.status, e.user_email, e.stripe_session_id, e.stripe_payment_intent_id, e.error_message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [events, search]);

  const stats = useMemo(() => {
    const total = events.length;
    const success = events.filter((e) => e.status === 'premium_activated').length;
    const failed = events.filter((e) => ['failed', 'handler_error'].includes(e.status)).length;
    const unmatched = events.filter((e) => e.status === 'unmatched_user').length;
    return { total, success, failed, unmatched };
  }, [events]);

  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <header className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-display font-bold">Événements de paiement</h1>
            <p className="text-muted-foreground">
              Journal des webhooks Stripe pour diagnostiquer les échecs de paiement.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Premium activé', value: stats.success },
            { label: 'Échecs', value: stats.failed },
            { label: 'Utilisateur non trouvé', value: stats.unmatched },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Derniers événements ({filtered.length})</CardTitle>
            <Input
              placeholder="Rechercher (email, session id, type, erreur…)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Session / Erreur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => {
                  const { icon: Icon, cls } = statusVariant(e.status);
                  return (
                    <TableRow
                      key={e.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(e)}
                    >
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(e.created_at).toLocaleString('fr-FR')}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{e.event_type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cls}>
                          <Icon className="w-3 h-3 mr-1" />
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{e.user_email ?? '—'}</TableCell>
                      <TableCell className="text-xs">{fmtAmount(e.amount, e.currency)}</TableCell>
                      <TableCell className="text-xs max-w-[280px] truncate">
                        {e.error_message || e.stripe_session_id || '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!filtered.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucun événement.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="font-mono text-sm">
                {selected?.event_type} — {selected?.status}
              </DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-3 overflow-auto text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Event ID:</span> <span className="font-mono text-xs">{selected.stripe_event_id}</span></div>
                  <div><span className="text-muted-foreground">Date:</span> {new Date(selected.created_at).toLocaleString('fr-FR')}</div>
                  <div><span className="text-muted-foreground">Email:</span> {selected.user_email ?? '—'}</div>
                  <div><span className="text-muted-foreground">User ID:</span> <span className="font-mono text-xs">{selected.user_id ?? '—'}</span></div>
                  <div><span className="text-muted-foreground">Session:</span> <span className="font-mono text-xs">{selected.stripe_session_id ?? '—'}</span></div>
                  <div><span className="text-muted-foreground">PaymentIntent:</span> <span className="font-mono text-xs">{selected.stripe_payment_intent_id ?? '—'}</span></div>
                  <div><span className="text-muted-foreground">Montant:</span> {fmtAmount(selected.amount, selected.currency)}</div>
                </div>
                {selected.error_message && (
                  <div className="p-3 rounded bg-destructive/10 text-destructive text-xs">
                    {selected.error_message}
                  </div>
                )}
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Payload Stripe</div>
                  <pre className="bg-muted rounded p-3 text-xs overflow-auto max-h-[40vh]">
                    {JSON.stringify(selected.payload, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
