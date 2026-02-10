import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Smartphone, Share, PlusSquare, MoreVertical, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Installer Test Civique
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Ajoutez l'application à votre écran d'accueil pour un accès rapide, même hors-ligne.
          </p>
        </div>

        {isInstalled ? (
          <Card className="border-2 border-success/30 bg-success/5">
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <h2 className="text-xl font-semibold">Application installée !</h2>
              <p className="text-muted-foreground">
                Test Civique est déjà installé sur votre appareil. Retrouvez-le sur votre écran d'accueil.
              </p>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Card className="shadow-card">
            <CardContent className="pt-6 text-center space-y-6">
              <Download className="w-16 h-16 text-primary mx-auto" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Installation rapide</h2>
                <p className="text-muted-foreground">
                  Cliquez sur le bouton ci-dessous pour installer l'application.
                </p>
              </div>
              <Button size="lg" onClick={handleInstall} className="w-full text-lg">
                <Download className="w-5 h-5 mr-2" />
                Installer l'application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {isIOS ? (
              <Card className="shadow-card">
                <CardContent className="pt-6 space-y-6">
                  <h2 className="text-xl font-semibold text-center">
                    📱 Installation sur iPhone / iPad
                  </h2>
                  <div className="space-y-4">
                    <Step
                      number={1}
                      icon={<Share className="w-5 h-5" />}
                      title="Appuyez sur le bouton Partager"
                      description="En bas de l'écran dans Safari (icône carré avec flèche vers le haut)"
                    />
                    <Step
                      number={2}
                      icon={<PlusSquare className="w-5 h-5" />}
                      title={"Sélectionnez \"Sur l'écran d'accueil\""}
                      description="Faites défiler les options et appuyez dessus"
                    />
                    <Step
                      number={3}
                      icon={<CheckCircle className="w-5 h-5" />}
                      title='Confirmez en appuyant sur "Ajouter"'
                      description="L'icône Test Civique apparaîtra sur votre écran d'accueil"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card">
                <CardContent className="pt-6 space-y-6">
                  <h2 className="text-xl font-semibold text-center">
                    📱 Installation sur Android
                  </h2>
                  <div className="space-y-4">
                    <Step
                      number={1}
                      icon={<MoreVertical className="w-5 h-5" />}
                      title="Ouvrez le menu du navigateur"
                      description="Appuyez sur les 3 points en haut à droite dans Chrome"
                    />
                    <Step
                      number={2}
                      icon={<PlusSquare className="w-5 h-5" />}
                      title={"Sélectionnez \"Ajouter à l'écran d'accueil\""}
                      description={"Ou \"Installer l'application\" si disponible"}
                    />
                    <Step
                      number={3}
                      icon={<CheckCircle className="w-5 h-5" />}
                      title="Confirmez l'installation"
                      description="L'application sera ajoutée à votre écran d'accueil"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Advantages */}
            <Card className="shadow-card bg-muted/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-center">Pourquoi installer l'app ?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Advantage emoji="⚡" title="Accès rapide" desc="Lancez d'un simple tap" />
                  <Advantage emoji="📶" title="Mode hors-ligne" desc="Révisez sans connexion" />
                  <Advantage emoji="🔔" title="Plein écran" desc="Comme une vraie app" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

function Step({ number, icon, title, description }: { number: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary">{icon}</span>
          <span className="font-medium text-sm">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Advantage({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="text-center p-3 rounded-lg">
      <div className="text-2xl mb-2">{emoji}</div>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
