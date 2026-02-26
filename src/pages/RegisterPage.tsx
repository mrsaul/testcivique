import { Layout } from '@/components/layout/Layout';
import { AuthForm } from '@/components/auth/AuthForm';
import { SEOHead } from '@/components/seo/SEOHead';

export default function RegisterPage() {
  return (
    <Layout>
      <SEOHead title="Créer un compte" description="Créez votre compte gratuit Test Civique et commencez à préparer votre examen civique français avec des quiz interactifs." />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <AuthForm mode="register" />
      </div>
    </Layout>
  );
}
