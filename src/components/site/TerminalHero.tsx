import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { smoothScrollTo } from '../../lib/scroll';
import { ArrowDown } from 'lucide-react';

type Line = { kind: 'cmd' | 'out'; text: string; cls?: string };

/**
 * Terminal-style hero. Types shell commands and "outputs" the real name / role
 * / status, then shows a scroll cue. Always-dark terminal window (reads right in
 * both themes). Typing starts once boot has cleared (`start`). The real name +
 * role are also in a visually-hidden block so screen readers never depend on
 * the animation. Timeout-based, fully cleaned up on unmount.
 */
export default function TerminalHero({ start }: { start: boolean }) {
  const { t, isRTL } = useTranslation();
  const [rendered, setRendered] = useState<Line[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const name = t.hero.name;
  const role = t.hero.role1;
  const status = t.hero.available;

  useEffect(() => {
    if (!start) return;

    const STEPS: Line[] = [
      { kind: 'cmd', text: 'whoami' },
      { kind: 'out', text: name, cls: 'name' },
      { kind: 'cmd', text: 'cat role.txt' },
      { kind: 'out', text: role, cls: 'role' },
      { kind: 'cmd', text: 'echo $STATUS' },
      { kind: 'out', text: status, cls: 'status' },
    ];

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const lines: Line[] = [];
    let si = 0;

    const schedule = (ms: number, fn: () => void) => {
      timers.push(setTimeout(() => { if (!cancelled) fn(); }, ms));
    };
    const commit = () => setRendered(lines.slice());

    const runStep = () => {
      if (si >= STEPS.length) { setTyping(null); setDone(true); return; }
      const s = STEPS[si];
      if (s.kind === 'cmd') {
        let ci = 0;
        const typeChar = () => {
          setTyping(s.text.slice(0, ci));
          if (ci >= s.text.length) {
            lines.push({ kind: 'cmd', text: s.text });
            commit();
            setTyping(null);
            si++;
            schedule(280, runStep);
            return;
          }
          ci++;
          schedule(34, typeChar);
        };
        typeChar();
      } else {
        lines.push(s);
        commit();
        si++;
        schedule(380, runStep);
      }
    };

    schedule(300, runStep);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [start, name, role, status]);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};

  return (
    <section id="overview" className="term-hero">
      {/* Real content for screen readers, independent of the animation */}
      <div className="hd-sr">
        <h1>{name}</h1>
        <p>{role}</p>
      </div>

      <div className="term-win" aria-hidden="true" dir="ltr">
        <div className="term-bar">
          <span className="term-dot" style={{ background: '#ff5f56' }} />
          <span className="term-dot" style={{ background: '#ffbd2e' }} />
          <span className="term-dot" style={{ background: '#27c93f' }} />
          <span className="term-title">alaa@portfolio: ~</span>
        </div>
        <div className="term-body">
          {rendered.map((l, i) => (
            l.kind === 'cmd' ? (
              <div key={i} className="term-line">
                <span className="term-prompt">$</span> <span className="term-cmd">{l.text}</span>
              </div>
            ) : (
              <div key={i} className={`term-line term-out ${l.cls === 'name' ? 'term-name' : l.cls === 'status' ? 'term-status' : ''}`}
                style={l.cls === 'role' ? ar : undefined}>
                {l.text}
              </div>
            )
          ))}
          {typing !== null && (
            <div className="term-line">
              <span className="term-prompt">$</span> <span className="term-cmd">{typing}</span><span className="term-caret" />
            </div>
          )}
          {done && (
            <div className="term-line"><span className="term-prompt">$</span> <span className="term-caret" /></div>
          )}
        </div>
      </div>

      <button className="term-cue" onClick={() => smoothScrollTo('about')} aria-label="Scroll to content">
        <ArrowDown size={20} className="animate-float" />
      </button>
    </section>
  );
}
