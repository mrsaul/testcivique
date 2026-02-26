import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';

export default function PolitiqueConfidentialitePage() {
  return (
    <Layout>
      <SEOHead title="Politique de confidentialité" description="Politique de confidentialité et gestion des données personnelles conforme au RGPD pour Le Test Civique." />
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-sm dark:prose-invert">
        <h1>Politique de Confidentialité</h1>
        <p className="lead">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données collectées sur <strong>letestcivique.org</strong> est
          joignable à l'adresse : <a href="mailto:contact@letestcivique.org">contact@letestcivique.org</a>.
        </p>

        <h2>2. Données collectées</h2>
        <p>Nous collectons les données suivantes dans le cadre du fonctionnement du service :</p>
        <ul>
          <li><strong>Données d'inscription :</strong> adresse e-mail, nom d'affichage (facultatif).</li>
          <li><strong>Données de progression :</strong> réponses aux quiz, scores, séries de jours consécutifs, badges obtenus.</li>
          <li><strong>Données techniques :</strong> données de session nécessaires à l'authentification (jetons de session).</li>
        </ul>

        <h2>3. Finalités du traitement</h2>
        <p>Vos données sont traitées pour les finalités suivantes :</p>
        <ul>
          <li>Création et gestion de votre compte utilisateur.</li>
          <li>Suivi de votre progression et de vos statistiques d'apprentissage.</li>
          <li>Attribution de badges et récompenses liés à votre activité.</li>
          <li>Amélioration du service et de l'expérience utilisateur.</li>
        </ul>

        <h2>4. Base juridique du traitement</h2>
        <p>
          Le traitement de vos données repose sur votre <strong>consentement</strong> (article 6.1.a du RGPD),
          donné lors de la création de votre compte, ainsi que sur l'<strong>exécution du contrat</strong> de
          service (article 6.1.b du RGPD) pour le fonctionnement de la plateforme.
        </p>

        <h2>5. Durée de conservation</h2>
        <ul>
          <li><strong>Données de compte :</strong> conservées tant que votre compte est actif. En cas de suppression de compte, les données sont effacées sous 30 jours.</li>
          <li><strong>Données de progression :</strong> conservées pendant la durée de vie du compte.</li>
          <li><strong>Données techniques :</strong> les jetons de session expirent automatiquement selon les paramètres de sécurité.</li>
        </ul>

        <h2>6. Partage des données</h2>
        <p>
          Vos données personnelles <strong>ne sont ni vendues, ni louées, ni partagées</strong> avec des
          tiers à des fins commerciales. Elles peuvent être traitées par nos sous-traitants techniques
          (hébergement, base de données) dans le strict cadre du fonctionnement du service.
        </p>

        <h2>7. Transfert de données hors UE</h2>
        <p>
          Nos services d'hébergement peuvent impliquer un transfert de données en dehors de l'Union
          européenne. Dans ce cas, des garanties appropriées sont mises en place conformément au RGPD
          (clauses contractuelles types ou décision d'adéquation de la Commission européenne).
        </p>

        <h2>8. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos
          données, notamment :
        </p>
        <ul>
          <li>Chiffrement des communications (HTTPS/TLS).</li>
          <li>Hachage des mots de passe.</li>
          <li>Contrôle d'accès strict aux données (Row Level Security).</li>
          <li>Validation côté serveur des réponses aux quiz.</li>
        </ul>

        <h2>9. Cookies</h2>
        <p>
          Ce site utilise uniquement des <strong>cookies techniques essentiels</strong> au fonctionnement
          du service (authentification, préférences de session). Aucun cookie publicitaire, analytique
          ou de traçage tiers n'est utilisé. Par conséquent, aucun bandeau de consentement aux cookies
          n'est requis.
        </p>

        <h2>10. Vos droits</h2>
        <p>
          Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants :
        </p>
        <ul>
          <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles.</li>
          <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes.</li>
          <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données.</li>
          <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données.</li>
          <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible.</li>
          <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données.</li>
          <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment.</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à{' '}
          <a href="mailto:contact@letestcivique.org">contact@letestcivique.org</a>.
          Nous répondrons dans un délai de 30 jours.
        </p>

        <h2>11. Réclamation</h2>
        <p>
          Si vous estimez que le traitement de vos données ne respecte pas la réglementation,
          vous pouvez introduire une réclamation auprès de la{' '}
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
            Commission Nationale de l'Informatique et des Libertés (CNIL)
          </a>.
        </p>

        <h2>12. Modification de cette politique</h2>
        <p>
          Nous nous réservons le droit de modifier cette politique de confidentialité. En cas de
          modification substantielle, nous vous en informerons par e-mail ou par notification
          sur le site. La date de dernière mise à jour est indiquée en haut de cette page.
        </p>
      </div>
    </Layout>
  );
}
