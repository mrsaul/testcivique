import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { RefreshCw, Send, Mail } from 'lucide-react';

type LogRow = {
  id: string;
  message_id: string | null;
  template_name: string | null;
  recipient_email: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
};

const RANGES = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

function statusVariant(status: string) {
  switch (status) {
    case 'sent':
      return 'default';
    case 'failed':
    case 'dlq':
    case 'bounced':
    case 'complained':
      return 'destructive';
    case 'suppressed':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function AdminEmailsPage() {
  const { isAdmin, isLoading } = useAdmin();
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<keyof typeof RANGES>('7d');
  const [template, setTemplate] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [resending, setResending] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const since = new Date(Date.now() - RANGES[range] * 86400_000).toISOString();
    const { data, error } = await supabase
      .from('email_send_log')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) {
      toast.error('Erreur de chargement', { description: error.message });
      setLoading(false);
      return;
    }
    // Deduplicate by message_id, keep latest
    const map = new Map<string, LogRow>();
    for (const r of (data as LogRow[]) || []) {
      const key = r.message_id || r.id;
      if (!map.has(key)) map.set(key, r);
    }
    setRows(Array.from(map.values()));
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, range]);

  const templates = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.template_name && s.add(r.template_name));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter(
      (r) =>
        (template === 'all' || r.template_name === template) &&
        (status === 'all' || r.status === status),
    );
  }, [rows, template, status]);

  const stats = useMemo(() => {
    const s = { total: filtered.length, sent: 0, failed: 0, suppressed: 0, pending: 0 };
    for (const r of filtered) {
      if (r.status === 'sent') s.sent++;
      else if (['failed', 'dlq', 'bounced', 'complained'].includes(r.status)) s.failed++;
      else if (r.status === 'suppressed') s.suppressed++;
      else if (r.status === 'pending') s.pending++;
    }
    return s;
  }, [filtered]);

  async function resend(row: LogRow) {
    if (!row.template_name || !row.recipient_email) {
      toast.error('Impossible de renvoyer', {
        description: 'Template ou destinataire manquant.',
      });
      return;
    }
    setResending(row.id);
    const { data, error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: row.template_name,
        recipientEmail: row.recipient_email,
        idempotencyKey: `resend-${row.message_id || row.id}-${Date.now()}`,
        templateData: {},
      },
    });
    setResending(null);
    if (error || (data as any)?.error) {
      toast.error('Échec du renvoi', {
        description: error?.message || (data as any)?.error,
      });
      return;
    }
    if ((data as any)?.reason === 'email_suppressed') {
      toast.warning('Email supprimé', {
        description: 'Le destinataire est dans la liste de suppression.',
      });
    } else {
      toast.success('Email renvoyé', {
        description: `${row.template_name} → ${row.recipient_email}`,
      });
    }
    setTimeout(load, 1500);
  }

  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <header className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <Mail className="w-7 h-7 text-primary" />
              Emails envoyés
            </h1>
            <p className="text-muted-foreground">
              Historique des envois, statuts et renvoi manuel.
            </p>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
        </header>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Select value={range} onValueChange={(v) => setRange(v as keyof typeof RANGES)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Dernières 24h</SelectItem>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Template" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les templates</SelectItem>
              {templates.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="sent">Envoyés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échec</SelectItem>
              <SelectItem value="dlq">DLQ</SelectItem>
              <SelectItem value="suppressed">Supprimés</SelectItem>
              <SelectItem value="bounced">Bounced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, color: '' },
            { label: 'Envoyés', value: stats.sent, color: 'text-green-600' },
            { label: 'En attente', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Échec', value: stats.failed, color: 'text-red-600' },
            { label: 'Supprimés', value: stats.suppressed, color: 'text-muted-foreground' },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Erreur</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {loading ? 'Chargement...' : 'Aucun email sur cette période.'}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.slice(0, 200).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.template_name || '—'}</TableCell>
                    <TableCell className="text-sm">{r.recipient_email || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(r.status) as any}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-xs text-red-600 max-w-xs truncate">
                      {r.error_message || ''}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={resending === r.id || !r.recipient_email || !r.template_name}
                        onClick={() => resend(r)}
                      >
                        <Send className={`w-3.5 h-3.5 mr-1 ${resending === r.id ? 'animate-pulse' : ''}`} />
                        Renvoyer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {filtered.length > 200 && (
          <p className="text-xs text-muted-foreground text-center">
            Affichage limité aux 200 premiers résultats. Affinez les filtres pour voir plus.
          </p>
        )}
      </div>
    </Layout>
  );
}
