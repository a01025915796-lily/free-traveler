"use client";

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";

function CloseIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  );
}

/**
 * Shared dialog behaviour for Modal and Drawer, built on the native <dialog> element:
 * - showModal() makes the rest of the page inert (focus is trapped inside) and shows ::backdrop.
 * - On open, focus moves to the title. Esc and backdrop clicks call onClose (controlled).
 * - On close, focus returns to the element that opened the dialog.
 * Callers control `open`, so the state can be tied to a URL query (back button closes).
 */
export function useDialog(open: boolean, onClose: () => void): {
  dialogRef: RefObject<HTMLDialogElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
} {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      titleRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      openerRef.current?.focus();
      openerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      onCloseRef.current();
    };
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) onCloseRef.current();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onClick);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return { dialogRef, titleRef };
}

/** 44px close button used in dialog headers. */
export function DialogCloseButton({ onClick, label = "닫기" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-ink hover:bg-surface-soft"
    >
      <CloseIcon />
    </button>
  );
}

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional short description under the title (linked with aria-describedby). */
  description?: string;
  children: ReactNode;
  /** Footer actions (e.g. confirm / cancel buttons). Replaces browser confirm(). */
  actions?: ReactNode;
};

/** Centered modal, max width 560px. Used for policy documents, reports and confirmations. */
export function Modal({ open, onClose, title, description, children, actions }: ModalProps) {
  const { dialogRef, titleRef } = useDialog(open, onClose);
  const titleId = useId();
  const descId = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-modal overflow-hidden rounded-card bg-white p-0 text-ink shadow-raised backdrop:bg-scrim"
    >
      {open ? (
        <div className="flex max-h-[calc(100dvh-32px)] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-4">
            <div>
              <h2 id={titleId} ref={titleRef} tabIndex={-1} className="text-title-md outline-offset-4">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="mt-1 text-body-sm text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            <DialogCloseButton onClick={onClose} />
          </div>
          <div className="overflow-y-auto px-6 py-5 text-body-md">{children}</div>
          {actions ? (
            <div className="flex flex-col-reverse gap-3 border-t border-hairline px-6 py-4 sm:flex-row sm:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
