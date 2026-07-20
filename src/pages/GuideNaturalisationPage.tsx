import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableOfContents } from '@/components/seo/TableOfContents';
import { ArrowRight, FileCheck, ScrollText, Clock, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function GuideNaturalisationPage() {
  const toc = [
    { id: 'conditions', label: "Conditions d'éligibilité" },
    { id: 'dossier', label: 'Le dossier à constituer' },
    { id: 'procedure', label: 'Étapes de la procédure' },
    { id: 'examen-civique', label: "L'examen civique et le niveau B2" },
    { id: 'delais', label: 'Délais et décision' },
    { id: 'faq', label: 'Questions fréquentes' },
  ];

  return (
    <Layout>
      <SEOHead
        title="Demande de nationalité française : guide complet 2026"
        description="Guide complet de la demande de nationalité française : conditions, dossier, étapes, examen civique et niveau B2. Toutes les infos pour réussir votre naturalisation en 2026."
      />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <ScrollText className="w-4 h-4" />
            Guide officiel · Mis à jour 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Demande de nationalité française : le guide complet
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Naturalisation par décret, conditions, dossier, examen civique et niveau
            B2 : tout ce qu'il faut savoir pour préparer votre demande de nationalité
            française en 2026.
          </p>
        </header>

        <TableOfContents items={toc} />

        <section id="conditions" aria-labelledby="conditions-title" className="mt-12 space-y-4">
          <h2 id="conditions-title" className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-primary" /> Conditions d'éligibilité
          </h2>
          <p>
            Pour déposer une <strong>demande de naturalisation française</strong> par
            décret, vous devez remplir plusieurs conditions cumulatives :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Résidence</strong> : vivre en France depuis au moins 5 ans (2 ans si diplôme français bac+2 minimum, dispense possible pour réfugiés).</li>
            <li><strong>Titre de séjour</strong> régulier au moment du dépôt et de la décision.</li>
            <li><strong>Stabilité financière</strong> : ressources suffisantes et régulières.</li>
            <li><strong>Assimilation à la communauté française</strong> : adhésion aux valeurs et principes de la République.</li>
            <li><strong>Niveau de français B2</strong> à l'oral et à l'écrit depuis le 1er janvier 2026 (auparavant B1).</li>
            <li><strong>Casier judiciaire</strong> vierge de condamnations graves.</li>
          </ul>
        </section>

        <section id="dossier" aria-labelledby="dossier-title" className="mt-12 space-y-4">
          <h2 id="dossier-title" className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <FileCheck className="w-7 h-7 text-primary" /> Le dossier à constituer
          </h2>
          <p>
            La demande se fait en ligne via la plateforme{' '}
            <a href="https://administration-etrangers-en-france.interieur.gouv.fr" className="text-primary underline" target="_blank" rel="noopener noreferrer">
              ANEF (Administration Numérique des Étrangers en France)
            </a>. Préparez :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Formulaire Cerfa n°12753 rempli et signé</li>
            <li>Copie intégrale d'acte de naissance traduit et légalisé</li>
            <li>Titre de séjour et passeport en cours de validité</li>
            <li>Justificatifs de résidence en France (5 dernières années)</li>
            <li>Avis d'imposition et bulletins de salaire (3 dernières années)</li>
            <li>Diplôme attestant du niveau B2 en français (DELF, TCF, DCL...)</li>
            <li>Extrait de casier judiciaire du pays d'origine</li>
            <li>Timbre fiscal de 55 € pour les frais de dossier</li>
          </ul>
        </section>

        <section id="procedure" aria-labelledby="procedure-title" className="mt-12 space-y-4">
          <h2 id="procedure-title" className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <ScrollText className="w-7 h-7 text-primary" /> Étapes de la procédure
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Dépôt en ligne</strong> du dossier sur l'ANEF.</li>
            <li><strong>Vérification de recevabilité</strong> par la plateforme de naturalisation (2 à 6 mois).</li>
            <li><strong>Entretien individuel d'assimilation</strong> en préfecture : vérification du niveau de langue, connaissances civiques et adhésion aux valeurs républicaines.</li>
            <li><strong>Passage de l'examen civique</strong> (40 questions, 32/40 requis).</li>
            <li><strong>Enquête administrative</strong> (moralité, situation fiscale).</li>
            <li><strong>Décision ministérielle</strong> : décret publié au Journal officiel en cas d'accord.</li>
            <li><strong>Cérémonie d'accueil</strong> dans la citoyenneté française.</li>
          </ol>
        </section>

        <section id="examen-civique" aria-labelledby="examen-title" className="mt-12 space-y-4">
          <h2 id="examen-title" className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-primary" /> L'examen civique et le niveau B2
          </h2>
          <p>
            Depuis le 1er janvier 2026, l'<strong>examen civique</strong> est
            obligatoire pour toute demande de naturalisation. Il comprend :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>40 questions à choix multiples</strong> en 45 minutes, sur ordinateur.</li>
            <li><strong>28 questions de connaissances</strong> (histoire, géographie, institutions, valeurs).</li>
            <li><strong>12 questions de mise en situation</strong> évaluant le raisonnement pratique.</li>
            <li>Score requis : <strong>32/40 (80 %)</strong> pour valider l'épreuve.</li>
          </ul>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <p className="font-semibold mb-2">Préparez gratuitement votre examen</p>
            <p className="text-sm text-muted-foreground mb-4">
              Le Test Civique propose plus de 300 questions officielles, des examens
              blancs chronométrés et un suivi de progression pour maximiser vos
              chances de réussir dès le premier essai.
            </p>
            <Button asChild>
              <Link to="/register">
                Commencer l'entraînement gratuit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>
          <p>
            Consultez aussi notre{' '}
            <Link to="/themes-guide" className="text-primary underline">
              guide des 5 thèmes officiels
            </Link>{' '}
            et notre{' '}
            <Link to="/blog/mise-en-situation-examen-civique-2026" className="text-primary underline">
              article sur les questions de mise en situation 2026
            </Link>.
          </p>
        </section>

        <section id="delais" aria-labelledby="delais-title" className="mt-12 space-y-4">
          <h2 id="delais-title" className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <Clock className="w-7 h-7 text-primary" /> Délais et décision
          </h2>
          <p>
            L'instruction d'une <strong>demande de nationalité française</strong> dure
            en moyenne <strong>18 à 24 mois</strong>, avec une durée maximale légale
            de 18 mois à compter du dépôt d'un dossier complet (prolongeable une fois
            de 3 mois). En cas d'accord, votre nom paraît au{' '}
            <em>Journal officiel</em> et vous êtes convoqué à la cérémonie d'accueil
            dans la citoyenneté française où vous recevez votre décret de
            naturalisation.
          </p>
        </section>

        <section id="faq" aria-labelledby="faq-title" className="mt-12 space-y-6">
          <h2 id="faq-title" className="text-2xl md:text-3xl font-display font-bold">
            Questions fréquentes
          </h2>
          <div>
            <h3 className="font-semibold text-lg">Combien coûte une demande de naturalisation française ?</h3>
            <p className="text-muted-foreground">Les frais de dossier s'élèvent à 55 € (timbre fiscal). Prévoir également le coût du test de langue B2 (environ 100 à 150 €) et les traductions assermentées.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Puis-je conserver ma nationalité d'origine ?</h3>
            <p className="text-muted-foreground">La France autorise la double nationalité. Vérifiez toutefois auprès de votre pays d'origine, certains États ne l'admettent pas.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Que faire en cas de refus ?</h3>
            <p className="text-muted-foreground">Vous pouvez déposer un recours administratif dans les 2 mois, puis un recours contentieux devant le tribunal administratif de Nantes.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Quelle est la différence entre naturalisation et déclaration ?</h3>
            <p className="text-muted-foreground">La naturalisation par décret est discrétionnaire. La déclaration (mariage, ascendant français) est un droit sous conditions.</p>
          </div>
        </section>

        <section className="mt-16 text-center bg-muted/50 rounded-2xl p-8">
          <h2 className="text-2xl font-display font-bold mb-3">Prêt pour votre examen civique ?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Ne laissez pas l'examen retarder votre naturalisation. Entraînez-vous dès
            maintenant avec des questions officielles et des mises en situation
            conformes au format 2026.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </section>
      </article>
    </Layout>
  );
}
