// Shared BotID configuration for the two form endpoints.
//
// In production `developmentOptions` is ignored entirely (BotID treats
// NODE_ENV === 'production' as non-development), so the bypass below can never
// weaken the real check — it exists purely so `npm run dev` can be driven
// through both outcomes instead of always classifying as HUMAN:
//
//   BOTID_DEV_BYPASS=HUMAN    npm run dev   # simulate a real visitor (default)
//   BOTID_DEV_BYPASS=BAD-BOT  npm run dev   # simulate a bot -> handlers 403
//   BOTID_DEV_BYPASS=GOOD-BOT npm run dev   # simulate a verified crawler
type Bypass = 'HUMAN' | 'BAD-BOT' | 'GOOD-BOT' | 'ALLOWED' | undefined;

export const botIdOptions = {
  developmentOptions: {
    bypass: (process.env.BOTID_DEV_BYPASS as Bypass) ?? 'HUMAN',
  },
};
