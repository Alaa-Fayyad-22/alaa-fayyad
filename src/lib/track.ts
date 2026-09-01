/**
 * Anonymous, per-visit interaction tracking on top of the already-mounted
 * <Analytics /> from @vercel/analytics (no new dependency, no database).
 *
 * - A random session id is generated once per browser tab and kept in
 *   sessionStorage, so it resets on a new tab / new visit and never persists
 *   across return visits. It has no connection to identity.
 * - Every event in the app goes through logEvent() / logEventOnce() so the
 *   shape stays consistent: { sessionId, ...props }.
 * - Never pass names, emails, message bodies, or anything else identifying.
 * - navigator.doNotTrack is honoured — nothing is sent when it is set.
 *
 * Custom events surface under Vercel dashboard → Analytics → Events. In local
 * dev they only console.log; they need a deployed Vercel project (and, on some
 * plans, a plan that includes custom events) to actually arrive.
 */
import { track } from '@vercel/analytics';

const SESSION_KEY = 'sid';
const ONCE_KEY = 'sid:once';

/** Values Vercel Analytics accepts for a custom-event property. */
export type EventProps = Record<string, string | number | boolean>;

/** Random per-tab id. Reset when the tab closes; not tied to identity. */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage disabled — fall back to a volatile per-load id.
    return '';
  }
}

/** True when the visitor has asked not to be tracked. */
function doNotTrack(): boolean {
  if (typeof navigator === 'undefined') return false;
  const dnt =
    navigator.doNotTrack ??
    (typeof window !== 'undefined'
      ? (window as unknown as { doNotTrack?: string }).doNotTrack
      : undefined);
  return dnt === '1' || dnt === 'yes';
}

/**
 * Send one analytics event as { sessionId, ...props }. Safe to call anywhere;
 * no-ops on the server, when Do Not Track is set, or if analytics throws.
 */
export function logEvent(name: string, props: EventProps = {}): void {
  if (typeof window === 'undefined') return;
  if (doNotTrack()) return;
  try {
    track(name, { sessionId: getSessionId(), ...props });
  } catch {
    /* analytics must never break the UI */
  }
}

// Guards a "fire at most once per session" call even if sessionStorage throws.
const onceMemory = new Set<string>();

/**
 * Like logEvent, but fires at most once per `dedupeKey` per visit — for things
 * like a section scrolling into view, which must not re-fire on every tick.
 */
export function logEventOnce(dedupeKey: string, name: string, props: EventProps = {}): void {
  if (typeof window === 'undefined') return;
  if (onceMemory.has(dedupeKey)) return;
  onceMemory.add(dedupeKey);
  try {
    const raw = sessionStorage.getItem(ONCE_KEY);
    const seen: string[] = raw ? JSON.parse(raw) : [];
    if (seen.includes(dedupeKey)) return;
    seen.push(dedupeKey);
    sessionStorage.setItem(ONCE_KEY, JSON.stringify(seen));
  } catch {
    /* onceMemory already prevents same-load repeats */
  }
  logEvent(name, props);
}
