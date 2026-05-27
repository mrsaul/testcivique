import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { usePublishedPosts } from '@/hooks/useBlogPosts';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog – Test Civique",
  "url": "https://testcivique.lovable.app/blog",
  "description": "Articles et conseils pour réussir votre examen civique français.",
  "inLanguage": "fr",
};

export default function BlogPage() {
  const { data: posts, isLoading } = usePublishedPosts();

  return (
    <Layout>
      <SEOHead
        title="Blog"
        description="Articles et conseils pour réussir votre examen civique français. Découvrez nos guides thématiques."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-display font-bold mb-4">Blog</h1>
            <p className="text-muted-foreground mb-10">
              Articles et conseils pour réussir votre examen civique français.
            </p>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : !posts?.length ? (
              <p className="text-muted-foreground text-center py-12">Aucun article publié pour le moment.</p>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug.replace(/^\/+|\/+$/g, '')}`}>
                    <Card className="hover:shadow-md transition-shadow border bg-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {post.published_at && format(new Date(post.published_at), 'd MMMM yyyy', { locale: fr })}
                        </div>
                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">{post.title}</h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                        )}
                        <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3">
                          Lire l'article <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
