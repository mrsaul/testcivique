import { Layout } from '@/components/layout/Layout';
import { AuthForm } from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <AuthForm mode="register" />
      </div>
    </Layout>
  );
}
