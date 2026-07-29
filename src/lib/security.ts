// Small server-side security helpers shared by the API routes.
// Keep this dependency-free so it stays cheap to import in serverless funcs.
import type { NextApiRequest } from 'next';

/** HTML-escape untrusted text before interpolating it into email HTML. */
export function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Coerce, trim and length-cap a free-text field. */
export function field(input: unknown, maxLen: number): string {
  return String(input ?? '').trim().slice(0, maxLen);
}

/**
 * Sanitize a value used in an email "from" display name: strip CR/LF and
 * angle brackets so it can't inject headers or break the address, and cap it.
 */
export function sanitizeDisplayName(input: unknown): string {
  return String(input ?? '').replace(/[\r\n<>"]/g, ' ').trim().slice(0, 100) || 'Portfolio';
}

/**
 * Coerce, trim and length-cap a value destined for an email header (Subject,
 * etc.): strips CR/LF so a submitted value can't inject extra headers
 * (e.g. a fake Bcc line) into the outgoing message.
 */
export function headerField(input: unknown, maxLen: number): string {
  return String(input ?? '').replace(/[\r\n]/g, ' ').trim().slice(0, maxLen);
}

/**
 * True unless the request's Origin (or, failing that, Referer) header names
 * a different host than this request was sent to. There's no session cookie
 * anywhere in this app for a forged cross-site POST to ride on, so this isn't
 * classic CSRF protection — it's here to stop other sites from embedding a
 * hidden form/fetch that fires POSTs to these endpoints from visitors'
 * browsers (e.g. to flood the contact inbox or the /decode feed). A request
 * with neither header (curl, direct API use) is allowed through — that's not
 * the browser-driven threat this guards against, and rate limiting + BotID
 * already cover direct abuse.
 */
export function isSameOrigin(req: NextApiRequest): boolean {
  const host = req.headers.host;
  if (!host) return false;

  const origin = req.headers.origin;
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = req.headers.referer;
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return true;
}

/** Return the IP only if it is a plausible IPv4/IPv6 address, else null. */
export function safeIp(raw: string): string | null {
  const ip = raw.trim();
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4.test(ip)) return ip;
  if (ip.includes(':') && /^[0-9a-fA-F:]+$/.test(ip)) return ip; // IPv6
  return null;
}

/**
 * Best-effort in-memory rate limiter. NOTE: on serverless this is per warm
 * instance, not global — it blunts casual spam but is not a hard guarantee.
 * For strict limits use a shared store (e.g. Upstash Redis) or the Vercel WAF.
 */
const hits = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (rec.count >= limit) return false;
  rec.count++;
  return true;
}
