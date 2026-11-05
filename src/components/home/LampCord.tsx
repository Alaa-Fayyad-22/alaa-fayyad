import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import { logEvent } from '../../lib/track';
import styles from './home.module.css';
import { cx } from '../workspace/cx';

/*
 * Lamp pull-cord, fixed top-right, that flips light/dark.
 *
 * The cord is a real ROPE: a chain of linked points integrated with Verlet
 * physics and drawn as ONE smooth SVG path. The brown bead is drawn in the same
 * SVG at the rope's last point (so it can never detach), and the <button> is
 * only an invisible grab target that follows the bead. Ported 1:1 from
 * design/alaa-portfolio-redesign.html ("Lamp cord: a real rope + a real bulb
 * flicker") — the numbers below are the ones that were tuned there.
 *
 * Performance contract: the simulation lives entirely in closure variables +
 * requestAnimationFrame and writes straight to the DOM (path `d`, transforms).
 * React state is NEVER touched per frame. The loop sleeps when everything is
 * still and wakes on pointerdown.
 *
 * Theme: the preference goes through the shared useTheme hook (same
 * localStorage key + <html data-theme> as /classic and the no-flash script in
 * _document.tsx). The bulb flicker is a full-screen .flash layer animated on
 * opacity only; the theme switches ONCE at 300ms while that layer fully covers
 * the screen, with transitions off, which is what removes the lag.
 */

// Rope geometry. N segments, anchored inside the lamp at (AX, AY).
const N = 16;
const AX = 60;
const AY = -4;
const REST_DESKTOP = 120;
const REST_MOBILE = 104;
// A real pull switch feeds cord out of the lamp: always a little MORE than
// needed (SLACK) so it stays loose, up to MAX_EXT in total, where it goes taut.
// The switch clicks once you pull past TRIGGER.
const MAX_EXT = 70;
const SLACK = 16;
const TRIGGER = 48;
// Verlet solver: gravity, damping, constraint iterations, fixed time step.
const G = 2400;
const DAMP = 0.995;
const ITER = 16;
const STEP = 1 / 120;
// After release the cord hangs on the lamp's SPRING and the bead bobs around
// its resting point (up past it, down past it, smaller each time).
const KSPR = 220; // spring stiffness
const CSPR = 5; // spring damping
const REEL = 380; // max speed the spring can pull cord in
const EXT_MIN = -40; // how far above rest the bead can be pulled
const KS = 600; // springiness of the cord near the bead (the yo-yo bounce)
const CD = 0.22; // cord friction while it stretches (bounce damping)
const KICK = 0.2; // tiny sideways imperfection on release so slack visibly folds
const TUG_MS = 0.12; // scripted tug (tap / keyboard) duration, seconds
const TUG_PX = 62; // ...and how far it pulls

const FLASH_FRAMES: Keyframe[] = [
  { opacity: 0 },
  { opacity: 0.8, offset: 0.06 },
  { opacity: 0, offset: 0.14 },
  { opacity: 0.55, offset: 0.24 },
  { opacity: 0.05, offset: 0.33 },
  { opacity: 1, offset: 0.45 },
  { opacity: 1, offset: 0.62 },
  { opacity: 0 },
];
const FLASH_MS = 560;
const SWAP_AT_MS = 300; // inside the fully-covered window of the flash

export default function LampCord() {
  const { t } = useTranslation();
  const { toggleTheme } = useTheme();
  const [hintGone, setHintGone] = useState(false);

  const lampRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const ropeRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGGElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  // Persistent bead angle (degrees): smoothed across frames, never reset.
  const tipAng = useRef(0);
  // The simulation effect runs once; it reaches the latest hook closure here.
  const toggleRef = useRef(toggleTheme);
  toggleRef.current = toggleTheme;

  useEffect(() => {
    const lamp = lampRef.current;
    const handle = handleRef.current;
    const ropeEl = ropeRef.current;
    const tipEl = tipRef.current;
    const flash = flashRef.current;
    if (!lamp || !handle || !ropeEl || !tipEl || !flash) return;

    const html = document.documentElement;
    let reduce = false;
    let mobile: MediaQueryList | null = null;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      mobile = window.matchMedia('(max-width: 900px)');
    } catch {
      /* matchMedia unavailable — desktop rope, animations on */
    }

    /* ---------- Theme switch + bulb flicker ---------- */
    let switching = false;
    let swapTimer: ReturnType<typeof setTimeout> | null = null;
    let swapRaf = 0;
    let anim: Animation | null = null;

    const swap = () => {
      swapTimer = null;
      // Transitions off, apply, force the style recalculation, then restore
      // transitions on the next frame so nothing animates between the themes.
      html.classList.add('no-trans');
      toggleRef.current();
      void getComputedStyle(document.body).backgroundColor;
      swapRaf = requestAnimationFrame(() => html.classList.remove('no-trans'));
    };

    const toggle = () => {
      if (switching) return;
      const next = (html.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
      logEvent('home_theme_toggle', { value: next });
      setHintGone(true);
      if (reduce || typeof flash.animate !== 'function') {
        swap();
        return;
      }
      switching = true;
      flash.style.background = next === 'light' ? '#F2EEE8' : '#0E0C0B';
      anim = flash.animate(FLASH_FRAMES, { duration: FLASH_MS, easing: 'linear' });
      swapTimer = setTimeout(swap, SWAP_AT_MS);
      anim.onfinish = () => {
        switching = false;
        anim = null;
      };
    };

    /* ---------- Reduced motion: no flash, no simulation, just toggle ---------- */
    if (reduce) {
      const onClick = () => toggle();
      handle.addEventListener('click', onClick);
      return () => {
        handle.removeEventListener('click', onClick);
        if (swapRaf) cancelAnimationFrame(swapRaf);
        html.classList.remove('no-trans');
      };
    }

    /* ---------- Rope state ---------- */
    let REST = mobile && mobile.matches ? REST_MOBILE : REST_DESKTOP;
    const px: number[] = [];
    const py: number[] = [];
    const ox: number[] = [];
    const oy: number[] = [];
    const inv: number[] = [];
    const hang = () => {
      // (re)build the rope hanging straight; anchor fixed, tip heavier
      for (let k = 0; k <= N; k++) {
        px[k] = ox[k] = AX;
        py[k] = oy[k] = AY + (REST * k) / N;
        inv[k] = k === 0 ? 0 : k === N ? 0.3 : 1;
      }
    };
    hang();

    let ext = 0; // extra length pulled out of the lamp
    let vExt = 0;
    let dragging = false;
    let armed = false;
    let moved = 0;
    let tx = 0;
    let ty = 0;
    let grabX = 0;
    let grabY = 0;
    let downX = 0;
    let downY = 0;
    let tug: { t: number; x: number; y: number } | null = null;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let calm = 0;

    const kick = () => {
      // no real rope is perfectly straight
      if (reduce) return;
      const dir = Math.random() < 0.5 ? -1 : 1;
      for (let k = 1; k < N; k++) {
        ox[k] = px[k] - dir * KICK * Math.sin((Math.PI * k) / N) * (0.7 + Math.random() * 0.6);
      }
    };

    // The tip follows the finger 1:1 until the end stop (a few px of give).
    const aimTip = () => {
      let dx = tx - AX;
      let dy = ty - AY;
      let d = Math.hypot(dx, dy) || 1;
      const LMAX = REST + MAX_EXT;
      if (d > LMAX) {
        const stop = LMAX + 6 * Math.tanh((d - LMAX) / 30);
        dx = (dx / d) * stop;
        dy = (dy / d) * stop;
        d = stop;
      }
      // cord fed out = what's needed + slack, capped at the end stop
      ext = Math.min(MAX_EXT, Math.max(0, d - REST + SLACK));
      vExt = 0;
      if (d > REST + TRIGGER) armed = true;
      // ox keeps the last spot, so the speed carries over on release
      px[N] = AX + dx;
      py[N] = AY + dy;
    };

    const sim = () => {
      if (tug) {
        // scripted quick tug (tap / keyboard)
        tug.t += STEP;
        const k = Math.min(1, tug.t / TUG_MS);
        tx = tug.x;
        ty = tug.y + TUG_PX * (1 - Math.pow(1 - k, 3));
        if (k >= 1) {
          tug = null;
          dragging = false;
          kick();
          toggle();
        }
      }
      const pinned = dragging || !!tug;
      if (pinned) {
        aimTip();
      } else {
        // The lamp's spring snaps the cord back in fast, then stops dead. The
        // bead's momentum throws it up past rest, the cord goes slack and folds,
        // gravity drops it and the springy cord catches it: yo-yo.
        vExt += (-KSPR * ext - CSPR * vExt) * STEP;
        vExt = Math.max(vExt, -REEL);
        ext += vExt * STEP;
        if (ext < EXT_MIN) {
          ext = EXT_MIN;
          vExt = 0;
        }
      }
      const seg = (REST + ext) / N;
      for (let k = 1; k <= N; k++) {
        if (k === N && pinned) {
          ox[k] = px[k];
          oy[k] = py[k];
          continue;
        }
        const vx = (px[k] - ox[k]) * DAMP;
        const vy = (py[k] - oy[k]) * DAMP;
        ox[k] = px[k];
        oy[k] = py[k];
        px[k] += vx;
        py[k] += vy + G * STEP * STEP;
      }
      // The last stretch of cord (to the bead) is ELASTIC when you're not
      // holding it: longer than its rest length it pulls back like a spring
      // instead of stopping the bead dead. That's what makes it bounce.
      if (!pinned) {
        const dx = px[N] - px[N - 1];
        const dy = py[N] - py[N - 1];
        const d = Math.hypot(dx, dy);
        if (d > seg) {
          const c = ((d - seg) * KS * STEP * STEP) / d;
          px[N] -= dx * c;
          py[N] -= dy * c; // bead pulled up
          px[N - 1] += dx * c * 0.6;
          py[N - 1] += dy * c * 0.6; // cord pulled down
          // internal friction of the cord damps the stretch speed, in BOTH
          // directions, so the yo-yo dies out instead of hopping forever
          const rv =
            (((px[N] - ox[N]) - (px[N - 1] - ox[N - 1])) * dx) / d +
            (((py[N] - oy[N]) - (py[N - 1] - oy[N - 1])) * dy) / d;
          ox[N] += (dx / d) * rv * CD;
          oy[N] += (dy / d) * rv * CD;
        }
      }
      // Distance constraints are ONE-SIDED: they only fix segments that are too
      // long. Slack is allowed — that is the bending.
      for (let it = 0; it < ITER; it++) {
        const end = pinned ? N : N - 1;
        for (let k = 0; k < end; k++) {
          const dx = px[k + 1] - px[k];
          const dy = py[k + 1] - py[k];
          const d = Math.hypot(dx, dy);
          if (d <= seg) continue;
          const wa = inv[k];
          const wb = k + 1 === N && pinned ? 0 : inv[k + 1];
          const w = wa + wb;
          if (!w) continue;
          const f = (d - seg) / d / w;
          px[k] += dx * f * wa;
          py[k] += dy * f * wa;
          px[k + 1] -= dx * f * wb;
          py[k + 1] -= dy * f * wb;
        }
      }
      // A rope pulled TIGHT (at the end stop) is a straight line. The solver
      // alone jitters when both ends are held, so only then we lay it straight.
      // Below max tension the rope stays loose and free to wobble. (ox/oy are
      // left alone: each point keeps its previous spot, so speed carries on.)
      if (pinned) {
        const dx = px[N] - AX;
        const dy = py[N] - AY;
        if (Math.hypot(dx, dy) >= REST + ext - 0.5) {
          for (let k = 1; k < N; k++) {
            px[k] = AX + (dx * k) / N;
            py[k] = AY + (dy * k) / N;
          }
        }
      }
    };

    const draw = () => {
      let d = `M${px[0].toFixed(1)} ${py[0].toFixed(1)}`;
      for (let k = 1; k < N; k++) {
        // smooth quadratic curve through the points
        const mx = (px[k] + px[k + 1]) / 2;
        const my = (py[k] + py[k + 1]) / 2;
        d += ` Q${px[k].toFixed(1)} ${py[k].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += ` L${px[N].toFixed(1)} ${py[N].toFixed(1)}`;
      ropeEl.setAttribute('d', d);

      // Bead angle: it is tied to the cord, so it points along the cord's last
      // stretch at ANY angle. Read over the last few px of cord (one tiny
      // segment spins wildly when slack), turning the short way round.
      const pinned = dragging || !!tug;
      const span = pinned ? 6 : 14; // free bead: read a longer, calmer stretch
      let j = N - 1;
      while (j > 0 && Math.hypot(px[N] - px[j], py[N] - py[j]) < span) j--;
      const ax = px[N] - px[j];
      const ay = py[N] - py[j];
      if (Math.hypot(ax, ay) > 3) {
        const target = Math.atan2(ax, ay) * -57.2958;
        const diff = ((target - tipAng.current + 540) % 360) - 180; // shortest turn
        tipAng.current += diff * (pinned ? 0.5 : 0.18); // a free bead turns with some weight
      }
      tipEl.setAttribute(
        'transform',
        `translate(${px[N].toFixed(1)} ${py[N].toFixed(1)}) rotate(${tipAng.current.toFixed(1)})`,
      );
      handle.style.transform = `translate(${(px[N] - 26).toFixed(1)}px, ${(py[N] - 10).toFixed(1)}px)`;
    };

    const frame = (now: number) => {
      acc += Math.min(0.05, (now - last) / 1000);
      last = now;
      while (acc >= STEP) {
        sim();
        acc -= STEP;
      }
      draw();
      // sleep once everything is still (saves battery)
      let motion = Math.abs(vExt) + Math.abs(ext);
      for (let k = 1; k <= N; k++) motion += Math.abs(px[k] - ox[k]) + Math.abs(py[k] - oy[k]);
      calm = !dragging && !tug && motion < 0.05 ? calm + 1 : 0;
      if (calm > 30) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (raf) return;
      last = performance.now();
      acc = 0;
      calm = 0;
      raf = requestAnimationFrame(frame);
    };

    /* ---------- Input ---------- */
    const local = (e: PointerEvent): [number, number] => {
      const r = lamp.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      try {
        handle.setPointerCapture(e.pointerId);
      } catch {
        /* unsupported (jsdom) or pointer already gone — dragging still works */
      }
      const [x, y] = local(e);
      grabX = x - px[N];
      grabY = y - py[N];
      downX = e.clientX;
      downY = e.clientY;
      tx = px[N];
      ty = py[N];
      dragging = true;
      armed = false;
      moved = 0;
      tug = null;
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || tug) return;
      const [x, y] = local(e);
      tx = x - grabX;
      ty = y - grabY;
      moved = Math.max(moved, Math.hypot(e.clientX - downX, e.clientY - downY));
    };
    const onUp = () => {
      if (!dragging || tug) return;
      if (moved < 5) {
        // a tap = a quick scripted tug
        tug = { t: 0, x: AX, y: AY + REST };
        return;
      }
      dragging = false;
      kick();
      if (armed) toggle();
      wake();
    };
    const onClick = (e: MouseEvent) => {
      // Keyboard (Enter / Space) arrives as a click with detail 0. Real pointer
      // clicks (detail > 0) were already handled by pointerdown/up.
      if (e.detail !== 0 || tug) return;
      dragging = true;
      tug = { t: 0, x: AX, y: AY + REST };
      wake();
    };
    const onBreakpoint = () => {
      REST = mobile && mobile.matches ? REST_MOBILE : REST_DESKTOP;
      hang();
      draw();
    };

    handle.addEventListener('pointerdown', onDown);
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
    handle.addEventListener('click', onClick);
    mobile?.addEventListener?.('change', onBreakpoint);

    draw();
    // tiny idle sway so it looks hung, not drawn
    ox[N] = px[N] - 1.2;
    wake();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (swapRaf) cancelAnimationFrame(swapRaf);
      if (swapTimer) clearTimeout(swapTimer);
      if (anim) anim.cancel();
      html.classList.remove('no-trans');
      handle.removeEventListener('pointerdown', onDown);
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      handle.removeEventListener('click', onClick);
      mobile?.removeEventListener?.('change', onBreakpoint);
    };
  }, []);

  return (
    <>
      <div className={styles.lamp} ref={lampRef}>
        <svg aria-hidden="true">
          <defs>
            <linearGradient id="lampTipGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#A9744E" />
              <stop offset="1" stopColor="#6F4329" />
            </linearGradient>
          </defs>
          <path className={styles.rope} ref={ropeRef} d={`M${AX} ${AY} L${AX} ${AY + REST_DESKTOP}`} />
          <g ref={tipRef} transform={`translate(${AX} ${AY + REST_DESKTOP})`}>
            <rect className={styles.cap} x="-4" y="-3" width="8" height="7" rx="2" />
            <rect className={styles.tip} x="-9" y="3" width="18" height="30" rx="9" />
            <rect className={styles.shine} x="-6" y="7" width="3" height="18" rx="1.5" />
          </g>
        </svg>
        <button
          ref={handleRef}
          className={styles.handle}
          type="button"
          aria-label={t.home.cord.aria}
          style={{ transform: `translate(${AX - 26}px, ${AY + REST_DESKTOP - 10}px)` }}
        />
      </div>
      <div className={styles.flash} ref={flashRef} aria-hidden="true" />
      <span className={cx(styles.cordHint, hintGone && styles.cordHintGone)} aria-hidden="true">
        {t.home.cord.hint}
      </span>
    </>
  );
}
