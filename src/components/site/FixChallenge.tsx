import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { pickBug, type FixBug } from '../../lib/fixBugs';

const LAST_SHOWN_KEY = 'fix-last-bugs';
const DEBOUNCE_MS = 350;

function readLastShown(): string[] {
  try {
    const raw = sessionStorage.getItem(LAST_SHOWN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}
function rememberShown(id: string) {
  try {
    const prev = readLastShown();
    sessionStorage.setItem(LAST_SHOWN_KEY, JSON.stringify([id, ...prev].slice(0, 2)));
  } catch { /* sessionStorage unavailable — repeat-avoidance is best-effort only */ }
}

export default function FixChallenge({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [bug, setBug] = useState<FixBug | null>(null);
  const [code, setCode] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [passed, setPassed] = useState(false);
  const [hint, setHint] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pick a fresh bug each time the panel opens, avoiding the last couple shown.
  useEffect(() => {
    if (!open) return;
    const next = pickBug(readLastShown());
    rememberShown(next.id);
    setBug(next);
    setCode(next.srcdoc);
    setPreviewSrc(next.srcdoc);
    setAttempts(0);
    setPassed(false);
    setHint(false);
  }, [open]);

  // Debounced live preview: re-render the sandboxed iframe ~350ms after typing stops.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPreviewSrc(code), DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [code]);

  // The sandboxed iframe posts { type: 'fix-test-result', pass } when its own
  // "Test" button is clicked — only accepted from the iframe we control.
  useEffect(() => {
    if (!open) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (!e.data || e.data.type !== 'fix-test-result') return;
      if (e.data.pass) setPassed(true);
      else setAttempts(a => a + 1);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [open]);

  if (!bug) return null;

  return (
    <Modal open={open} onClose={onClose} title="/fix" titleId="fix-title" isRTL={false} closeLabel="Close">
      <div className="fix-panel" dir="ltr">
        <p className="fix-hint-line">esc to exit</p>

        <div className="fix-meta">
          <span className="fix-tag">{bug.category}</span>
          <span className="fix-title">{bug.title}</span>
        </div>

        {passed ? (
          <div className="fix-success" role="status">
            fixed — solved in {attempts + 1} attempt{attempts + 1 === 1 ? '' : 's'}
          </div>
        ) : (
          <div className="fix-status">
            <span>attempts: {attempts}</span>
            <button type="button" className="fix-hint-btn" onClick={() => setHint(h => !h)}>
              {hint ? 'hide hint' : 'hint'}
            </button>
          </div>
        )}
        {hint && !passed && <p className="fix-hint-text">{bug.hint}</p>}

        <div className="fix-split">
          <textarea
            className="fix-code"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            aria-label="Editable code for the bug-fix challenge"
          />
          <iframe
            ref={iframeRef}
            className="fix-preview"
            srcDoc={previewSrc}
            sandbox="allow-scripts"
            title="Live preview"
            tabIndex={-1}
          />
        </div>
      </div>
    </Modal>
  );
}
