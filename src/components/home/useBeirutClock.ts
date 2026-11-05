import { useEffect, useState } from 'react';

const TZ = 'Asia/Beirut';
const TICK_MS = 15_000;

export type BeirutClock = { time: string; date: string };

/**
 * Beirut wall-clock for the nav pill and footer status. The server (and the
 * first client render) always report "--:--" and an empty date, then the real
 * values are filled in after mount — formatting with the visitor's own clock
 * during render would mismatch the server HTML and break hydration.
 */
export function useBeirutClock(): BeirutClock {
  const [clock, setClock] = useState<BeirutClock>({ time: '--:--', date: '' });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock({
        time: now.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' }),
      });
    };
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return clock;
}
