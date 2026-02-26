import { Layout } from '@/components/layout/Layout';
import { AuthForm } from '@/components/auth/AuthForm';
import { SEOHead } from '@/components/seo/SEOHead';

export default function LoginPage() {
  return (
    <Layout>
      <SEOHead title="Connexion" description="Connectez-vous à votre compte Test Civique pour reprendre votre préparation à l'examen civique français." />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <AuthForm mode="login" />
      </div>
    </Layout>
  );
}
