// @vercel/analytics ships ESM only (dist/index.mjs), which Jest's CJS runtime
// can't require. Tests never assert on analytics, and lib/track.ts already
// treats every call as best-effort, so a no-op `track` is a faithful stub.
module.exports = { track: () => {} };
