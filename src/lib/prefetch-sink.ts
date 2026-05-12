/**
 * Batches prefetch events and ships them to the `prefetch_events` table.
 *
 * Why a sink (not a direct insert per event):
 *  - Prefetch events fire frequently (every hover, every route change). Batching
 *    avoids spamming the network and the database.
 *  - We flush on `visibilitychange` / `pagehide` using `navigator.sendBeacon`
 *    so events survive the user closing the tab.
 *
 * Event types persisted:
 *  - 'issued': a prefetch was triggered (idle or intent)
 *  - 'hit'   : the user navigated to a previously prefetched route
 *  Misses can be derived in SQL: misses = issued - hit (per route_key / day).
 */

import { supabase } from '@/integrations/supabase/client';

export type PrefetchEventType = 'issued' | 'hit' | 'miss';

export interface PrefetchEventPayload {
  event_type: PrefetchEventType;
  route_key: string;
  trigger?: 'idle' | 'intent' | null;
  saved_ms?: number | null;
  duration_ms?: number | null;
  pathname?: string | null;
  effective_type?: string | null;
  save_data?: boolean | null;
  session_id?: string | null;
  user_id?: string | null;
}

const BATCH_SIZE = 20;
const FLUSH_INTERVAL_MS = 15_000;

let queue: PrefetchEventPayload[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let started = false;
let cachedUserId: string | null = null;

const sessionId =
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function getConnInfo() {
  if (typeof navigator === 'undefined') return { effective_type: null, save_data: null };
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  return {
    effective_type: conn?.effectiveType ?? null,
    save_data: conn?.saveData ?? null,
  };
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
}

async function flush() {
  if (!queue.length) return;
  const batch = queue;
  queue = [];
  try {
    const { error } = await supabase.from('prefetch_events').insert(batch);
    if (error && import.meta.env.DEV) {
      console.warn('[prefetch-sink] insert failed', error);
    }
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[prefetch-sink] flush error', e);
  }
}

function flushBeacon() {
  if (!queue.length) return;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/prefetch_events`;
  const body = JSON.stringify(queue);
  queue = [];
  try {
    const blob = new Blob([body], { type: 'application/json' });
    // sendBeacon doesn't allow custom headers; the REST endpoint requires
    // the apikey + auth headers, so beacon will likely fail. We still try
    // beacon first (fire-and-forget) but also keep a fetch fallback with
    // keepalive=true that DOES allow headers.
    const ok = navigator.sendBeacon?.(url, blob) ?? false;
    if (!ok) throw new Error('beacon-rejected');
  } catch {
    // Fallback: keepalive fetch with proper headers.
    fetch(url, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        Prefer: 'return=minimal',
      },
      body,
    }).catch(() => undefined);
  }
}

export function enqueuePrefetchEvent(
  e: Omit<PrefetchEventPayload, 'session_id' | 'user_id' | 'pathname' | 'effective_type' | 'save_data'>,
) {
  const conn = getConnInfo();
  queue.push({
    ...e,
    session_id: sessionId,
    user_id: cachedUserId,
    pathname: typeof location !== 'undefined' ? location.pathname : null,
    ...conn,
  });
  if (queue.length >= BATCH_SIZE) {
    void flush();
  } else {
    scheduleFlush();
  }
}

export function setPrefetchUserId(id: string | null) {
  cachedUserId = id;
}

export function startPrefetchSink() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const onHide = () => {
    if (document.visibilityState === 'hidden') flushBeacon();
  };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', flushBeacon);
}
