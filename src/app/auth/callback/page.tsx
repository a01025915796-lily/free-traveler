"use client";

import type { EmailOtpType } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/*
 * Technical route for Supabase e-mail links (sign-up confirmation, password reset).
 * A Client Component page — not a Route Handler (no route.ts / API). The browser client
 * confirms the session, then router.replace() moves on so the one-time token leaves the URL
 * and browser history. Tokens are never logged.
 */

const PROFILE_PATH = "/account?tab=profile";
const RESET_PATH = "/account?tab=login&mode=reset";
const ERROR_PATH = "/account?tab=login&error=link";

const OTP_TYPES: readonly EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change", "email"];

function isOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (OTP_TYPES as readonly string[]).includes(value);
}

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = params.get("code");
    const tokenHash = params.get("token_hash");
    const type = params.get("type");
    const hasError = params.has("error") || params.has("error_code") || window.location.hash.includes("error=");
    const isRecovery = type === "recovery";

    const finish = (ok: boolean) => router.replace(ok ? (isRecovery ? RESET_PATH : PROFILE_PATH) : ERROR_PATH);

    if (hasError) {
      finish(false);
      return;
    }

    void (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        // The browser client may already have exchanged a PKCE code on init.
        const { data: current } = await supabase.auth.getSession();
        if (current.session) return finish(true);

        if (tokenHash && isOtpType(type)) {
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
          return finish(!error);
        }
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          return finish(!error);
        }
        finish(false);
      } catch {
        finish(false);
      }
    })();
  }, [params, router]);

  return null;
}

function Spinner() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" className="animate-spin text-muted motion-reduce:animate-none">
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M16 3a13 13 0 0 1 13 13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function AuthCallbackPage() {
  return (
    <section className="mx-auto flex max-w-content flex-col items-center px-page-x py-section-mobile text-center md:py-section">
      <Spinner />
      <h1 className="mt-4 text-title-md" role="status" aria-live="polite">
        계정을 확인하고 있어요
      </h1>
      <p className="mt-2 text-body-sm text-muted">잠시만 기다려 주세요. 확인이 끝나면 계정 화면으로 이동합니다.</p>
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </section>
  );
}
