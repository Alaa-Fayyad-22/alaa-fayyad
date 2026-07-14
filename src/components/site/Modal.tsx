import { useEffect, useRef, useState, useCallback, type ReactNode, type KeyboardEvent, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  isRTL: boolean;
  closeLabel: string;
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Reusable accessible dialog: role=dialog + aria-modal, focus trapped on
 * Tab/Shift+Tab, closes on X / overlay click / Escape, restores focus to the
 * trigger, and locks background scroll (including Lenis) while open.
 *
 * Layout contract: .modal-panel is a non-scrolling clip container that owns the
 * radius; .modal-head is fixed; only .modal-scroll scrolls, so its scrollbar
 * stays inside the panel's rounded edge instead of spilling onto the backdrop.
 */
export default function Modal({ open, onClose, title, titleId, isRTL, closeLabel, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Overlay click must only close when the gesture both started and ended on the
  // overlay — otherwise a text selection dragged out of the panel closes it.
  const downOnOverlay = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Remember the trigger, move focus into the dialog, restore focus on close.
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => triggerRef.current?.focus?.();
  }, [open]);

  // Background scroll lock. Lenis drives the page scroll, so body overflow alone
  // is not enough — it has to be stopped explicitly.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop?: () => void; start?: () => void } }).__lenis;
    lenis?.stop?.();

    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingInlineEnd;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingInlineEnd = prevPad;
      lenis?.start?.();
    };
  }, [open]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !panelRef.current) return;

    const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  const onOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    downOnOverlay.current = e.target === e.currentTarget;
  };
  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (downOnOverlay.current && e.target === e.currentTarget) onClose();
    downOnOverlay.current = false;
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={onOverlayMouseDown}
      onClick={onOverlayClick}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <header className="modal-head">
          <h2 id={titleId} className="modal-title">{title}</h2>
          <button ref={closeRef} type="button" className="modal-x" onClick={onClose} aria-label={closeLabel}>
            <X size={18} />
          </button>
        </header>

        {/* data-lenis-prevent: Lenis's wheel handler stays attached after
            lenis.stop() and calls preventDefault() on every wheel event while
            stopped (lenis.mjs: `if (this.isStopped || this.isLocked) { ...
            preventDefault() }`), which kills wheel/trackpad scrolling in here.
            Its data-lenis-prevent check runs earlier in the same handler and
            returns first, so the event survives and scrolls this region
            natively. stop() still handles the background lock. */}
        <div className="modal-scroll" tabIndex={0} data-lenis-prevent>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
