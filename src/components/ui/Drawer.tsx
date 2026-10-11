"use client";

import { useId, type ReactNode } from "react";
import { DialogCloseButton, useDialog } from "./Modal";

type DrawerProps = {
  open: boolean;
  /** Called on Esc, backdrop click and the close button. Tie to a URL query to close with Back. */
  onClose: () => void;
  title: string;
  /** Header actions next to the close button (e.g. a share IconButton). */
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Right-side drawer: 640px on desktop, 560px on tablet, full-screen sheet on mobile.
 * Header (title + actions + close) stays fixed while the body scrolls. Opens as an overlay
 * so page content does not shift (CLS).
 */
export function Drawer({ open, onClose, title, actions, children }: DrawerProps) {
  const { dialogRef, titleRef } = useDialog(open, onClose);
  const titleId = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 ml-auto h-dvh max-h-none w-full max-w-none bg-white p-0 text-ink transition-transform duration-200 backdrop:bg-scrim starting:open:translate-x-full md:max-w-drawer-tablet xl:max-w-drawer"
    >
      {open ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-hairline px-5 py-3 md:px-6">
            <h2 id={titleId} ref={titleRef} tabIndex={-1} className="min-w-0 flex-1 text-title-md outline-offset-4">
              {title}
            </h2>
            <div className="flex shrink-0 items-center gap-1">
              {actions}
              <DialogCloseButton onClick={onClose} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-6">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
