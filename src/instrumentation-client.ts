import { initBotId } from 'botid/client/core';

// Registers the endpoints that BotID should collect a proof-of-human signal for.
// Only the two form POSTs are protected — everything else on the site is public
// and stays uninstrumented.
initBotId({
  protect: [
    { path: '/api/contact', method: 'POST' },
    { path: '/api/quote', method: 'POST' },
  ],
});
