import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Détecter iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Installer Logistica</CardTitle>
          <CardDescription>
            Installez l'application sur votre téléphone pour un accès rapide
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Application installée !</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous pouvez maintenant utiliser Logistica depuis votre écran d'accueil
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Android/Chrome */}
              {deferredPrompt && !isIOS && (
                <Button
                  onClick={handleInstall}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Installer l'application
                </Button>
              )}

              {/* iOS Instructions */}
              {isIOS && (
                <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold">Installation sur iOS :</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">1.</span>
                      Appuyez sur le bouton de partage 
                      <span className="mx-1">⎋</span>
                      en bas de Safari
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">2.</span>
                      Sélectionnez "Sur l'écran d'accueil"
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">3.</span>
                      Appuyez sur "Ajouter"
                    </li>
                  </ol>
                </div>
              )}

              {/* Android Instructions (fallback) */}
              {!deferredPrompt && !isIOS && (
                <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold">Installation sur Android :</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">1.</span>
                      Ouvrez le menu du navigateur (⋮)
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">2.</span>
                      Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">3.</span>
                      Confirmez l'installation
                    </li>
                  </ol>
                </div>
              )}
            </>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-sm mb-3">Avantages :</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                Accès rapide depuis l'écran d'accueil
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                Fonctionne hors ligne
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                Notifications en temps réel
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                Expérience comme une application native
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
