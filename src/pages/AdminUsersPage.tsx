import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldOff, Search, Loader2 } from 'lucide-react';

interface UserRow {
  user_id: string;
  email: string;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const { isAdmin, isLoading } = useAdmin();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { data: users, isFetching } = useQuery({
    queryKey: ['admin-users', query],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_list_users', {
        _search: query || null,
        _limit: 200,
      });
      if (error) throw error;
      return (data ?? []) as UserRow[];
    },
    enabled: isAdmin,
  });

  const grant = useMutation({
    mutationFn: async (uid: string) => {
      const { error } = await supabase.rpc('admin_grant_role', { _user_id: uid, _role: 'admin' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Rôle admin attribué');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: async (uid: string) => {
      const { error } = await supabase.rpc('admin_revoke_role', { _user_id: uid, _role: 'admin' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Rôle admin retiré');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <header>
          <h1 className="text-3xl font-display font-bold">Gestion des rôles</h1>
          <p className="text-muted-foreground">
            Attribuer ou retirer l'accès administrateur aux utilisateurs existants.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
            <CardDescription>Recherche par email ou nom.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setQuery(search.trim());
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="email@exemple.com"
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={isFetching}>
                {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rechercher'}
              </Button>
            </form>

            <div className="divide-y rounded-md border">
              {(users ?? []).length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">Aucun utilisateur.</p>
              )}
              {users?.map((u) => {
                const isSelf = u.user_id === user?.id;
                return (
                  <div
                    key={u.user_id}
                    className="flex items-center justify-between gap-4 p-4 flex-wrap"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{u.email}</span>
                        {u.is_admin && (
                          <Badge variant="default" className="gap-1">
                            <Shield className="w-3 h-3" /> Admin
                          </Badge>
                        )}
                        {isSelf && <Badge variant="outline">Vous</Badge>}
                      </div>
                      {u.display_name && (
                        <p className="text-sm text-muted-foreground truncate">{u.display_name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {u.is_admin ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isSelf || revoke.isPending}
                          onClick={() => {
                            if (confirm(`Retirer le rôle admin à ${u.email} ?`)) {
                              revoke.mutate(u.user_id);
                            }
                          }}
                        >
                          <ShieldOff className="w-4 h-4 mr-2" />
                          Retirer admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled={grant.isPending}
                          onClick={() => {
                            if (confirm(`Attribuer le rôle admin à ${u.email} ?`)) {
                              grant.mutate(u.user_id);
                            }
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Rendre admin
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
