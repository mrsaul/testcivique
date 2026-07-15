import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Status = 'loading' | 'valid' | 'invalid' | 'already' | 'success' | 'error';

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } },
        );
        const data = await res.json();
        if (data?.valid === true) setStatus('valid');
        else if (data?.reason === 'already_unsubscribed') setStatus('already');
        else setStatus('invalid');
      } catch {
        setStatus('error');
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
      body: { token },
    });
    setSubmitting(false);
    if (error) return setStatus('error');
    if (data?.success) setStatus('success');
    else if (data?.reason === 'already_unsubscribed') setStatus('already');
    else setStatus('error');
  };

  return (
    <Layout>
      <SEOHead title="Se désabonner" noIndex />
      <div className="container mx-auto px-4 py-16 max-w-md text-center space-y-6">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Vérification du lien…</p>
          </div>
        )}
        {status === 'valid' && (
          <>
            <h1 className="text-2xl font-display font-bold">Se désabonner ?</h1>
            <p className="text-muted-foreground">
              Vous ne recevrez plus d'emails de Le Test Civique.
            </p>
            <Button size="lg" onClick={confirm} disabled={submitting}>
              {submitting ? 'Traitement…' : 'Confirmer le désabonnement'}
            </Button>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h1 className="text-2xl font-display font-bold">Désabonnement confirmé</h1>
            <p className="text-muted-foreground">Vous ne recevrez plus d'emails de notre part.</p>
          </>
        )}
        {status === 'already' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h1 className="text-2xl font-display font-bold">Déjà désabonné(e)</h1>
            <p className="text-muted-foreground">Cette adresse ne reçoit déjà plus d'emails.</p>
          </>
        )}
        {(status === 'invalid' || status === 'error') && (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-display font-bold">Lien invalide</h1>
            <p className="text-muted-foreground">
              Ce lien de désabonnement n'est plus valide. Contactez-nous si besoin.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}
