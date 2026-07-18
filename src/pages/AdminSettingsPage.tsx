import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Ticket, BarChart3, Users, ExternalLink, Mail, ShieldCheck, CreditCard } from 'lucide-react';

const sections = [
  {
    to: '/admin/blog',
    icon: FileText,
    title: 'Gestion du Blog',
    description: 'Créer, éditer et publier les articles du blog.',
    cta: 'Ouvrir',
  },
  {
    to: '/admin/codes',
    icon: Ticket,
    title: 'Codes partenaires',
    description: 'Générer et gérer les codes premium pour associations, mairies et centres OFII.',
    cta: 'Ouvrir',
  },
  {
    to: '/admin/emails',
    icon: Mail,
    title: 'Emails envoyés',
    description: 'Historique des envois (succès/échec), timestamps et renvoi manuel.',
    cta: 'Ouvrir',
  },
  {
    to: '/admin/users',
    icon: ShieldCheck,
    title: 'Rôles utilisateurs',
    description: 'Attribuer ou retirer l’accès administrateur aux utilisateurs.',
    cta: 'Ouvrir',
  },
  {
    to: '/admin/payments',
    icon: CreditCard,
    title: 'Paiements Stripe',
    description: 'Consulter les événements Stripe et diagnostiquer les échecs de paiement.',
    cta: 'Ouvrir',
  },

];

const externalTools = [
  {
    href: 'https://search.google.com/search-console',
    icon: BarChart3,
    title: 'Google Search Console',
    description: 'Suivi indexation et performance SEO.',
  },
  {
    href: 'https://analytics.google.com',
    icon: Users,
    title: 'Google Analytics',
    description: 'Statistiques d’audience et conversions.',
  },
];

export default function AdminSettingsPage() {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <header>
          <h1 className="text-3xl font-display font-bold">Paramètres Admin</h1>
          <p className="text-muted-foreground">
            Centre de gestion — accessible uniquement aux administrateurs.
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold mb-4">Modules internes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map(({ to, icon: Icon, title, description, cta }) => (
              <Card key={to} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={to}>
                    <Button className="w-full">{cta}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Outils externes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {externalTools.map(({ href, icon: Icon, title, description }) => (
              <Card key={href}>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {title}
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">Ouvrir</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
