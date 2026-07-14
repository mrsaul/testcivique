import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPartnerCodesPage() {
  const { isAdmin, isLoading } = useAdmin();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: '',
    partner_name: '',
    duration_months: 6,
    max_uses: '' as string | number,
  });

  const { data: codes = [], isLoading: codesLoading } = useQuery({
    queryKey: ['partner-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_codes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { error } = await supabase.from('partner_codes').insert({
        code: form.code.trim().toUpperCase(),
        partner_name: form.partner_name.trim(),
        duration_months: Number(form.duration_months) || 6,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
      });
      if (error) throw error;
      toast.success('Code créé');
      setForm({ code: '', partner_name: '', duration_months: 6, max_uses: '' });
      queryClient.invalidateQueries({ queryKey: ['partner-codes'] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase
      .from('partner_codes')
      .update({ is_active: !is_active })
      .eq('id', id);
    if (error) return toast.error(error.message);
    queryClient.invalidateQueries({ queryKey: ['partner-codes'] });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Codes partenaires</h1>
          <p className="text-muted-foreground">
            Générez des codes premium gratuits pour associations, mairies et centres partenaires.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" /> Nouveau code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Code</Label>
                <Input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="CIMADE2026"
                  maxLength={40}
                />
              </div>
              <div>
                <Label>Nom du partenaire</Label>
                <Input
                  required
                  value={form.partner_name}
                  onChange={(e) => setForm({ ...form, partner_name: e.target.value })}
                  placeholder="La Cimade"
                />
              </div>
              <div>
                <Label>Durée (mois)</Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.duration_months}
                  onChange={(e) => setForm({ ...form, duration_months: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Utilisations max (vide = illimité)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  placeholder="50"
                />
              </div>
              <Button type="submit" disabled={creating} className="sm:col-span-2">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer le code'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Codes existants</CardTitle>
          </CardHeader>
          <CardContent>
            {codesLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : codes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun code créé.</p>
            ) : (
              <div className="space-y-3">
                {codes.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-primary">{c.code}</code>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => {
                            navigator.clipboard.writeText(c.code);
                            toast.success('Copié');
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {c.partner_name} · {c.duration_months} mois · {c.used_count}
                        {c.max_uses ? `/${c.max_uses}` : ''} utilisations
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={c.is_active}
                        onCheckedChange={() => toggleActive(c.id, c.is_active)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {c.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
