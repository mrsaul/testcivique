import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, Target, BookOpen, Trophy, ArrowRight, Flame, Smartphone, Mail, ExternalLink } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Target,
      title: '3 modes d\'entraînement',
      description: 'Quotidien, par thème ou examen blanc pour varier votre apprentissage.',
    },
    {
      icon: BookOpen,
      title: '5 thèmes officiels',
      description: 'Contenu basé sur le programme officiel de l\'examen civique.',
    },
    {
      icon: Flame,
      title: 'Suivi de progression',
      description: 'Visualisez votre évolution et maintenez votre série quotidienne.',
    },
    {
      icon: Trophy,
      title: 'Objectif 80%',
      description: 'Entraînez-vous jusqu\'à atteindre le seuil de réussite de l\'examen.',
    },
  ];

  const themes = [
    'Principes et valeurs de la République',
    'Système institutionnel et politique',
    'Droits et devoirs',
    'Histoire, géographie et culture',
    'Vivre dans la société française',
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <span className="text-lg">🇫🇷</span>
              Préparation à l'Examen Civique
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Réussissez votre{' '}
              <span className="text-gradient">Examen Civique</span>{' '}
              français
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entraînez-vous efficacement avec des questions basées sur le contenu officiel. 
              Atteignez les <strong>80%</strong> requis grâce à un entraînement quotidien personnalisé.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Button size="lg" asChild className="text-lg px-8">
                  <Link to="/dashboard">
                    Continuer l'entraînement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link to="/register">
                      Commencer gratuitement
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/login">
                      J'ai déjà un compte
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Un outil complet pour réussir
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour préparer efficacement votre examen civique.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-card bg-card">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Les 5 thèmes de l'examen
              </h2>
              <p className="text-muted-foreground">
                Maîtrisez chaque thème pour maximiser vos chances de succès.
              </p>
            </div>
            
            <div className="space-y-3">
              {themes.map((theme, index) => (
                <div
                  key={theme}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-sm border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <span className="font-medium">{theme}</span>
                  <CheckCircle className="w-5 h-5 text-success ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Install CTA */}
      <section className="py-10 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 bg-card border rounded-2xl px-6 py-4 shadow-card">
            <Smartphone className="w-6 h-6 text-primary shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-sm">Installez l'app sur votre téléphone</p>
              <p className="text-xs text-muted-foreground">Révisez hors-ligne, comme une vraie application</p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/install">Installer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ressources Officielles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-bold mb-4">
                Ressources Officielles
              </h2>
              <p className="text-muted-foreground">
                Les liens indispensables pour vos démarches administratives.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://formation-civique.interieur.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold flex items-center gap-1">
                    Préparation Officielle
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Plateforme officielle de formation civique du gouvernement.
                  </p>
                </div>
              </a>

              <a
                href="https://www.lefrancaisdesaffaires.fr/candidat/examen-civique/presentation/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold flex items-center gap-1">
                    Inscription à l'examen
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Inscrivez-vous en ligne pour passer votre examen civique.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-10 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Contact :</span>
            <a href="mailto:contact@letestcivique.org" className="text-primary hover:underline font-medium">
              contact@letestcivique.org
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Créez votre compte gratuit et commencez à vous entraîner dès maintenant.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <Link to={user ? '/dashboard' : '/register'}>
              {user ? 'Aller au tableau de bord' : 'Créer mon compte'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
