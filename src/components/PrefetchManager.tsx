import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { nextRoutesFor, prefetchRoutesIdle, prefetchRoute, keyForPath } from '@/lib/route-prefetch';
import { recordNavigation } from '@/lib/prefetch-metrics';
import { startPrefetchSink, setPrefetchUserId } from '@/lib/prefetch-sink';

/**
 * Mounted once at app root. On every route change, schedules an idle
 * prefetch of the most likely next route chunks. Also delegates pointer
 * events to prefetch the chunk for any internal <a href="..."> the user
 * is about to click (hover/focus/touchstart).
 */
export function PrefetchManager() {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();

  // On every route change, attribute hit/miss to any prior prefetch, then
  // schedule idle prefetches for the next likely destinations.
  useEffect(() => {
    if (loading) return;
    recordNavigation(keyForPath(pathname));
    const keys = nextRoutesFor(pathname, !!user);
    prefetchRoutesIdle(keys);
  }, [pathname, user, loading]);

  // Intent-based prefetch: warm the chunk as soon as the user signals intent.
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="/"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('//')) return;
      const key = keyForPath(href.split('?')[0].split('#')[0]);
      if (key) prefetchRoute(key);
    };
    const opts: AddEventListenerOptions = { capture: true, passive: true };
    document.addEventListener('mouseover', handler, opts);
    document.addEventListener('focusin', handler, opts);
    document.addEventListener('touchstart', handler, opts);
    return () => {
      document.removeEventListener('mouseover', handler, opts);
      document.removeEventListener('focusin', handler, opts);
      document.removeEventListener('touchstart', handler, opts);
    };
  }, []);

  return null;
}
