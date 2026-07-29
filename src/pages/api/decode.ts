// /decode — a 4-stage collaborative riddle chain. Each stage's answer lives
// only in PUZZLE_ANSWERS (a server env var, one keyword per stage) and is
// compared here; it is never sent to the client, logged, or present in any
// response body. Every Supabase call's `error` is checked explicitly — this
// client never throws on a failed write, so an unchecked call silently no-ops.
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabase } from '../../lib/supabase';
import { field, safeIp, rateLimit, isSameOrigin } from '../../lib/security';

const STAGE_COUNT = 4;

function getStageAnswers(): string[] {
  return (process.env.PUZZLE_ANSWERS ?? '').split(',').map(s => s.trim());
}

// Related-but-wrong words that mean a guesser is thinking along the right
// lines without saying the answer itself.
const CLOSE_KEYWORDS: Record<number, string[]> = {
  1: ['light', 'keeper', 'beacon', 'storm', 'power', 'coast'],
  2: ['jail', 'cell', 'sentence', 'inmate', 'letter', 'envelope'],
  3: ['womb', 'ivf', 'carrier', 'donor', 'embryo'],
  4: ['himself', 'the man', 'riddle', 'self'],
};

/** Case-insensitive whole-word/phrase match: must appear as a distinct word, not just a substring. */
function wordMatch(guess: string, phrase: string): boolean {
  if (!phrase) return false;
  const escaped = phrase.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(guess);
}

type Verdict = 'correct' | 'close' | 'incorrect';

function judge(guess: string, stage: number): Verdict {
  const answer = getStageAnswers()[stage - 1] ?? '';
  if (wordMatch(guess, answer)) return 'correct';
  if ((CLOSE_KEYWORDS[stage] ?? []).some(kw => wordMatch(guess, kw))) return 'close';
  return 'incorrect';
}

type StageSolvedAt = Record<string, string>;
type PuzzleState = { id: number; current_stage: number; stage_solved_at: StageSolvedAt; updated_at: string };

async function getState(supabase: ReturnType<typeof getSupabase>): Promise<PuzzleState> {
  const { data, error } = await supabase.from('puzzle_state').select('*').eq('id', 1).single();
  if (error || !data) throw error ?? new Error('puzzle_state row missing');
  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabase();

  const rawIp =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.headers['x-real-ip']?.toString() ||
    req.socket.remoteAddress ||
    '';
  const validIp = safeIp(rawIp);
  const ipKey = validIp || rawIp || 'unknown';

  if (req.method === 'GET') {
    // Read-only and public, but still throttled — otherwise this endpoint has
    // no request cost at all and can be hammered freely.
    if (!rateLimit(`decode:get:${ipKey}`, 20, 10_000))
      return res.status(429).json({ error: 'Too many requests. Try again in a bit.' });

    let state: PuzzleState;
    try {
      state = await getState(supabase);
    } catch (err) {
      console.error('[decode] GET: failed to load puzzle_state', err);
      return res.status(500).json({ error: 'Could not load puzzle state' });
    }

    const completed = state.current_stage > STAGE_COUNT;
    if (completed) {
      const { count: totalTheoryCount, error: countError } = await supabase
        .from('puzzle_theories')
        .select('*', { count: 'exact', head: true });
      if (countError) console.error('[decode] GET: total count failed', countError);

      return res.status(200).json({
        currentStage: STAGE_COUNT,
        completed: true,
        completedAt: (state.stage_solved_at as StageSolvedAt | null)?.[STAGE_COUNT] ?? null,
        totalTheoryCount: totalTheoryCount ?? null,
        theories: [],
      });
    }

    const { data: theories, error: theoriesError } = await supabase
      .from('puzzle_theories')
      .select('id, created_at, content, stage')
      .eq('stage', state.current_stage)
      .order('created_at', { ascending: false })
      .limit(300);
    if (theoriesError) {
      console.error('[decode] GET: failed to load theories', theoriesError);
      return res.status(500).json({ error: 'Could not load theories' });
    }

    return res.status(200).json({
      currentStage: state.current_stage,
      completed: false,
      completedAt: null,
      totalTheoryCount: null,
      theories: theories ?? [],
    });
  }

  if (req.method === 'POST') {
    if (!isSameOrigin(req)) return res.status(403).json({ error: 'Cross-site request rejected' });

    let state: PuzzleState;
    try {
      state = await getState(supabase);
    } catch (err) {
      console.error('[decode] POST: failed to load puzzle_state', err);
      return res.status(500).json({ error: 'Could not load puzzle state' });
    }

    if (state.current_stage > STAGE_COUNT) return res.status(200).json({ verdict: 'correct', completed: true });

    const stage = state.current_stage;

    if (!rateLimit(`decode:${ipKey}:stage${stage}`, 1, 25_000))
      return res.status(429).json({ error: 'Too many guesses. Try again in a bit.' });

    const guess = field(req.body?.guess, 500);
    if (!guess) return res.status(400).json({ error: 'A guess is required' });

    const verdict = judge(guess, stage);

    const { data: inserted, error: insertError } = await supabase
      .from('puzzle_theories')
      .insert({ content: guess, stage, is_correct: verdict === 'correct' })
      .select('id, created_at, content, stage')
      .single();
    if (insertError || !inserted) {
      console.error('[decode] POST: insert failed', insertError);
      return res.status(500).json({ error: 'Could not save your guess. Try again.' });
    }

    if (verdict !== 'correct') return res.status(200).json({ verdict, theory: inserted });

    const { count: stageCount, error: stageCountError } = await supabase
      .from('puzzle_theories')
      .select('*', { count: 'exact', head: true })
      .eq('stage', stage);
    if (stageCountError) console.error('[decode] POST: stage count failed', stageCountError);
    const theoryCountAtSolve = stageCount ?? 0;

    const nextStage = stage + 1;
    const stageSolvedAt: StageSolvedAt = { ...((state.stage_solved_at as StageSolvedAt | null) ?? {}), [stage]: new Date().toISOString() };

    const { error: updateError } = await supabase
      .from('puzzle_state')
      .update({ current_stage: nextStage, stage_solved_at: stageSolvedAt })
      .eq('id', 1);
    if (updateError) {
      console.error('[decode] POST: puzzle_state advance failed', updateError);
      return res.status(500).json({ error: 'Solved, but failed to advance the puzzle. Try again.' });
    }

    const completed = nextStage > STAGE_COUNT;
    let totalTheoryCount: number | null = null;
    if (completed) {
      const { count: totalCount, error: totalCountError } = await supabase
        .from('puzzle_theories')
        .select('*', { count: 'exact', head: true });
      if (totalCountError) console.error('[decode] POST: total count failed', totalCountError);
      totalTheoryCount = totalCount ?? 0;
    }

    return res.status(200).json({
      verdict: 'correct',
      theory: inserted,
      stage,
      nextStage: completed ? null : nextStage,
      completed,
      theoryCountAtSolve,
      totalTheoryCount,
    });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
