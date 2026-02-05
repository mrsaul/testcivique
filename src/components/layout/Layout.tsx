import { Navbar } from './Navbar';

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
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>
            Préparation à l'Examen Civique français • Basé sur le contenu officiel de{' '}
            <a 
              href="https://formation-civique.interieur.gouv.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              formation-civique.interieur.gouv.fr
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
