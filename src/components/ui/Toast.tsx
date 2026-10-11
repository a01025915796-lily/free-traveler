"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SemanticIcon, type SemanticTone } from "./Alert";

const DURATION_MS = 4000;

type ToastMessage = { id: number; text: string; tone: SemanticTone };
type ShowToast = (text: string, tone?: SemanticTone) => void;

const ToastContext = createContext<ShowToast | null>(null);

/**
 * Screen notification for action results (used instead of e-mail). Mount once in the
 * root layout; call useToast()("저장했어요") from client components.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  const show = useCallback<ShowToast>((text, tone = "neutral") => {
    if (timer.current) clearTimeout(timer.current);
    seq.current += 1;
    setMessage({ id: seq.current, text, tone });
    timer.current = setTimeout(() => setMessage(null), DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* The live region is always present so screen readers announce new text. */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-0 pb-0 md:bottom-6 md:px-4"
      >
        {message ? (
          <div
            key={message.id}
            className="pointer-events-auto flex w-full items-center gap-2 bg-ink px-5 py-4 text-body-sm text-white shadow-raised md:w-auto md:max-w-modal md:rounded-control"
          >
            <SemanticIcon tone={message.tone} size={18} />
            <span>{message.text}</span>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}
