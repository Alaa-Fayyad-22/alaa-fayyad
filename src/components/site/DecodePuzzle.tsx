import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';

const STAGE_COUNT = 4;

const STAGE_RIDDLES: Record<number, string> = {
  1: `Every night, without exception, a man turns off one particular light before he goes to sleep. One night, a storm rolls in and knocks out the power completely — including the backup generator he depends on. The next morning, he learns that someone died because of what happened overnight. He never left the house, never touched a phone, never spoke to anyone. What is his job, and what happened?`,
  2: `Once a year, on the same date, an unmarked envelope arrives in a woman's mailbox. Inside is always the same thing: a single blank sheet of paper, nothing written on it at all. She's never once tried to find out who sends it, because she's always known exactly what it means, and she dreads the year it stops. This year, no envelope comes. A few days later, she reads in a newspaper that a man three states away — someone she has never met and never will — died quietly of natural causes. She isn't shocked. She'd been waiting for this exact kind of news for over a decade. What was the blank paper actually proof of, and how does she know, without anyone telling her, that the story in the paper is about him?`,
  3: `Two women are, in every biological sense, full sisters: same mother, same father, same exact date and year of birth. Neither was adopted. And yet the one word that would normally apply here — 'twins' — has never truthfully described them, not once, and the two people who know the full story both insist it never will. What's the missing piece?`,
  4: `A man is holding a photograph of someone. A friend asks who it is. He says: 'I don't have any brothers or sisters, but that person's father is my father's son.' Who's in the photograph?`,
};

const CLOSE_MESSAGES = ['getting warmer.', "you're circling something.", 'closer than you think.'];

const COMPLETION_MESSAGE = `You didn't get here alone.
Strangers left pieces of light behind —
a guess, a thought, a nudge in the right direction —
so someone they'd never meet could find their way a little further.
Now it's your turn to leave a little light behind, too.`;

type Theory = { id: number; created_at: string; content: string; stage: number };
type State = {
  loading: boolean;
  currentStage: number;
  completed: boolean;
  completedAt: string | null;
  totalTheoryCount: number | null;
  theories: Theory[];
};
type SolvedPanel = {
  stage: number;
  theoryCountAtSolve: number;
  completed: boolean;
  totalTheoryCount: number | null;
};

const COOLDOWN_MS = 25_000;

const initialState: State = {
  loading: true, currentStage: 1, completed: false, completedAt: null, totalTheoryCount: null, theories: [],
};

export default function DecodePuzzle({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<State>(initialState);
  const [guess, setGuess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [closeMessage, setCloseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [solvedPanel, setSolvedPanel] = useState<SolvedPanel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchState = async (): Promise<State> => {
    const data = await fetch('/api/decode').then(r => r.json());
    return {
      loading: false,
      currentStage: data.currentStage ?? 1,
      completed: !!data.completed,
      completedAt: data.completedAt ?? null,
      totalTheoryCount: data.totalTheoryCount ?? null,
      theories: data.theories ?? [],
    };
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setSolvedPanel(null);
    setCloseMessage(null);
    setError(null);
    fetchState()
      .then(fresh => { if (!cancelled) setState(fresh); })
      .catch(() => { if (!cancelled) setState(s => ({ ...s, loading: false })); });
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => {
    if (open && !solvedPanel) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, solvedPanel]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = guess.trim();
    if (!value) return;

    if (value.toLowerCase() === 'exit') { onClose(); return; }
    if (Date.now() < cooldownUntil || solvedPanel) return;

    setSubmitting(true);
    setCloseMessage(null);
    setError(null);

    const optimisticId = -Date.now();
    const optimisticTheory: Theory = { id: optimisticId, created_at: new Date().toISOString(), content: value, stage: state.currentStage };
    setState(s => ({ ...s, theories: [optimisticTheory, ...s.theories] }));
    setGuess('');

    const rollback = () => setState(s => ({ ...s, theories: s.theories.filter(t => t.id !== optimisticId) }));

    try {
      const res = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: value }),
      });

      if (res.status === 429) {
        rollback();
        setError('slow down — one guess every 25s.');
        return;
      }
      if (!res.ok) {
        rollback();
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'could not save your guess — try again.');
        return;
      }

      const data = await res.json();
      setCooldownUntil(Date.now() + COOLDOWN_MS);

      if (data.verdict === 'correct') {
        rollback();
        setSolvedPanel({
          stage: data.stage,
          theoryCountAtSolve: data.theoryCountAtSolve ?? 0,
          completed: !!data.completed,
          totalTheoryCount: data.totalTheoryCount ?? null,
        });
      } else {
        setState(s => ({ ...s, theories: s.theories.map(t => (t.id === optimisticId ? (data.theory ?? t) : t)) }));
        if (data.verdict === 'close') setCloseMessage(CLOSE_MESSAGES[Math.floor(Math.random() * CLOSE_MESSAGES.length)]);
      }
    } catch {
      rollback();
      setError('connection hiccup — try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const continueNext = async () => {
    setSolvedPanel(null);
    setCooldownUntil(0);
    setState(s => ({ ...s, loading: true }));
    setState(await fetchState());
  };

  const showForm = !state.loading && !state.completed && !solvedPanel;

  return (
    <Modal open={open} onClose={onClose} title="/decode" titleId="decode-title" isRTL={false} closeLabel="Close">
      <div className="decode-panel" dir="ltr">
        <p className="decode-hint">esc or type &apos;exit&apos; to close</p>

        {!state.loading && !state.completed && !solvedPanel && (
          <p className="decode-progress">stage {state.currentStage} of {STAGE_COUNT}</p>
        )}

        {solvedPanel && (
          <div className="decode-solved" role="status">
            <p style={{ margin: 0 }}>
              stage {solvedPanel.stage} solved — cracked after {solvedPanel.theoryCountAtSolve} theories
              {solvedPanel.completed && solvedPanel.totalTheoryCount != null && (
                <> · the chain is complete, {solvedPanel.totalTheoryCount} combined theories</>
              )}
            </p>
            <button type="button" className="decode-submit decode-continue" onClick={continueNext}>
              {solvedPanel.completed ? 'reveal the ending →' : 'continue to next riddle →'}
            </button>
          </div>
        )}

        {!solvedPanel && state.completed && (
          <div className="decode-complete" role="status">
            <pre className="decode-complete-text">{COMPLETION_MESSAGE}</pre>
            <p className="decode-complete-stat">
              carried by {state.totalTheoryCount ?? 0} theories, from visitors who never met each other
            </p>
          </div>
        )}

        {!state.completed && !solvedPanel && <pre className="decode-riddle">{STAGE_RIDDLES[state.currentStage]}</pre>}

        {!state.completed && !solvedPanel && (
          <div className="decode-feed" role="log" aria-live="polite">
            {state.loading ? (
              <p className="decode-muted">loading theories…</p>
            ) : state.theories.length === 0 ? (
              <p className="decode-muted">no theories yet — be the first.</p>
            ) : (
              state.theories.map((t, i) => (
                <div key={t.id} className="decode-theory">
                  <span className="decode-theory-label">#{state.theories.length - i}</span>
                  <span className="decode-theory-content">{t.content}</span>
                </div>
              ))
            )}
          </div>
        )}

        {showForm && (
          <form className="decode-form" onSubmit={submit}>
            <input
              ref={inputRef}
              className="decode-input"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="type a theory, a guess, or 'exit'"
              autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
              maxLength={500}
              aria-label="Submit a theory or guess"
            />
            <button type="submit" className="decode-submit" disabled={submitting || !guess.trim()}>
              submit
            </button>
          </form>
        )}
        {closeMessage && <p className="decode-close">{closeMessage}</p>}
        {error && <p className="decode-error">{error}</p>}
      </div>
    </Modal>
  );
}
