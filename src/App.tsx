import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SEOHead } from '@/components/seo/SEOHead';
import { PrefetchManager } from '@/components/PrefetchManager';
import { lazy, Suspense } from 'react';

// Code-split route bundles to improve initial load (Core Web Vitals: LCP/TBT)
const LanguageSelectPage = lazy(() => import('@/pages/LanguageSelectPage'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ThemesPage = lazy(() => import('@/pages/ThemesPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const InstallPage = lazy(() => import('@/pages/InstallPage'));
const MentionsLegalesPage = lazy(() => import('@/pages/MentionsLegalesPage'));
const PolitiqueConfidentialitePage = lazy(() => import('@/pages/PolitiqueConfidentialitePage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const AdminBlogPage = lazy(() => import('@/pages/AdminBlogPage'));
const AdminPartnerCodesPage = lazy(() => import('@/pages/AdminPartnerCodesPage'));
const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage'));
const AdminEmailsPage = lazy(() => import('@/pages/AdminEmailsPage'));
const AdminUsersPage = lazy(() => import('@/pages/AdminUsersPage'));
const ThemeLandingPage = lazy(() => import('@/pages/ThemeLandingPage'));
const ThemesIndexPage = lazy(() => import('@/pages/ThemesIndexPage'));
const UnsubscribePage = lazy(() => import('@/pages/UnsubscribePage'));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function LanguageGate({ children }: { children: React.ReactNode }) {
  const hasLang = localStorage.getItem('i18nextLng');
  if (!hasLang) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
    <SEOHead />
    <PrefetchManager />
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<LanguageSelectPage />} />
      <Route path="/home" element={<LanguageGate><LandingPage /></LanguageGate>} />
      <Route path="/install" element={<InstallPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/themes"
        element={
          <ProtectedRoute>
            <ThemesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:type"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/theme/:themeId"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route
        path="/admin/blog"
        element={
          <ProtectedRoute>
            <AdminBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/codes"
        element={
          <ProtectedRoute>
            <AdminPartnerCodesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/emails"
        element={
          <ProtectedRoute>
            <AdminEmailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route path="/themes-guide" element={<ThemesIndexPage />} />
      <Route path="/theme/:themeId" element={<ThemeLandingPage />} />
      <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
      <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
      <Route path="/unsubscribe" element={<UnsubscribePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
