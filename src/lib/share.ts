/*
 * Share a page URL (destination drawer, country safety drawer, mate post panel).
 * Uses the Web Share API when available; otherwise copies the URL to the clipboard.
 * The caller shows the Toast from the returned outcome. Only public URLs are shared —
 * never flight/hotel inputs (those are not in any URL).
 */

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

export const SHARE_MESSAGE: Record<Exclude<ShareOutcome, "cancelled">, string> = {
  shared: "공유했어요.",
  copied: "링크를 복사했어요. 원하는 곳에 붙여 넣어 주세요.",
  failed: "링크를 복사하지 못했어요. 주소창의 주소를 직접 복사해 주세요.",
};

type ShareEnv = {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
  writeText?: (text: string) => Promise<void>;
};

function browserEnv(): ShareEnv {
  if (typeof navigator === "undefined") return {};
  return {
    share: typeof navigator.share === "function" ? navigator.share.bind(navigator) : undefined,
    canShare: typeof navigator.canShare === "function" ? navigator.canShare.bind(navigator) : undefined,
    writeText: navigator.clipboard?.writeText ? navigator.clipboard.writeText.bind(navigator.clipboard) : undefined,
  };
}

/** Builds an absolute URL for a path like "/?dest=kyoto" on the current origin. */
export function absoluteUrl(path: string, origin: string = typeof window === "undefined" ? "" : window.location.origin): string {
  return new URL(path, origin || "http://localhost").toString();
}

export async function shareLink(data: { title: string; url: string; text?: string }, env: ShareEnv = browserEnv()): Promise<ShareOutcome> {
  const payload: ShareData = { title: data.title, url: data.url, text: data.text };
  if (env.share && (!env.canShare || env.canShare(payload))) {
    try {
      await env.share(payload);
      return "shared";
    } catch (error) {
      // The user closed the share sheet: do nothing.
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Otherwise fall back to copying.
    }
  }
  if (env.writeText) {
    try {
      await env.writeText(data.url);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}
