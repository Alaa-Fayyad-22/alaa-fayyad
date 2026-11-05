import { render, screen, waitFor, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import HomePage from '../src/components/home/HomePage';
import { experiences } from '../src/data/portfolio';

// Arches navigate with the Pages Router; there is no router mounted in jsdom.
const push = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push, pathname: '/', asPath: '/' }),
}));

// jsdom has no IntersectionObserver (scroll-spy, story timeline, reveals).
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = NoopIntersectionObserver;

beforeEach(() => {
  push.mockClear();
  Object.defineProperty(window, 'localStorage', {
    value: { getItem: jest.fn(() => null), setItem: jest.fn() },
    writable: true,
  });
  // Skip the first-visit loader overlay — it is covered by its own flag.
  window.sessionStorage.setItem('home-loaded', '1');
});

const workSection = (container: HTMLElement) => container.querySelector('#work') as HTMLElement;

describe('HomePage', () => {
  it('renders the hero, nav and the main sections', () => {
    const { container } = render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Alaa.");
    expect(container.querySelector('#home')).toBeInTheDocument();
    expect(container.querySelector('#work')).toBeInTheDocument();
    expect(container.querySelector('#story')).toBeInTheDocument();
    expect(container.querySelector('#contact')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('shows the loader overlay only on the first visit of a session', () => {
    window.sessionStorage.removeItem('home-loaded');
    const first = render(<HomePage />);
    expect(screen.getByText('COMPILING THE WORK')).toBeInTheDocument();
    first.unmount();

    render(<HomePage />);
    expect(screen.queryByText('COMPILING THE WORK')).not.toBeInTheDocument();
  });

  it('renders the loader into the server HTML (no flash), flagged for the pre-paint gate', () => {
    window.sessionStorage.removeItem('home-loaded');
    // react-dom/server needs TextEncoder, which the jsdom environment lacks.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (globalThis as any).TextEncoder ??= require('util').TextEncoder;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderToString } = require('react-dom/server');
    const html: string = renderToString(<HomePage />);
    expect(html).toContain('COMPILING THE WORK');
    expect(html).toContain('data-home-loader');
  });

  it('builds each arch from two leaves with edge, hinges and knob, plus a plaque and floor spill', () => {
    const { container } = render(<HomePage />);
    const arch = workSection(container).querySelector('a[href="/work/backend"]') as HTMLElement;
    // CSS modules are mocked to {} in jest, so assert on structure, not classes.
    const frame = arch.firstElementChild as HTMLElement;
    const inside = frame.firstElementChild as HTMLElement;
    const [room, leafL, leafR, plaque] = Array.from(inside.children) as HTMLElement[];
    expect(inside.children).toHaveLength(4);
    expect(room).toHaveAttribute('aria-hidden', 'true');
    for (const leaf of [leafL, leafR]) {
      // edge, two hinges, knob
      expect(leaf.children).toHaveLength(4);
    }
    expect(plaque).toHaveTextContent('BACKEND & DATA');
    // .spill sits in .frame AFTER .inside; the sign is a sibling of the leaves
    expect(frame.children).toHaveLength(2);
    expect(frame.lastElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('flips the theme through useTheme when the cord is pulled with the keyboard', () => {
    jest.useFakeTimers();
    try {
      document.documentElement.setAttribute('data-theme', 'dark');
      render(<HomePage />);
      const cord = screen.getByRole('button', { name: /cord/i });
      // keyboard activation = click with detail 0 -> scripted tug -> toggle
      fireEvent.click(cord);
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.classList.contains('no-trans')).toBe(false);
      // a mouse click (detail > 0) is ignored: pointerdown/up already handled it
      fireEvent.click(cord, { detail: 1 });
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    } finally {
      jest.useRealTimers();
      document.documentElement.removeAttribute('data-theme');
    }
  });

  it('links the three arches to /work/frontend, /work/design and /work/backend', () => {
    const { container } = render(<HomePage />);
    const hrefs = Array.from(workSection(container).querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/work/frontend', '/work/design', '/work/backend']);
  });

  it('plays the door animation, then navigates on a plain click', async () => {
    jest.useFakeTimers();
    try {
      const { container } = render(<HomePage />);
      const link = workSection(container).querySelector('a[href="/work/design"]') as HTMLElement;
      fireEvent.click(link);
      expect(push).not.toHaveBeenCalled();
      expect(link).toHaveAttribute('data-entering', 'true');
      // the doors take 1.1s to swing; we navigate at 1000ms, not before
      act(() => {
        jest.advanceTimersByTime(900);
      });
      expect(push).not.toHaveBeenCalled();
      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(push).toHaveBeenCalledWith('/work/design');
    } finally {
      jest.useRealTimers();
    }
  });

  it('does not hijack modified clicks', () => {
    const { container } = render(<HomePage />);
    const link = workSection(container).querySelector('a[href="/work/frontend"]') as HTMLElement;
    // React's handler runs first; record whether it called preventDefault, then
    // cancel the click ourselves so jsdom does not try to navigate.
    const prevented: boolean[] = [];
    const spy = (e: Event) => {
      prevented.push(e.defaultPrevented);
      e.preventDefault();
    };
    document.addEventListener('click', spy);
    try {
      fireEvent.click(link, { ctrlKey: true });
      fireEvent.click(link, { metaKey: true });
    } finally {
      document.removeEventListener('click', spy);
    }
    expect(prevented).toEqual([false, false]);
    expect(push).not.toHaveBeenCalled();
    expect(link).not.toHaveAttribute('data-entering');
  });

  it('keeps nothing but the heading and the arches in the work section', () => {
    const { container } = render(<HomePage />);
    const work = workSection(container);
    // Only the heading block and the wall are direct children.
    expect(work.children).toHaveLength(2);
    expect(within(work).getAllByRole('heading')).toHaveLength(1);
    expect(within(work).getAllByRole('link')).toHaveLength(3);
    expect(work.querySelector('img, picture, video, form, button, iframe')).toBeNull();
  });

  it('flips the role card to the next role on click', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    const card = screen.getByRole('button', { name: 'Show next role' });
    expect(card).toHaveTextContent('Full-stack Dev');
    await user.click(card);
    await waitFor(() => expect(card).toHaveTextContent('UI/UX Designer'));
    expect(card).toHaveTextContent('02 / 03');
  });

  it('renders one timeline item per experience, with the first active', () => {
    render(<HomePage />);
    const timeline = screen.getByTestId('story-timeline');
    expect(timeline.children).toHaveLength(experiences.length);
    expect(screen.getByTestId('story-year')).toHaveTextContent(String(experiences[0].period.match(/\d{4}/)?.[0]));
    expect(timeline.children[0]).toHaveAttribute('data-active', 'true');
  });

  it('posts to /api/quote with the quote payload shape', async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn(async () => ({ ok: true }) as Response);
    (globalThis as unknown as { fetch: unknown }).fetch = fetchMock;
    render(<HomePage />);

    await user.click(screen.getByRole('tab', { name: 'Get a quote' }));
    await user.type(screen.getByLabelText('Name'), 'Test');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByLabelText('Project type'), 'Web App');
    await user.type(screen.getByLabelText('What do you need?'), 'A site');
    await user.click(screen.getByRole('button', { name: 'Request quote' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/quote');
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Test',
      email: 'test@example.com',
      projectType: 'Web App',
      budget: '',
      timeline: '',
      details: 'A site',
    });
  });
});
