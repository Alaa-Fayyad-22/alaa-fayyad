/* eslint-disable @typescript-eslint/no-require-imports -- next.config.js is CommonJS */
/** @type {import('next').NextConfig} */
const { withBotId } = require('botid/next/config');

// BotID serves its challenge script and proxies its verification traffic from
// this fixed path prefix (see botid/next/config). withBotId installs its own
// headers there — our site-wide CSP must not also land on it, or the challenge
// can't run and bot protection silently degrades. Every other path gets the
// full header set below.
const BOTID_PATH_PREFIX = '149e9513-01fa-4fb0-aad4-566afd725d1b';

// Content-Security-Policy. 'unsafe-inline' is required for scripts (the theme
// no-flash script + Next's inline bootstrap) and styles (styled-jsx, inline
// style attributes). Fonts are self-hosted via next/font, so no Google origins
// appear here any more. Vercel Analytics' script and beacon origins are allowed
// explicitly so analytics keeps working under the policy.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Everything except BotID's challenge/proxy prefix.
        source: `/((?!${BOTID_PATH_PREFIX}/).*)`,
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withBotId(nextConfig);
