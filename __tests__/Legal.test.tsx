import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Legal from '../src/components/site/Legal';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: { getItem: jest.fn(() => null), setItem: jest.fn() },
    writable: true,
  });
});

// Lenis needs ResizeObserver, which jsdom doesn't implement.
class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;

/** A real wheel gesture, not a scrollbar drag. */
function wheel(target: Element) {
  const e = new WheelEvent('wheel', {
    deltaY: 120, bubbles: true, cancelable: true,
  });
  target.dispatchEvent(e);
  return e;
}

const openPrivacy = async () => {
  const user = userEvent.setup();
  render(<Legal />);
  const trigger = screen.getByRole('button', { name: 'Privacy Policy' });
  await user.click(trigger);
  return { user, trigger };
};

describe('Legal modals', () => {
  it('is closed until the trigger is clicked', () => {
    render(<Legal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('exposes the correct dialog semantics', async () => {
    await openPrivacy();
    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // aria-labelledby must point at the heading that is actually rendered.
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBe('privacy-title');
    expect(document.getElementById(labelledBy!)).toHaveTextContent('Privacy Policy');
  });

  it('moves focus into the dialog and restores it to the trigger on close', async () => {
    const { user, trigger } = await openPrivacy();
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toHaveFocus();

    await user.click(close);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const { user } = await openPrivacy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('traps Tab / Shift+Tab inside the dialog', async () => {
    const { user } = await openPrivacy();
    const dialog = screen.getByRole('dialog');
    const close = within(dialog).getByRole('button', { name: 'Close' });

    // Close is first in the trap; Shift+Tab from it must wrap to the last node,
    // which stays inside the dialog rather than escaping to the page behind.
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(document.activeElement).not.toBe(close);

    // Forward from the last node wraps back to the first.
    await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('locks background scroll while open and releases it on close', async () => {
    const { user } = await openPrivacy();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('renders privacy content that matches what the code actually does', async () => {
    await openPrivacy();
    const dialog = screen.getByRole('dialog');

    // The two localStorage keys that genuinely exist.
    expect(dialog).toHaveTextContent('lang');
    expect(dialog).toHaveTextContent('theme');
    // Named processors + the IP promise.
    expect(dialog).toHaveTextContent('Resend');
    expect(dialog).toHaveTextContent('BotID');
    expect(dialog).toHaveTextContent(/does not log, store, geolocate, or email your IP address/i);
    // Fixed date, not a live one.
    expect(dialog).toHaveTextContent('14 July 2026');
  });

  // Regression: Lenis's wheel listener survives lenis.stop() and preventDefaults
  // every wheel event while stopped, so wheel/trackpad scrolling inside the modal
  // died while scrollbar-dragging still worked. Driven through a REAL Lenis
  // instance so the guard breaks if the attribute or Lenis's behaviour changes.
  describe('wheel scrolling with a live Lenis instance', () => {
    let lenis: { stop: () => void; start: () => void; destroy: () => void };

    beforeEach(async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({ smoothWheel: true });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    });

    afterEach(() => {
      lenis.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    });

    it('lets wheel events through to the scroll region while the modal is open', async () => {
      await openPrivacy();
      const dialog = screen.getByRole('dialog');
      const scroller = dialog.querySelector('.modal-scroll')!;

      // Modal open => Modal called lenis.stop(). Without data-lenis-prevent,
      // Lenis's still-attached handler preventDefaults this and the region
      // cannot scroll by wheel.
      const e = wheel(scroller);
      expect(e.defaultPrevented).toBe(false);
    });

    it('still blocks wheel scrolling on the backdrop behind the modal', async () => {
      await openPrivacy();
      const overlay = document.querySelector('.modal-overlay')!;

      // The background must stay locked: outside .modal-scroll, Lenis's stopped
      // branch should still swallow the wheel event.
      const e = wheel(overlay);
      expect(e.defaultPrevented).toBe(true);
    });

    it('restores normal page wheel scrolling after the modal closes', async () => {
      const { user } = await openPrivacy();
      await user.keyboard('{Escape}');

      // Modal closed => lenis.start(); Lenis handles the wheel itself again
      // (smoothWheel preventDefaults so it can apply its own easing).
      const e = wheel(document.body);
      expect(e.defaultPrevented).toBe(true);
    });
  });

  it('opens Terms with its own heading and the no-license rule', async () => {
    const user = userEvent.setup();
    render(<Legal />);
    await user.click(screen.getByRole('button', { name: 'Terms of Use' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'terms-title');
    expect(dialog).toHaveTextContent(/absence of a license is not permission/i);
  });
});
