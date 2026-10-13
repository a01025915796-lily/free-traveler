/*
 * Public contact detection for mate posts and join requests (REQ-FUNC-032).
 * Contacts must not be posted publicly; they are exchanged only after a request is accepted.
 * Checked in the browser before submit; the matches tell the user what to remove.
 * Pure function — the text is not stored or logged.
 */

export type ContactKind = "phone" | "email" | "messenger" | "link";

export type ContactMatch = { kind: ContactKind; start: number; end: number; text: string };

export const CONTACT_KIND_LABEL: Record<ContactKind, string> = {
  phone: "전화번호",
  email: "이메일 주소",
  messenger: "메신저 아이디",
  link: "메신저·SNS 링크",
};

const EMAIL = /[A-Za-z0-9._%+-]+\s*(?:@|＠|\(at\)|\[at\]|골뱅이)\s*[A-Za-z0-9-]+(?:\s*(?:\.|\(dot\)|\[dot\]|닷)\s*[A-Za-z0-9-]+)+/gi;

// Messenger / SNS links (open chat, t.me, instagram, line.me, wa.me, ...).
const LINK = /(?:https?:\/\/)?(?:open\.kakao\.com|pf\.kakao\.com|qr\.kakao\.com|t\.me|telegram\.me|(?:www\.)?instagram\.com|instagr\.am|line\.me|wa\.me|(?:www\.)?facebook\.com|m\.me)\/[^\s]*/gi;

// Messenger keyword followed by an ID-like token (e.g. "카톡 abc123", "카카오톡 아이디: hello_1", "인스타 @trip").
const MESSENGER =
  /(?:카카오\s*톡|카톡|카카오|오픈\s*채팅|오픈톡|kakao(?:\s*talk)?|katalk|텔레\s*그램|텔레|telegram|라인|line|인스타\s*그램|인스타|insta(?:gram)?|\big\b|위챗|wechat|왓츠앱|whatsapp|디엠|\bdm\b)\s*(?:아이디|id|계정|주소)?\s*[:：=]?\s*@?[A-Za-z][A-Za-z0-9._-]{2,}/gi;

// Stand-alone @handle (not part of an e-mail address).
const HANDLE = /(?<![A-Za-z0-9._%+-])@[A-Za-z0-9_][A-Za-z0-9._]{2,29}/g;

// Phone candidates: digits with optional separators. Validated below by digit count/prefix.
const PHONE_CANDIDATE = /(?:\+|＋)?\(?\d[\d\s().-]{7,}\d/g;

function digitsOf(text: string): string {
  return text.replace(/\D/g, "");
}

function looksLikePhone(candidate: string): boolean {
  const digits = digitsOf(candidate);
  const international = /^\s*[+＋]/.test(candidate);
  // Korean mobile/landline: 010-1234-5678, 02-123-4567, 0505..., 1588-1234 style is 8 digits (allowed below).
  if (/^01[016789]\d{7,8}$/.test(digits)) return true;
  if (/^0[2-6]\d{7,9}$/.test(digits)) return true;
  if (/^0(?:50|70|80)\d{8,9}$/.test(digits)) return true;
  // International: +82 10 1234 5678, +1 415 555 0100 ...
  if (international && digits.length >= 9 && digits.length <= 15) return true;
  // Dates (20261012, 2026-10-12) and money (300,000) are not phones: require a leading 0 for long local numbers.
  return false;
}

function collect(re: RegExp, kind: ContactKind, text: string, out: ContactMatch[], accept?: (s: string) => boolean) {
  re.lastIndex = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    const value = m[0].trim();
    if (value && (!accept || accept(value))) {
      const start = m.index + m[0].indexOf(value);
      out.push({ kind, start, end: start + value.length, text: value });
    }
    if (m[0].length === 0) re.lastIndex += 1;
  }
}

/** Finds contact information in text. Overlapping matches keep the earliest, longest one. */
export function detectContacts(text: string): ContactMatch[] {
  const normalized = text.normalize("NFKC");
  const found: ContactMatch[] = [];
  collect(LINK, "link", normalized, found);
  collect(EMAIL, "email", normalized, found);
  collect(MESSENGER, "messenger", normalized, found);
  collect(HANDLE, "messenger", normalized, found);
  collect(PHONE_CANDIDATE, "phone", normalized, found, looksLikePhone);

  found.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const result: ContactMatch[] = [];
  for (const match of found) {
    const last = result[result.length - 1];
    if (last && match.start < last.end) continue;
    result.push(match);
  }
  return result;
}

export function hasContact(text: string): boolean {
  return detectContacts(text).length > 0;
}

/** User-facing guidance listing what was found (values are not echoed back). */
export function contactGuidance(matches: readonly ContactMatch[]): string | null {
  if (matches.length === 0) return null;
  const kinds = [...new Set(matches.map((m) => CONTACT_KIND_LABEL[m.kind]))].join(", ");
  return `${kinds}처럼 보이는 내용이 있어요. 연락처는 참가 요청을 승인한 뒤에 주고받아 주세요. 해당 부분을 지우고 다시 올려 주세요.`;
}
