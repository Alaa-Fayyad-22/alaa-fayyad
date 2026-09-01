import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { logEvent } from '../../lib/track';
import styles from './workspace.module.css';
import { WS_FILES, WS_FILE_IDS } from './files';
import { workspaceReducer, initWorkspace } from './state';
import TitleBar from './TitleBar';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import FilePane from './FilePane';
import Minimap from './Minimap';
import StatusBar from './StatusBar';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

const isFormField = (el: Element | null) =>
  !!el &&
  (el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    (el as HTMLElement).isContentEditable);

/**
 * The IDE-workspace homepage: 36px titlebar / (sidebar · editor · minimap) /
 * 24px statusbar. One file-pane is visible at a time with a slide transition;
 * tabs open/close/reorder; the sidebar, tabs and minimap all mirror in RTL.
 */
export default function WorkspaceShell() {
  const { t, isRTL, locale, toggleLocale } = useTranslation();
  const reduced = useReducedMotion();
  const [state, dispatch] = useReducer(workspaceReducer, WS_FILE_IDS, initWorkspace);
  const { openTabs, activeId } = state;

  const byId = useMemo(
    () => Object.fromEntries(WS_FILES.map((f) => [f.id, f] as const)),
    [],
  );
  const openFiles = openTabs.map((id) => byId[id]).filter(Boolean);
  const activeFile = activeId ? byId[activeId] : null;

  // Pane that was just switched away from — animates out while the new one
  // animates in, then settles back to the hidden resting position.
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const prevActive = useRef<string | null>(activeId);
  useEffect(() => {
    const prev = prevActive.current;
    prevActive.current = activeId;
    if (prev && prev !== activeId && openTabs.includes(prev)) {
      setLeavingId(prev);
      const tid = setTimeout(() => setLeavingId(null), reduced ? 10 : 340);
      return () => clearTimeout(tid);
    }
  }, [activeId, openTabs, reduced]);

  // Arrow keys move between open tabs in their current order (not while typing
  // in the contact form).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (isFormField(document.activeElement)) return;
      dispatch({ type: 'step', delta: e.key === 'ArrowRight' ? 1 : -1 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The shell owns the whole viewport; keep the page from scrolling behind it.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const open = (id: string) => dispatch({ type: 'open', id });
  const activate = (id: string) => dispatch({ type: 'activate', id });
  const close = (id: string) => dispatch({ type: 'close', id });
  const reorder = (id: string, targetId: string, before: boolean) =>
    dispatch({ type: 'reorder', id, targetId, before });

  const onToggleLocale = () => {
    logEvent('toggle', { control: 'language', value: locale === 'en' ? 'ar' : 'en' });
    toggleLocale();
  };

  return (
    <div className={styles.app} dir={isRTL ? 'rtl' : 'ltr'}>
      <TitleBar path={t.workspace.titlebarPath} problems={t.workspace.noProblems} />

      <div className={styles.mainGrid}>
        <Sidebar
          files={WS_FILES}
          openIds={openTabs}
          activeId={activeId}
          onOpen={open}
          explorerLabel={t.workspace.explorerLabel}
          classicItemLabel={t.workspace.classicItem}
        />

        <div className={styles.editorArea}>
          {openTabs.length > 0 && (
            <TabBar
              tabs={openFiles}
              activeId={activeId}
              closeLabel={t.workspace.closeTab}
              onActivate={activate}
              onClose={close}
              onReorder={reorder}
            />
          )}

          <div className={styles.canvas}>
            {activeId === null && (
              <div className={styles.emptyState}>
                <div className={styles.emptyBig} aria-hidden="true">
                  ⌘
                </div>
                <div>{t.workspace.emptyTitle}</div>
                <div className={styles.emptyDim}>{t.workspace.emptyHint}</div>
              </div>
            )}

            {openFiles.map((f) => {
              const paneState =
                f.id === activeId ? 'visible' : f.id === leavingId ? 'leaving' : 'hidden';
              const Body = f.Component;
              return (
                <FilePane key={f.id} state={paneState} labelledBy={`wtab-${f.id}`}>
                  <Body />
                </FilePane>
              );
            })}
          </div>
        </div>

        <Minimap files={WS_FILES} activeId={activeId} onOpen={open} />
      </div>

      <StatusBar
        activeName={activeFile?.name ?? null}
        language={activeFile?.language ?? '—'}
        indentLabel={t.workspace.indent}
        classicLabel={t.workspace.classicLinkLabel}
        localeToggleLabel={locale === 'en' ? 'عربي' : 'EN'}
        onToggleLocale={onToggleLocale}
      />
    </div>
  );
}
