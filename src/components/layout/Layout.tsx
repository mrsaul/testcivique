import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Mail, ExternalLink, BookOpen, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div className="space-y-3">
              <Link to="/" className="text-lg font-display font-bold">
                🇫🇷 Le Test Civique
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Préparation gratuite à l'examen civique français, basée sur le contenu officiel.
              </p>
            </div>

            {/* Ressources */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://formation-civique.interieur.gouv.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Préparation Officielle
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lefrancaisdesaffaires.fr/candidat/examen-civique/presentation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Inscription à l'examen
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Légal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Contact & Légal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:contact@letestcivique.org"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    contact@letestcivique.org
                  </a>
                </li>
                <li>
                  <Link
                    to="/mentions-legales"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Le Test Civique — Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
