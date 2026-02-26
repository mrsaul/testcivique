import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { useCreatePayment } from '@/hooks/usePremium';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment } = useCreatePayment();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId)
        .then((data) => {
          setVerified(data?.premium ?? false);
        })
        .catch(() => setVerified(false))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [searchParams, verifyPayment]);

  return (
    <Layout>
      <SEOHead title="Paiement confirmé" noIndex />
      <div className="container mx-auto px-4 py-16 max-w-md text-center space-y-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Vérification du paiement...</p>
          </div>
        ) : verified ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold">Paiement confirmé !</h1>
            <p className="text-muted-foreground">
              Votre accès illimité est maintenant activé. Bonne préparation !
            </p>
            <Button onClick={() => navigate('/dashboard')} size="lg">
              Continuer ma préparation
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-display font-bold">Merci !</h1>
            <p className="text-muted-foreground">
              Votre paiement est en cours de traitement. Veuillez rafraîchir la page dans quelques instants.
            </p>
            <Button onClick={() => navigate('/dashboard')} size="lg">
              Retour au tableau de bord
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}
