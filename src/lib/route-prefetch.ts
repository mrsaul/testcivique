/**
 * Smart route prefetching.
 *
 * Each entry maps a route key to a dynamic import that matches the lazy()
 * import in src/App.tsx. Webpack/Vite dedupes the chunk, so calling these
 * importers warms the module cache without re-downloading.
 */

type Importer = () => Promise<unknown>;

export const routeImporters: Record<string, Importer> = {
  language: () => import('@/pages/LanguageSelectPage'),
  landing: () => import('@/pages/LandingPage'),
  login: () => import('@/pages/LoginPage'),
  register: () => import('@/pages/RegisterPage'),
  forgot: () => import('@/pages/ForgotPasswordPage'),
  reset: () => import('@/pages/ResetPasswordPage'),
  dashboard: () => import('@/pages/DashboardPage'),
  themes: () => import('@/pages/ThemesPage'),
  quiz: () => import('@/pages/QuizPage'),
  install: () => import('@/pages/InstallPage'),
  legal: () => import('@/pages/MentionsLegalesPage'),
  privacy: () => import('@/pages/PolitiqueConfidentialitePage'),
  paymentSuccess: () => import('@/pages/PaymentSuccessPage'),
  blog: () => import('@/pages/BlogPage'),
  blogPost: () => import('@/pages/BlogPostPage'),
  adminBlog: () => import('@/pages/AdminBlogPage'),
};

// Heuristic next-step graph: which chunks the user is most likely to visit
// from a given pathname. Order = priority.
export function nextRoutesFor(pathname: string, isAuthed: boolean): string[] {
  if (pathname === '/') return ['landing', 'login'];
  if (pathname === '/home') {
    return isAuthed
      ? ['dashboard', 'themes', 'quiz']
      : ['register', 'login', 'blog'];
  }
  if (pathname === '/login') return ['dashboard', 'register', 'forgot'];
  if (pathname === '/register') return ['dashboard', 'login'];
  if (pathname === '/forgot-password') return ['reset', 'login'];
  if (pathname === '/dashboard') return ['themes', 'quiz', 'blog'];
  if (pathname === '/themes') return ['quiz', 'dashboard'];
  if (pathname.startsWith('/quiz')) return ['quiz', 'dashboard', 'themes'];
  if (pathname === '/blog') return ['blogPost', 'landing'];
  if (pathname.startsWith('/blog/')) return ['blog', 'landing'];
  if (pathname === '/install') return ['landing', 'dashboard'];
  return [];
}

const prefetched = new Set<string>();

function shouldSkip(): boolean {
  if (typeof navigator === 'undefined') return true;
  // Save-Data header / slow connection -> respect user preference
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return true;
  return false;
}

export function prefetchRoute(key: string) {
  if (prefetched.has(key)) return;
  const importer = routeImporters[key];
  if (!importer) return;
  prefetched.add(key);
  importer().catch(() => prefetched.delete(key));
}

export function prefetchRoutesIdle(keys: string[]) {
  if (shouldSkip() || !keys.length) return;
  const run = () => keys.forEach(prefetchRoute);
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(run, { timeout: 2000 });
  } else {
    setTimeout(run, 1500);
  }
}

/** Map a pathname to the route chunk key (for hover/touch prefetch on <Link>). */
export function keyForPath(pathname: string): string | null {
  if (pathname === '/') return 'language';
  if (pathname === '/home') return 'landing';
  if (pathname === '/login') return 'login';
  if (pathname === '/register') return 'register';
  if (pathname === '/forgot-password') return 'forgot';
  if (pathname === '/reset-password') return 'reset';
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/themes') return 'themes';
  if (pathname.startsWith('/quiz')) return 'quiz';
  if (pathname === '/install') return 'install';
  if (pathname === '/mentions-legales') return 'legal';
  if (pathname === '/politique-confidentialite') return 'privacy';
  if (pathname === '/payment-success') return 'paymentSuccess';
  if (pathname === '/blog') return 'blog';
  if (pathname.startsWith('/blog/')) return 'blogPost';
  if (pathname.startsWith('/admin/blog')) return 'adminBlog';
  return null;
}
