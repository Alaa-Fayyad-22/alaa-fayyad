/**
 * Pure tab/open-file state for the workspace shell. Kept framework-free so the
 * open / close / reorder / keyboard-nav transitions can be unit-tested in
 * isolation (see __tests__/workspace.test.tsx).
 *
 * - `openTabs` is the file ids that currently have a tab, in visual (tab) order.
 *   Drag-to-reorder and arrow-key nav both respect this order.
 * - `activeId` is the one file-pane shown, or null for the empty state.
 * - `mru` is every open id ordered most-recently-active last. Closing the active
 *   tab focuses the most-recently-active tab that is still open.
 */
export type WorkspaceState = {
  openTabs: string[];
  activeId: string | null;
  mru: string[];
};

export type WorkspaceAction =
  | { type: 'open'; id: string }
  | { type: 'activate'; id: string }
  | { type: 'close'; id: string }
  | { type: 'reorder'; id: string; targetId: string; before: boolean }
  | { type: 'step'; delta: number };

export function initWorkspace(ids: string[]): WorkspaceState {
  return {
    openTabs: [...ids],
    activeId: ids[0] ?? null,
    mru: [...ids],
  };
}

/** Move `id` immediately before/after `targetId` within `order`. */
export function moveInOrder(
  order: string[],
  id: string,
  targetId: string,
  before: boolean,
): string[] {
  if (id === targetId || !order.includes(id) || !order.includes(targetId)) return order;
  const without = order.filter((x) => x !== id);
  const at = without.indexOf(targetId);
  const insertAt = before ? at : at + 1;
  return [...without.slice(0, insertAt), id, ...without.slice(insertAt)];
}

/** Push `id` to the end of `mru` (most-recent), removing any earlier entry. */
function bumpMru(mru: string[], id: string): string[] {
  return [...mru.filter((x) => x !== id), id];
}

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case 'open': {
      const isOpen = state.openTabs.includes(action.id);
      return {
        openTabs: isOpen ? state.openTabs : [...state.openTabs, action.id],
        activeId: action.id,
        mru: bumpMru(state.mru, action.id),
      };
    }

    case 'activate': {
      if (!state.openTabs.includes(action.id)) return state;
      if (state.activeId === action.id) return state;
      return { ...state, activeId: action.id, mru: bumpMru(state.mru, action.id) };
    }

    case 'close': {
      if (!state.openTabs.includes(action.id)) return state;
      const openTabs = state.openTabs.filter((x) => x !== action.id);
      const mru = state.mru.filter((x) => x !== action.id);
      let activeId = state.activeId;
      if (activeId === action.id) {
        // most-recently-active tab that is still open, else nothing
        activeId = [...mru].reverse().find((x) => openTabs.includes(x)) ?? null;
      }
      return { openTabs, activeId, mru };
    }

    case 'reorder': {
      return {
        ...state,
        openTabs: moveInOrder(state.openTabs, action.id, action.targetId, action.before),
      };
    }

    case 'step': {
      if (state.activeId === null || state.openTabs.length === 0) return state;
      const pos = state.openTabs.indexOf(state.activeId);
      const next = pos + action.delta;
      if (next < 0 || next >= state.openTabs.length) return state;
      const id = state.openTabs[next];
      return { ...state, activeId: id, mru: bumpMru(state.mru, id) };
    }

    default:
      return state;
  }
}
