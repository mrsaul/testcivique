import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, X, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function PricingSection() {
  const { user } = useAuth();

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Commencez gratuitement, puis débloquez l'accès complet avec un paiement unique. Pas d'abonnement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Tier */}
          <Card className="border bg-card">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gratuit</h3>
                  <p className="text-sm text-muted-foreground">Découvrir la plateforme</p>
                </div>
              </div>

              <div>
                <span className="text-3xl font-bold">0€</span>
              </div>

              <ul className="space-y-2.5 text-sm">
                <PricingFeature included>5 questions d'essai</PricingFeature>
                <PricingFeature included>Tous les thèmes accessibles</PricingFeature>
                <PricingFeature included>Correction détaillée</PricingFeature>
                <PricingFeature>Entraînement illimité</PricingFeature>
                <PricingFeature>Examens blancs</PricingFeature>
                <PricingFeature>Suivi de progression</PricingFeature>
                <PricingFeature>Badges et séries</PricingFeature>
              </ul>

              <Button variant="outline" asChild className="w-full">
                <Link to={user ? '/dashboard' : '/register'}>
                  {user ? 'Aller au tableau de bord' : 'Essayer gratuitement'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-primary shadow-lg relative bg-card">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Recommandé
              </span>
            </div>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Premium</h3>
                  <p className="text-sm text-muted-foreground">Accès complet à vie</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">5€</span>
                <span className="text-sm text-muted-foreground">paiement unique</span>
              </div>

              <ul className="space-y-2.5 text-sm">
                <PricingFeature included>Questions illimitées</PricingFeature>
                <PricingFeature included>Tous les thèmes débloqués</PricingFeature>
                <PricingFeature included>Correction détaillée</PricingFeature>
                <PricingFeature included>Entraînement illimité</PricingFeature>
                <PricingFeature included>Examens blancs</PricingFeature>
                <PricingFeature included>Suivi de progression complet</PricingFeature>
                <PricingFeature included>Badges et séries</PricingFeature>
              </ul>

              <Button asChild className="w-full">
                <Link to={user ? '/dashboard' : '/register'}>
                  {user ? 'Aller au tableau de bord' : 'Commencer maintenant'}
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé par Stripe. Pas d'abonnement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function PricingFeature({ children, included }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {included ? (
        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
      )}
      <span className={included ? '' : 'text-muted-foreground/60'}>{children}</span>
    </li>
  );
}
