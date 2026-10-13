"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StepGuide } from "@/components/ui/StepGuide";
import { getSessionState, loginHref, type SessionState } from "@/lib/auth/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const JOIN_STEPS = [
  { title: "가입", description: "이메일과 비밀번호로 계정을 만들어요." },
  { title: "이메일 인증", description: "받은 메일의 링크를 눌러 인증해요." },
  { title: "성인 확인", description: "만 19세 이상인지 확인하면 글을 쓸 수 있어요." },
] as const;

function GateCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-hairline bg-white p-6 md:p-8">
      <h3 className="text-title-md text-ink">{title}</h3>
      <p className="mt-2 text-body-md text-body">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/**
 * Mate tab permission gate. Guests see the login card, members without the adult check see
 * the adult-check card, eligible members see the form (children receives the user id).
 * Screen hiding is secondary — RLS rejects writes without a session or adult check anyway.
 */
export function MateAuthGate({ children }: { children: (userId: string) => ReactNode }) {
  const [state, setState] = useState<SessionState | "loading" | "error">("loading");

  useEffect(() => {
    let active = true;
    getSessionState(getSupabaseBrowserClient())
      .then((s) => {
        if (active) setState(s);
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full" count={4} label="로그인 상태를 확인하는 중" />
      </div>
    );
  }

  if (state === "error" || state.status === "guest") {
    return (
      <GateCard title="동행글은 로그인한 뒤 쓸 수 있어요" description="가입하고 이메일 인증과 만 19세 이상 확인을 마치면 바로 글을 올릴 수 있습니다.">
        <StepGuide steps={JOIN_STEPS} label="동행글 쓰기 준비 3단계" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={loginHref("/travel-tools?tab=mate")}>로그인하기</Button>
          <Button href="/mates" variant="secondary">
            동행글 먼저 둘러보기
          </Button>
        </div>
      </GateCard>
    );
  }

  if (state.profile === null || !state.profile.is_adult) {
    return (
      <GateCard title="만 19세 이상 확인이 필요해요" description="생년월일은 받지 않고, 만 19세 이상인지 확인한 사실과 시각만 저장합니다.">
        <Button href="/account?tab=profile">성인 확인하러 가기</Button>
      </GateCard>
    );
  }

  return <>{children(state.userId)}</>;
}
