import { Layout } from '@/components/layout/Layout';

export default function MentionsLegalesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-sm dark:prose-invert">
        <h1>Mentions Légales</h1>

        <h2>Éditeur du site</h2>
        <p>
          Le site <strong>letestcivique.org</strong> est un projet éducatif à but non lucratif
          destiné à aider les candidats à préparer l'examen civique français.
        </p>
        <p>
          Contact : <a href="mailto:contact@letestcivique.org">contact@letestcivique.org</a>
        </p>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par Lovable (lovable.dev).
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          Le contenu des questions est basé sur les informations officielles publiques du
          programme de formation civique. Les textes, mises en page et fonctionnalités du
          site sont protégés par le droit d'auteur.
        </p>

        <h2>Protection des données personnelles</h2>
        <p>
          Les données collectées (adresse e-mail, statistiques de progression) sont utilisées
          uniquement dans le cadre du fonctionnement du service. Elles ne sont ni vendues ni
          partagées avec des tiers.
        </p>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
          suppression de vos données. Pour exercer ces droits, contactez-nous à{' '}
          <a href="mailto:contact@letestcivique.org">contact@letestcivique.org</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement
          du service (authentification, préférences). Aucun cookie publicitaire ou de
          traçage n'est utilisé.
        </p>

        <h2>Limitation de responsabilité</h2>
        <p>
          Le contenu de ce site est fourni à titre informatif et pédagogique. Bien que nous
          nous efforcions de maintenir des informations exactes et à jour, nous ne garantissons
          pas l'exactitude complète du contenu. Ce site n'est pas affilié au gouvernement français.
        </p>
      </div>
    </Layout>
  );
}
