import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Mail, ExternalLink, BookOpen, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

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
              <Link to="/home" className="text-lg font-display font-bold">
                🇫🇷 Le Test Civique
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('footer.description')}
              </p>
            </div>

            {/* Ressources */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/blog"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {t('nav.blog')}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://formation-civique.interieur.gouv.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {t('footer.officialPrep')}
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
                    {t('footer.examRegistration')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Légal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">{t('footer.contactLegal')}</h4>
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
                    {t('footer.legalNotice')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/politique-confidentialite"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('footer.privacyPolicy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
}
