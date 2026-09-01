import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  initWorkspace,
  workspaceReducer,
  moveInOrder,
  type WorkspaceState,
} from '../src/components/workspace/state';
import WorkspaceShell from '../src/components/workspace/WorkspaceShell';

// next/link → plain anchor (no router in unit tests).
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}));

// matchMedia (prefers-reduced-motion) is shimmed globally in jest.setup.js.

// Default locale = English; individual tests opt into Arabic.
function mockLang(value: 'en' | 'ar') {
  Object.defineProperty(window, 'localStorage', {
    value: { getItem: jest.fn(() => value), setItem: jest.fn() },
    writable: true,
  });
}
beforeEach(() => mockLang('en'));

const IDS = ['about', 'skills', 'projects', 'experience', 'contact'];

/* ────────────────────────────── reducer ────────────────────────────── */

describe('workspaceReducer', () => {
  const start = (): WorkspaceState => initWorkspace(['a', 'b', 'c']);

  it('starts with every tab open and the first active', () => {
    expect(start()).toEqual({
      openTabs: ['a', 'b', 'c'],
      activeId: 'a',
      mru: ['a', 'b', 'c'],
    });
  });

  it('activate() switches the visible pane and bumps the MRU', () => {
    const s = workspaceReducer(start(), { type: 'activate', id: 'b' });
    expect(s.activeId).toBe('b');
    expect(s.mru).toEqual(['a', 'c', 'b']);
  });

  it('activate() on a closed tab is a no-op', () => {
    const closed = workspaceReducer(start(), { type: 'close', id: 'b' });
    expect(workspaceReducer(closed, { type: 'activate', id: 'b' })).toBe(closed);
  });

  it('close() on the active tab focuses the most-recently-active open tab', () => {
    // visit b, then c → mru tail is [a, b, c]; close c → focus b
    let s = start();
    s = workspaceReducer(s, { type: 'activate', id: 'b' });
    s = workspaceReducer(s, { type: 'activate', id: 'c' });
    s = workspaceReducer(s, { type: 'close', id: 'c' });
    expect(s.openTabs).toEqual(['a', 'b']);
    expect(s.activeId).toBe('b');
  });

  it('close() on a non-active tab leaves the active one alone', () => {
    const s = workspaceReducer(start(), { type: 'close', id: 'c' });
    expect(s.activeId).toBe('a');
    expect(s.openTabs).toEqual(['a', 'b']);
  });

  it('closing the last tab drops to the empty state', () => {
    let s = start();
    for (const id of ['a', 'b', 'c']) s = workspaceReducer(s, { type: 'close', id });
    expect(s.openTabs).toEqual([]);
    expect(s.activeId).toBeNull();
  });

  it('open() re-adds a closed tab at the end and activates it', () => {
    let s = workspaceReducer(start(), { type: 'close', id: 'b' });
    s = workspaceReducer(s, { type: 'open', id: 'b' });
    expect(s.openTabs).toEqual(['a', 'c', 'b']);
    expect(s.activeId).toBe('b');
  });

  it('step() walks the current tab order and stops at the ends', () => {
    let s = start(); // active a
    s = workspaceReducer(s, { type: 'step', delta: 1 });
    expect(s.activeId).toBe('b');
    s = workspaceReducer(s, { type: 'step', delta: -1 });
    expect(s.activeId).toBe('a');
    s = workspaceReducer(s, { type: 'step', delta: -1 });
    expect(s.activeId).toBe('a'); // clamped
  });

  it('step() follows a reordered tab order', () => {
    let s = start();
    s = workspaceReducer(s, { type: 'reorder', id: 'c', targetId: 'a', before: true });
    expect(s.openTabs).toEqual(['c', 'a', 'b']);
    // active is still 'a' (index 1) → step +1 → 'b'
    s = workspaceReducer(s, { type: 'step', delta: 1 });
    expect(s.activeId).toBe('b');
  });

  it('moveInOrder places before / after the target', () => {
    expect(moveInOrder(['a', 'b', 'c'], 'a', 'c', false)).toEqual(['b', 'c', 'a']);
    expect(moveInOrder(['a', 'b', 'c'], 'c', 'a', true)).toEqual(['c', 'a', 'b']);
    expect(moveInOrder(['a', 'b', 'c'], 'a', 'a', true)).toEqual(['a', 'b', 'c']);
  });
});

/* ────────────────────────── shell integration ─────────────────────── */

const fileTabs = () => screen.queryAllByRole('tab');
const tab = (name: RegExp) => screen.getByRole('tab', { name });
const closeBtn = (name: RegExp) => screen.getByRole('button', { name });

describe('WorkspaceShell', () => {
  it('opens one tab per file with the first active', () => {
    render(<WorkspaceShell />);
    expect(fileTabs()).toHaveLength(IDS.length);
    expect(tab(/about\.tsx/)).toHaveAttribute('aria-selected', 'true');
  });

  it('closes a tab via its × and dims the sidebar entry', async () => {
    const user = userEvent.setup();
    render(<WorkspaceShell />);

    await user.click(closeBtn(/Close tab.*about\.tsx/));

    expect(fileTabs()).toHaveLength(IDS.length - 1);
    expect(screen.queryByRole('tab', { name: /about\.tsx/ })).not.toBeInTheDocument();
    // the sidebar button for the file is still there, now marked closed
    expect(screen.getByRole('button', { name: /about\.tsx/ })).toHaveAttribute(
      'data-closed',
      'true',
    );
  });

  it('closing the active tab focuses another open tab', async () => {
    const user = userEvent.setup();
    render(<WorkspaceShell />);

    await user.click(closeBtn(/Close tab.*about\.tsx/));

    expect(screen.queryByText('No file open')).not.toBeInTheDocument();
    expect(tab(/contact\.ts/)).toHaveAttribute('aria-selected', 'true');
  });

  it('closing every tab shows the empty state', async () => {
    const user = userEvent.setup();
    render(<WorkspaceShell />);

    for (const name of [/about\.tsx/, /skills\.json/, /index\.tsx/, /experience\.log/, /contact\.ts/]) {
      await user.click(screen.getByRole('button', { name: new RegExp(`Close tab.*${name.source}`) }));
    }

    expect(fileTabs()).toHaveLength(0);
    expect(screen.getByText('No file open')).toBeInTheDocument();
  });

  it('reopens a closed file from the sidebar', async () => {
    const user = userEvent.setup();
    render(<WorkspaceShell />);

    await user.click(closeBtn(/Close tab.*skills\.json/));
    expect(screen.queryByRole('tab', { name: /skills\.json/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /skills\.json/ }));
    expect(tab(/skills\.json/)).toHaveAttribute('aria-selected', 'true');
  });

  it('moves between open tabs with the arrow keys, in order', () => {
    render(<WorkspaceShell />);
    expect(tab(/about\.tsx/)).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(tab(/skills\.json/)).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(tab(/index\.tsx/)).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(tab(/skills\.json/)).toHaveAttribute('aria-selected', 'true');
  });

  it('switches to a file when its minimap entry is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkspaceShell />);

    const minimap = screen.getByTestId('workspace-minimap');
    await user.click(within(minimap).getByText('experience.log').closest('button')!);

    expect(tab(/experience\.log/)).toHaveAttribute('aria-selected', 'true');
  });
});

/* ─────────────────────────────── RTL ──────────────────────────────── */

describe('WorkspaceShell — RTL', () => {
  it('renders right-to-left with Arabic chrome when the locale is Arabic', () => {
    mockLang('ar');
    const { container } = render(<WorkspaceShell />);

    expect(container.querySelector('div[dir="rtl"]')).toBeInTheDocument();
    // Arabic explorer label from messages/ar.json
    expect(screen.getByText('المستكشف')).toBeInTheDocument();
    // filenames are not translated
    expect(tab(/about\.tsx/)).toBeInTheDocument();
  });

  it('flips back to LTR for English', () => {
    mockLang('en');
    const { container } = render(<WorkspaceShell />);
    expect(container.querySelector('div[dir="ltr"]')).toBeInTheDocument();
  });
});
