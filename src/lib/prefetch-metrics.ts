/**
 * Prefetch effectiveness tracking.
 *
 * Measures:
 *  - How many prefetches were issued (by trigger: idle vs intent)
 *  - How many were "hits" (the user actually navigated to a prefetched route)
 *  - The estimated time saved per hit (= measured chunk load duration during
 *    prefetch, which the user would otherwise have paid at navigation time)
 *  - Aggregate totals exposed on `window.__prefetchMetrics` and optionally
 *    forwarded to Google Analytics (gtag) when present.
 */

export type PrefetchTrigger = 'idle' | 'intent';

interface PrefetchRecord {
  key: string;
  trigger: PrefetchTrigger;
  startedAt: number;
  durationMs?: number; // chunk load time (= time saved if hit)
  resolved: boolean;
  consumed: boolean; // navigated to before another prefetch overwrote it
}

interface MetricsSummary {
  prefetches: number;
  byTrigger: Record<PrefetchTrigger, number>;
  hits: number;
  misses: number; // resolved prefetches the user never visited
  hitRate: number;
  totalTimeSavedMs: number;
  avgTimeSavedMs: number;
  records: PrefetchRecord[];
}

import { enqueuePrefetchEvent } from './prefetch-sink';

const records = new Map<string, PrefetchRecord>();
let hits = 0;
let totalSavedMs = 0;
const triggerCounts: Record<PrefetchTrigger, number> = { idle: 0, intent: 0 };

function gtag(...args: unknown[]) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === 'function') w.gtag(...args);
}

export function recordPrefetchStart(key: string, trigger: PrefetchTrigger) {
  triggerCounts[trigger]++;
  records.set(key, {
    key,
    trigger,
    startedAt: performance.now(),
    resolved: false,
    consumed: false,
  });
  enqueuePrefetchEvent({ event_type: 'issued', route_key: key, trigger });
}

export function recordPrefetchEnd(key: string, success: boolean) {
  const rec = records.get(key);
  if (!rec) return;
  rec.durationMs = performance.now() - rec.startedAt;
  rec.resolved = success;
  if (!success) records.delete(key);
}

/**
 * Called on every route change. If the destination was prefetched, count a
 * hit and add the estimated time saved (the chunk-load duration the user
 * skipped). Returns the saved milliseconds (0 if miss).
 */
export function recordNavigation(key: string | null): number {
  if (!key) return 0;
  const rec = records.get(key);
  if (!rec || rec.consumed) return 0;
  rec.consumed = true;
  if (!rec.resolved || rec.durationMs == null) return 0;
  hits++;
  totalSavedMs += rec.durationMs;
  gtag('event', 'prefetch_hit', {
    route_key: key,
    trigger: rec.trigger,
    saved_ms: Math.round(rec.durationMs),
  });
  if (import.meta.env.DEV) {
    console.info(
      `[prefetch] HIT ${key} via ${rec.trigger} — saved ~${Math.round(rec.durationMs)}ms`,
    );
  }
  return rec.durationMs;
}

export function getMetrics(): MetricsSummary {
  const all = Array.from(records.values());
  const resolved = all.filter((r) => r.resolved);
  const misses = resolved.filter((r) => !r.consumed).length;
  const total = triggerCounts.idle + triggerCounts.intent;
  return {
    prefetches: total,
    byTrigger: { ...triggerCounts },
    hits,
    misses,
    hitRate: total ? hits / total : 0,
    totalTimeSavedMs: Math.round(totalSavedMs),
    avgTimeSavedMs: hits ? Math.round(totalSavedMs / hits) : 0,
    records: all,
  };
}

// Expose for manual inspection in DevTools console.
if (typeof window !== 'undefined') {
  (window as unknown as { __prefetchMetrics: () => MetricsSummary }).__prefetchMetrics =
    getMetrics;
}
