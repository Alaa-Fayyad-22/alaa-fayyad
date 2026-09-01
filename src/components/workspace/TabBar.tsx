import { useState } from 'react';
import styles from './workspace.module.css';
import { cx } from './cx';
import type { WsFile } from './files';

type DragOver = { id: string; before: boolean } | null;

/**
 * The open tabs, in their current order. Tabs are:
 *  - clickable to activate,
 *  - closeable via the hover/active `×` and via middle-click,
 *  - draggable to reorder (native HTML5 DnD) with a left/right insertion bar.
 */
export default function TabBar({
  tabs,
  activeId,
  closeLabel,
  onActivate,
  onClose,
  onReorder,
}: {
  tabs: WsFile[];
  activeId: string | null;
  closeLabel: string;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
  onReorder: (id: string, targetId: string, before: boolean) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<DragOver>(null);

  const clear = () => {
    setDragId(null);
    setDragOver(null);
  };

  return (
    <div className={styles.tabbar} role="tablist">
      {tabs.map((f) => {
        const active = activeId === f.id;
        const over = dragOver?.id === f.id ? dragOver.before : null;
        return (
          <div
            key={f.id}
            id={`wtab-${f.id}`}
            role="tab"
            aria-selected={active}
            draggable
            className={cx(
              styles.tab,
              active && styles.tabActive,
              dragId === f.id && styles.tabDragging,
              over === true && styles.tabDragOverLeft,
              over === false && styles.tabDragOverRight,
            )}
            onClick={() => onActivate(f.id)}
            onAuxClick={(e) => {
              if (e.button === 1) {
                e.preventDefault();
                onClose(f.id);
              }
            }}
            onDragStart={(e) => {
              setDragId(f.id);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', f.id);
            }}
            onDragEnd={clear}
            onDragOver={(e) => {
              e.preventDefault();
              if (!dragId || dragId === f.id) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const before = e.clientX - rect.left < rect.width / 2;
              setDragOver({ id: f.id, before });
            }}
            onDragLeave={() => setDragOver((d) => (d?.id === f.id ? null : d))}
            onDrop={(e) => {
              e.preventDefault();
              const src = dragId ?? e.dataTransfer.getData('text/plain');
              if (src && src !== f.id) {
                const rect = e.currentTarget.getBoundingClientRect();
                const before = e.clientX - rect.left < rect.width / 2;
                onReorder(src, f.id, before);
              }
              clear();
            }}
          >
            {f.name}
            <button
              type="button"
              className={styles.tabClose}
              aria-label={`${closeLabel} — ${f.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose(f.id);
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
