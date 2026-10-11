"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { Modal } from "@/components/ui/Modal";
import { POLICIES, POLICY_IDS, isPolicyId, type PolicyId } from "@/data/policies";

/*
 * The open policy is kept in the URL (?policy=<id>) so a dialog can be linked and the
 * browser Back button closes it. Native history is used so this works from the root
 * layout without useSearchParams (no Suspense boundary needed around the footer).
 */
const CHANGE_EVENT = "ft:policychange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readPolicy(): PolicyId | null {
  const value = new URLSearchParams(window.location.search).get("policy");
  return isPolicyId(value) ? value : null;
}

function writePolicy(id: PolicyId | null, mode: "push" | "replace") {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("policy", id);
  else url.searchParams.delete("policy");
  if (mode === "push") window.history.pushState(window.history.state, "", url);
  else window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Current policy from the URL and open/close helpers (usable anywhere, e.g. "안전수칙 전문 보기"). */
export function usePolicyDialog() {
  const current = useSyncExternalStore(subscribe, readPolicy, () => null);
  const pushed = useRef(false);

  const open = useCallback((id: PolicyId) => {
    pushed.current = true;
    writePolicy(id, "push");
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      writePolicy(null, "replace");
    }
  }, []);

  return { current, open, close };
}

/** Renders the policy dialog for the policy currently in the URL. Mount once (root layout). */
export function PolicyDialog() {
  const { current, close } = usePolicyDialog();
  const doc = current ? POLICIES[current] : null;

  return (
    <Modal open={doc !== null} onClose={close} title={doc?.title ?? "정책 안내"} description={doc?.summary}>
      {doc ? (
        <div className="space-y-6">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="text-title-sm">{section.heading}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-body-md text-body">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
          <p className="text-caption text-muted">시행일 {doc.effectiveDate}</p>
        </div>
      ) : null}
    </Modal>
  );
}

/** Footer list of the four policy dialogs. */
export function PolicyLinks() {
  const { open } = usePolicyDialog();
  return (
    <>
      {POLICY_IDS.map((id) => (
        <li key={id}>
          <button
            type="button"
            onClick={() => open(id)}
            className="inline-flex min-h-11 items-center text-body-sm text-body underline-offset-4 hover:underline"
          >
            {POLICIES[id].title}
          </button>
        </li>
      ))}
    </>
  );
}
