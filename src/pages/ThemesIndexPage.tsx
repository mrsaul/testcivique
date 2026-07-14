import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { THEMES, ThemeId } from '@/lib/constants';
import { ArrowRight, BookOpen, Scale, Building2, FileText, MapPin, Users } from 'lucide-react';

const iconMap = { Scale, Building2, FileText, MapPin, Users };

const THEME_TEASERS: Record<ThemeId, string> = {
  principes_valeurs: "Liberté, Égalité, Fraternité, Laïcité et symboles de la République.",
  systeme_institutionnel: "Président, Parlement, Gouvernement, Constitution et Union Européenne.",
  droits_devoirs: "DDHC 1789, droit de vote, libertés fondamentales et devoirs civiques.",
  histoire_geographie: "Dates clés, territoire, régions, culture et patrimoine français.",
  vivre_societe: "École, travail, santé, famille et vie quotidienne en France.",
};

export default function ThemesIndexPage() {
  const themeIds = Object.keys(THEMES) as ThemeId[];

  return (
    <Layout>
      <SEOHead
        title="Les 5 thèmes de l'examen civique français"
        description="Découvrez les 5 thèmes officiels de l'examen civique français : principes, institutions, droits et devoirs, histoire-géographie, vivre en société. Questions gratuites par thème."
      />

      <article className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            Guide complet
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Les 5 thèmes de l'examen civique
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez chaque thème officiel du test civique français : questions
            d'exemple, explications détaillées et conseils pour réussir.
          </p>
        </header>

        <section aria-labelledby="themes-list" className="space-y-4">
          <h2 id="themes-list" className="sr-only">Liste des thèmes</h2>
          <ol className="grid gap-4 md:grid-cols-2">
            {themeIds.map((id, index) => {
              const theme = THEMES[id];
              const Icon = iconMap[theme.icon as keyof typeof iconMap];
              return (
                <li key={id}>
                  <Link
                    to={`/theme/${id}`}
                    className="block h-full group"
                    aria-label={`Découvrir le thème ${theme.name}`}
                  >
                    <Card className="h-full p-6 transition-all hover:shadow-elevated hover:-translate-y-1 hover:border-primary">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Thème {index + 1}
                          </p>
                          <h3 className="text-xl font-display font-bold mt-1 mb-2 group-hover:text-primary transition-colors">
                            {theme.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {THEME_TEASERS[id]}
                          </p>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-4">
                            Découvrir ce thème
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="cta-title" className="mt-16 text-center bg-muted/50 rounded-2xl p-8">
          <h2 id="cta-title" className="text-2xl font-display font-bold mb-3">
            Prêt à vous entraîner ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Créez un compte gratuit et accédez à plus de 300 questions officielles,
            avec examens blancs chronométrés et suivi de progression.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </section>
      </article>
    </Layout>
  );
}
