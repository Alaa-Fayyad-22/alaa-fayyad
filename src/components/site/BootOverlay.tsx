import { useEffect, useState } from 'react';

type BootLine = { p: string; t: string; ok?: boolean };

const LINES: BootLine[] = [
  { p: '$', t: 'initializing dev environment' },
  { p: '✓', t: 'node v22.0.0', ok: true },
  { p: '✓', t: 'loading modules', ok: true },
  { p: '✓', t: 'mounting /home/alaa/portfolio', ok: true },
  { p: '✓', t: 'compiling assets', ok: true },
  { p: '$', t: 'starting interactive shell …' },
];

/**
 * Non-skippable dev/shell-style loading screen. Theme-aware (uses the active
 * theme tokens, set pre-paint → no flash). Plays every visit on a guaranteed
 * timer (~2.1s), then auto-fades into the terminal hero — never stalls.
 * Decorative; real content lives in the DOM beneath for screen readers.
 */
export default function BootOverlay({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => timers.push(setTimeout(() => setVisible(i + 1), 130 * (i + 1))));
    timers.push(setTimeout(() => setClosing(true), 1700)); // begin fade
    timers.push(setTimeout(onDone, 2150));                 // guaranteed hand-off
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`boot2 ${closing ? 'boot2--out' : ''}`} aria-hidden="true">
      <div className="boot2__win">
        <pre className="boot2__log">
          {LINES.slice(0, visible).map((l, i) => (
            <div key={i} className="boot2__line">
              <span className={l.ok ? 'boot2__ok' : 'boot2__prompt'}>{l.p}</span> {l.t}
            </div>
          ))}
          <span className="hd-blink boot2__caret">█</span>
        </pre>
        <div className="boot2__barwrap"><div className="boot2__bar" /></div>
      </div>
    </div>
  );
}
