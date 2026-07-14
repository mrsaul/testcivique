import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { TableOfContents } from '@/components/seo/TableOfContents';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { THEMES, ThemeId } from '@/lib/constants';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap } from 'lucide-react';

const THEME_CONTENT: Record<ThemeId, { intro: string; longDesc: string; keywords: string[] }> = {
  principes_valeurs: {
    intro: "Comprendre les principes fondateurs de la République française : Liberté, Égalité, Fraternité, Laïcité et les symboles nationaux.",
    longDesc: "Les principes et valeurs de la République constituent le socle de la citoyenneté française. Ils sont hérités de la Révolution de 1789 et inscrits dans la Constitution. La devise « Liberté, Égalité, Fraternité », le drapeau tricolore, La Marseillaise, Marianne et le 14 juillet sont autant de symboles que tout candidat à la naturalisation doit connaître.",
    keywords: ['laïcité', 'devise républicaine', 'Marianne', '14 juillet', 'drapeau français'],
  },
  systeme_institutionnel: {
    intro: "Maîtriser le fonctionnement des institutions françaises : Président, Parlement, Gouvernement et Union Européenne.",
    longDesc: "La Ve République repose sur une séparation des pouvoirs entre l'exécutif (Président et Gouvernement), le législatif (Assemblée nationale et Sénat) et le judiciaire. La France est aussi membre fondateur de l'Union Européenne. Bien comprendre ce système est essentiel pour réussir l'examen civique.",
    keywords: ['Président de la République', 'Assemblée nationale', 'Sénat', 'Constitution', 'Union Européenne'],
  },
  droits_devoirs: {
    intro: "Connaître les droits fondamentaux et devoirs civiques de tout citoyen français : DDHC, vote, libertés et responsabilités.",
    longDesc: "La Déclaration des droits de l'homme et du citoyen de 1789 est le texte fondateur des droits en France. Les citoyens bénéficient de nombreuses libertés (expression, réunion, culte) et ont des devoirs (respect des lois, impôts, défense). Le droit de vote est le pilier de la démocratie française.",
    keywords: ['droit de vote', 'DDHC 1789', 'libertés fondamentales', 'devoirs civiques', 'égalité'],
  },
  histoire_geographie: {
    intro: "Réviser l'histoire, la géographie, les dates clés et la culture française indispensables à l'examen civique.",
    longDesc: "De Clovis à la Ve République, l'histoire de France est jalonnée d'événements fondateurs : Révolution française, Empires, deux guerres mondiales, construction européenne. La géographie du territoire (métropole, DROM-COM), les régions et la culture (arts, gastronomie, patrimoine) font partie du programme officiel.",
    keywords: ['Révolution française', 'De Gaulle', 'régions françaises', 'patrimoine', 'histoire de France'],
  },
  vivre_societe: {
    intro: "Découvrir la vie quotidienne en France : éducation, santé, travail, famille et intégration dans la société française.",
    longDesc: "Vivre en France, c'est comprendre l'école républicaine, la Sécurité sociale, le monde du travail, la famille moderne, le logement et les services publics. Ce thème couvre la vie pratique et les codes sociaux essentiels pour bien s'intégrer dans la société française.",
    keywords: ['école républicaine', 'Sécurité sociale', 'travail en France', 'famille', 'services publics'],
  },
};

interface QuestionRow {
  id: string;
  question: string;
  options: string[];
  explanation: string | null;
  difficulty: string;
}

export default function ThemeLandingPage() {
  const { themeId } = useParams<{ themeId: string }>();
  const location = useLocation();

  const validThemeId = themeId as ThemeId;
  const theme = THEMES[validThemeId];

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['theme-landing-questions', validThemeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('id, question, options, explanation, difficulty')
        .eq('theme', validThemeId)
        .limit(15);
      if (error) throw error;
      return (data as QuestionRow[]) || [];
    },
    enabled: !!theme,
  });

  // Inject a FAQPage JSON-LD built from the theme's questions once loaded
  useEffect(() => {
    document.querySelectorAll('script[data-theme-faq]').forEach((el) => el.remove());
    if (!theme || questions.length === 0) return;
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'fr',
      mainEntity: questions.slice(0, 12).map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.explanation || q.options.join(' • '),
        },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-theme-faq', validThemeId);
    script.text = JSON.stringify(faq);
    document.head.appendChild(script);
    return () => {
      document.querySelectorAll('script[data-theme-faq]').forEach((el) => el.remove());
    };
  }, [theme, questions, validThemeId]);

  const previewQuestions = useMemo(() => questions.slice(0, 15), [questions]);

  if (!theme) return <Navigate to="/" replace />;

  const seoTitle = `${theme.name} — Examen Civique Français (Questions & Révisions)`;
  const seoDesc = `${THEME_CONTENT[validThemeId].intro} ${questions.length > 0 ? `${questions.length} questions officielles avec explications.` : ''}`;
  const canonical = `https://www.letestcivique.org${location.pathname}`;

  return (
    <Layout>
      <SEOHead title={seoTitle} description={seoDesc} canonical={canonical} />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="space-y-4 mb-8">
          <Badge variant="secondary" className="w-fit">
            Thème officiel de l'examen civique
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">
            {theme.name} — Examen Civique Français
          </h1>
          <p className="text-lg text-muted-foreground">
            {THEME_CONTENT[validThemeId].intro}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {THEME_CONTENT[validThemeId].keywords.map((k) => (
              <Badge key={k} variant="outline">{k}</Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button asChild size="lg">
              <Link to={`/quiz/theme/${validThemeId}`}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Commencer le quiz gratuit
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <TableOfContents />

        <section aria-labelledby="a-propos" className="mt-10 space-y-3">
          <h2 id="a-propos" className="text-2xl font-display font-semibold">
            À propos de ce thème
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {THEME_CONTENT[validThemeId].longDesc}
          </p>
        </section>

        <section aria-labelledby="questions" className="mt-10 space-y-6">
          <h2 id="questions" className="text-2xl font-display font-semibold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Questions d'entraînement gratuites ({previewQuestions.length})
          </h2>
          <p className="text-muted-foreground">
            Voici un échantillon de questions officielles de ce thème avec leurs explications, accessibles gratuitement.
          </p>
          {isLoading && <p className="text-sm text-muted-foreground">Chargement des questions…</p>}
          <ol className="space-y-6 list-none pl-0">
            {previewQuestions.map((q, idx) => (
              <li key={q.id}>
                <Card className="p-5 space-y-3">
                  <h3 className="text-base md:text-lg font-semibold">
                    <span className="text-primary mr-2">Q{idx + 1}.</span>
                    {q.question}
                  </h3>
                  <ul className="space-y-1.5 text-sm">
                    {q.options.map((opt, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-muted-foreground min-w-[1.25rem]">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                  {q.explanation && (
                    <div className="pt-2 border-t flex gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Explication :</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cta" className="mt-12">
          <Card className="p-6 md:p-8 text-center space-y-4 bg-gradient-to-br from-primary/5 to-primary/10">
            <h2 id="cta" className="text-2xl font-display font-bold">
              Prêt à réussir votre examen civique ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Accédez à plus de 300 questions officielles, des examens blancs chronométrés et un suivi de progression personnalisé.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild size="lg">
                <Link to="/register">Créer mon compte gratuit</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/home">Découvrir l'application</Link>
              </Button>
            </div>
          </Card>
        </section>

        <nav aria-labelledby="autres-themes" className="mt-12 space-y-4">
          <h2 id="autres-themes" className="text-2xl font-display font-semibold">
            Explorer les autres thèmes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(THEMES) as ThemeId[])
              .filter((t) => t !== validThemeId)
              .map((t) => (
                <Link
                  key={t}
                  to={`/theme/${t}`}
                  className="block p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors"
                >
                  <div className="font-semibold">{THEMES[t].name}</div>
                  <div className="text-sm text-muted-foreground">{THEMES[t].description}</div>
                </Link>
              ))}
          </div>
        </nav>
      </article>
    </Layout>
  );
}
