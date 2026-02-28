import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAdmin } from '@/hooks/useAdmin';
import { useAllPosts, useSavePost, useDeletePost, BlogPost } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '@/components/blog/RichTextEditor';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminBlogPage() {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { data: posts, isLoading: postsLoading } = useAllPosts();
  const savePost = useSavePost();
  const deletePost = useDeletePost();

  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);

  if (adminLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSave = async () => {
    if (!editing?.title || !editing?.content) {
      toast.error('Titre et contenu sont requis');
      return;
    }
    const slug = editing.slug || slugify(editing.title);
    try {
      await savePost.mutateAsync({
        ...editing,
        slug,
        title: editing.title,
        content: editing.content,
      } as any);
      toast.success(editing.id ? 'Article mis à jour' : 'Article créé');
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      await deletePost.mutateAsync(id);
      toast.success('Article supprimé');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (editing) {
    return (
      <Layout>
        <SEOHead title="Éditeur d'article" noIndex />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button variant="ghost" onClick={() => setEditing(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
          </Button>

          <h1 className="text-2xl font-bold mb-6">{editing.id ? 'Modifier l\'article' : 'Nouvel article'}</h1>

          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={editing.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Titre de l'article"
              />
            </div>

            <div>
              <Label>Slug (URL)</Label>
              <Input
                value={editing.slug || ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder={editing.title ? slugify(editing.title) : 'mon-article'}
              />
            </div>

            <div>
              <Label>Extrait</Label>
              <Textarea
                value={editing.excerpt || ''}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                placeholder="Court résumé affiché dans la liste du blog"
                rows={2}
              />
            </div>

            <div>
              <Label>Meta description (SEO)</Label>
              <Textarea
                value={editing.meta_description || ''}
                onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                placeholder="Description pour les moteurs de recherche (max 160 car.)"
                rows={2}
              />
            </div>

            <div>
              <Label>Image de couverture (URL)</Label>
              <Input
                value={editing.cover_image_url || ''}
                onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Contenu</Label>
              <RichTextEditor
                content={editing.content || ''}
                onChange={(html) => setEditing({ ...editing, content: html })}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={editing.published || false}
                onCheckedChange={(v) => setEditing({ ...editing, published: v })}
              />
              <Label>Publié</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={savePost.isPending}>
                {savePost.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Admin Blog" noIndex />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestion du Blog</h1>
          <Button onClick={() => setEditing({ title: '', content: '', published: false })}>
            <Plus className="w-4 h-4 mr-2" /> Nouvel article
          </Button>
        </div>

        {postsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : !posts?.length ? (
          <p className="text-muted-foreground text-center py-12">Aucun article. Créez le premier !</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {post.published ? (
                        <Eye className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <h3 className="font-semibold truncate">{post.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(post.created_at), 'd MMM yyyy', { locale: fr })} · /blog/{post.slug}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(post.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
