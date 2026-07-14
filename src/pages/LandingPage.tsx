import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, Target, BookOpen, Trophy, ArrowRight, Flame, Smartphone, Download, ExternalLink } from 'lucide-react';
import { generateQuestionsPDF } from '@/lib/generate-pdf';
import { PricingSection } from '@/components/landing/PricingSection';
import { useTranslation } from 'react-i18next';
import { getFaqs } from '@/lib/seo-schema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TableOfContents } from '@/components/seo/TableOfContents';

export default function LandingPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const faqs = getFaqs(i18n.language);


  const features = [
    { icon: Target, title: t('features.trainingModes'), description: t('features.trainingModesDesc') },
    { icon: BookOpen, title: t('features.officialThemes'), description: t('features.officialThemesDesc') },
    { icon: Flame, title: t('features.progressTracking'), description: t('features.progressTrackingDesc') },
    { icon: Trophy, title: t('features.goal80'), description: t('features.goal80Desc') },
  ];

  const themeKeys = [
    { key: 'principes', slug: 'principes_valeurs' },
    { key: 'institutions', slug: 'systeme_institutionnel' },
    { key: 'droits', slug: 'droits_devoirs' },
    { key: 'histoire', slug: 'histoire_geographie' },
    { key: 'vivre', slug: 'vivre_societe' },
  ] as const;

  return (
    <Layout>
      <SEOHead
        faq
        title="Préparation Examen Civique – Quiz & 300+ questions"
        description="Réussissez l'examen civique français : 5 thèmes officiels, 300+ questions, quiz interactifs, suivi de progression et examens blancs chronométrés."
      />


      <article>
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <span className="text-lg">🇫🇷</span>
              {t('landing.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              {t('landing.title')}{' '}
              <span className="text-gradient">{t('landing.titleHighlight')}</span>{' '}
              {t('landing.titleEnd')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: t('landing.subtitle') }} />
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Button size="lg" asChild className="text-lg px-8">
                  <Link to="/dashboard">{t('landing.continuePractice')}<ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link to="/register">{t('landing.startFree')}<ArrowRight className="w-5 h-5 ml-2" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/login">{t('landing.hasAccount')}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="container mx-auto px-4 -mt-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <TableOfContents title={t('toc.title', 'Sommaire')} />
        </div>
      </div>

      {/* Features */}
      <section id="features" aria-labelledby="features-title" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="features-title" className="text-3xl font-display font-bold mb-4">{t('landing.featuresTitle')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('landing.featuresSubtitle')}</p>
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

      {/* Themes */}
      <section id="themes" aria-labelledby="themes-title" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="themes-title" className="text-3xl font-display font-bold mb-4">{t('landing.themesTitle')}</h2>
              <p className="text-muted-foreground">{t('landing.themesSubtitle')}</p>
            </div>
            <ol className="space-y-3">
              {themeKeys.map(({ key, slug }, index) => (
                <li key={key}>
                  <Link
                    to={`/theme/${slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-sm border hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">{index + 1}</div>
                    <h3 className="font-medium text-base m-0">{t(`themes.${key}`)}</h3>
                    <CheckCircle className="w-5 h-5 text-success ml-auto" />
                  </Link>
                </li>
              ))}
            </ol>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/themes-guide">
                  Voir tous les thèmes en détail
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" aria-label="Pricing">
        <PricingSection />
      </section>

      {/* Install CTA */}
      <aside className="py-10 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 bg-card border rounded-2xl px-6 py-4 shadow-card">
            <Smartphone className="w-6 h-6 text-primary shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-sm">{t('landing.installTitle')}</p>
              <p className="text-xs text-muted-foreground">{t('landing.installSubtitle')}</p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/install">{t('landing.install')}</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Resources */}
      <section id="resources" aria-labelledby="resources-title" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 id="resources-title" className="text-3xl font-display font-bold mb-4">{t('landing.resourcesTitle')}</h2>
              <p className="text-muted-foreground">{t('landing.resourcesSubtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="https://formation-civique.interieur.gouv.fr/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold flex items-center gap-1 text-base m-0">{t('landing.officialPrep')}<ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" /></h3>
                  <p className="text-sm text-muted-foreground">{t('landing.officialPrepDesc')}</p>
                </div>
              </a>
              <a href="https://www.lefrancaisdesaffaires.fr/candidat/examen-civique/presentation/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold flex items-center gap-1 text-base m-0">{t('landing.examRegistration')}<ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" /></h3>
                  <p className="text-sm text-muted-foreground">{t('landing.examRegistrationDesc')}</p>
                </div>
              </a>
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={generateQuestionsPDF} className="gap-2">
                <Download className="w-4 h-4" />
                {t('landing.downloadPDF')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 id="faq-title" className="text-3xl font-display font-bold mb-8 text-center">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">
                  <h3 className="text-base font-medium m-0">{f.q}</h3>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" aria-labelledby="cta-title" className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-title" className="text-3xl font-display font-bold text-white mb-4">{t('landing.ctaTitle')}</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">{t('landing.ctaSubtitle')}</p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <Link to={user ? '/dashboard' : '/register'}>
              {user ? t('landing.ctaDashboard') : t('landing.ctaRegister')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
      </article>
    </Layout>
  );
}
