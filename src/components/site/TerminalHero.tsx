import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { smoothScrollTo } from '../../lib/scroll';
import { runCommand, type OutputLine, type TermContext } from '../../lib/terminal';
import { ArrowDown } from 'lucide-react';

type Line = { kind: 'cmd' | 'out'; text: string; cls?: string };
type LogItem = { kind: 'in'; text: string } | { kind: 'out'; line: OutputLine };

const toneClass: Record<NonNullable<OutputLine['tone']>, string> = {
  cmd: 'term-cmd', out: 'term-out', accent: 'term-acc', muted: 'term-muted',
  name: 'term-name', ok: 'term-status', err: 'term-err',
};

/**
 * Interactive terminal hero. On load it auto-types a short intro (whoami / role
 * / status) so the hero reads immediately — that part is decorative (the real
 * name/role also live in a visually-hidden block, and again as an aria-live log
 * for the interactive output). After the intro, a real focusable input lets
 * visitors run shell-style commands (help, about, skills, projects, …) handled
 * by the pure engine in lib/terminal. All timeouts are cleaned up on unmount.
 */
export default function TerminalHero({ start }: { start: boolean }) {
  const { t, isRTL, locale } = useTranslation();
  const [rendered, setRendered] = useState<Line[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [log, setLog] = useState<LogItem[]>([]);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Command history recall (ArrowUp / ArrowDown).
  const cmdHistory = useRef<string[]>([]);
  const histPos = useRef<number>(-1);

  // Pending side-effects (open link / scroll) fired just after printing.
  const actionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => actionTimers.current.forEach(clearTimeout), []);

  const name = t.hero.name;
  const role = t.hero.role1;
  const status = t.hero.available;

  // ── Auto-typed intro (unchanged behaviour) ────────────────────────────────
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

  // Keep the newest output in view as history grows.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rendered, typing, log, done]);

  const submit = (raw: string) => {
    const result = runCommand(raw, ctx());
    if (raw.trim()) {
      cmdHistory.current.push(raw);
      if (cmdHistory.current.length > 50) cmdHistory.current.shift();
    }
    histPos.current = -1;
    setLog(prev => {
      if ('clear' in result) return [];
      const next: LogItem[] = [...prev, { kind: 'in', text: raw }];
      for (const line of result.lines) next.push({ kind: 'out', line });
      return next;
    });

    // Fire the side-effect once the confirmation line has painted.
    if (!('clear' in result) && result.action) {
      const act = result.action;
      if (act.type === 'scroll') {
        // Identical path to the nav links: smoothScrollTo() → Lenis. Kicked off
        // on the next animation frame (after the confirmation line paints) with
        // no artificial delay, so it glides exactly like a nav-link click.
        requestAnimationFrame(() => requestAnimationFrame(() => smoothScrollTo(act.id)));
      } else {
        const tid = setTimeout(() => {
          if (act.href.startsWith('mailto:')) window.location.href = act.href;
          else window.open(act.href, '_blank', 'noopener,noreferrer');
        }, 120);
        actionTimers.current.push(tid);
      }
    }
  };

  const ctx = (): TermContext => ({
    locale,
    name,
    role,
    status,
    bio: [t.about.bio1, t.about.bio2, t.about.bio3],
    location: t.contact.location,
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const h = cmdHistory.current;
    if (e.key === 'ArrowUp') {
      if (!h.length) return;
      e.preventDefault();
      histPos.current = histPos.current < 0 ? h.length - 1 : Math.max(0, histPos.current - 1);
      setValue(h[histPos.current]);
    } else if (e.key === 'ArrowDown') {
      if (histPos.current < 0) return;
      e.preventDefault();
      if (histPos.current >= h.length - 1) { histPos.current = -1; setValue(''); }
      else { histPos.current += 1; setValue(h[histPos.current]); }
    }
  };

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'var(--font-arabic), sans-serif' } : {};

  return (
    <section id="overview" className="term-hero">
      {/* Real content for screen readers, independent of the animation */}
      <div className="hd-sr">
        <h1>{name}</h1>
        <p>{role}</p>
      </div>

      <div className="term-win" dir="ltr">
        <div className="term-bar" aria-hidden="true">
          <span className="term-dot" style={{ background: '#ff5f56' }} />
          <span className="term-dot" style={{ background: '#ffbd2e' }} />
          <span className="term-dot" style={{ background: '#27c93f' }} />
          <span className="term-title">alaa@portfolio: ~</span>
        </div>

        <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}
          {...(focused ? { 'data-lenis-prevent': '' } : {})}>
          {/* Decorative auto-typed intro */}
          <div aria-hidden="true">
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
          </div>

          {/* Interactive command I/O (real text, announced politely) */}
          {done && (
            <>
              {log.length === 0 && (
                <div className="term-line term-hint">{"// type 'help' — try 'projects', 'email', or 'resume'"}</div>
              )}
              <div className="term-log" role="log" aria-live="polite">
                {log.map((item, i) =>
                  item.kind === 'in' ? (
                    <div key={i} className="term-line">
                      <span className="term-prompt">$</span> <span className="term-cmd">{item.text}</span>
                    </div>
                  ) : item.line.href ? (
                    <div key={i} className="term-line">
                      <a className={`term-link ${toneClass[item.line.tone ?? 'out']}`}
                        href={item.line.href} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}>{item.line.text}</a>
                    </div>
                  ) : (
                    <div key={i} className={`term-line ${toneClass[item.line.tone ?? 'out']}`}>{item.line.text}</div>
                  )
                )}
              </div>

              <form className="term-line term-inputrow"
                onSubmit={e => { e.preventDefault(); const v = value; setValue(''); submit(v); }}>
                <span className="term-prompt">$</span>
                <label className="term-inputfield">
                  {/* Visible mirror of the input: typed text + a block caret */}
                  <span className="term-input-echo" aria-hidden="true">{value}</span>
                  <span className="term-caret" aria-hidden="true" />
                  {value === '' && !focused && (
                    <span className="term-input-ph" aria-hidden="true">type &apos;help&apos; to explore</span>
                  )}
                  {/* Real, transparent input captures keystrokes / mobile keyboard */}
                  <input
                    ref={inputRef}
                    className="term-input"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label="Interactive terminal — type a command such as help, about, or projects"
                    autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
                  />
                </label>
              </form>
            </>
          )}
        </div>
      </div>

      <button className="term-cue" onClick={() => smoothScrollTo('about')} aria-label="Scroll to content">
        <ArrowDown size={20} className="animate-float" />
      </button>
    </section>
  );
}
