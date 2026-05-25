import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { usePostBySlug } from '@/hooks/useBlogPosts';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DOMPurify from 'dompurify';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePostBySlug(slug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="h-8 w-2/3 bg-muted animate-pulse rounded mb-4" />
          <div className="h-4 w-1/3 bg-muted animate-pulse rounded mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <SEOHead title="Article introuvable" noIndex />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article introuvable</h1>
          <Link to="/blog" className="text-primary hover:underline">
            ← Retour au blog
          </Link>
        </div>
      </Layout>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta_description || post.excerpt || '',
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "url": `https://www.letestcivique.org/blog/${post.slug}`,
    "inLanguage": "fr",
    "author": { "@type": "Organization", "name": "Test Civique", "url": "https://www.letestcivique.org" },
    "publisher": {
      "@type": "Organization",
      "name": "Test Civique",
      "url": "https://www.letestcivique.org",
      "logo": { "@type": "ImageObject", "url": "https://www.letestcivique.org/pwa-icon-512.png" },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.letestcivique.org/blog/${post.slug}` },
    ...(post.cover_image_url ? { "image": post.cover_image_url } : {}),
  };

  return (
    <Layout>
      <SEOHead
        title={post.title}
        description={post.meta_description || post.excerpt || undefined}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4" /> Retour au blog
            </Link>

            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-64 object-cover rounded-xl mb-8"
                loading="lazy"
              />
            )}

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <CalendarDays className="w-4 h-4" />
              {post.published_at && format(new Date(post.published_at), 'd MMMM yyyy', { locale: fr })}
            </div>

            <div
              className="prose prose-slate max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
          </div>
        </div>
      </article>
    </Layout>
  );
}
