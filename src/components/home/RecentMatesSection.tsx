"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MateCard } from "@/components/mates/MateCard";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StepGuide } from "@/components/ui/StepGuide";
import { listRecentMatePosts, type MatePostWithOwner } from "@/lib/db/mates";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; posts: MatePostWithOwner[] };

const STEPS = [
  { title: "글 쓰기", description: "국가·기간·여행 스타일을 적어 동행을 모집해요." },
  { title: "요청 받기", description: "조건이 맞는 회원이 메시지와 함께 참가를 요청해요." },
  { title: "승인하기", description: "프로필을 보고 승인한 뒤에 대화를 이어 가요." },
] as const;

async function loadPosts(): Promise<State> {
  try {
    const result = await listRecentMatePosts(getSupabaseBrowserClient(), 3);
    return result.ok ? { status: "ready", posts: result.data } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}

/**
 * Section 6: latest 3 recruiting mate posts (public Supabase read under RLS).
 * Loading → Skeleton ×3 (hidden for the first 300ms), error → danger Alert + retry, only this
 * section is affected; empty → Empty State with the 3 steps.
 */
export function RecentMatesSection() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    loadPosts().then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, []);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    loadPosts().then(setState);
  }, []);

  return (
    <section aria-labelledby="home-mates-title" className="bg-surface-soft">
      <div className="mx-auto max-w-content px-page-x py-section-mobile md:py-section">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="home-mates-title" className="text-title-lg text-ink">
              함께 떠날 동행을 찾고 있나요?
            </h2>
            <p className="mt-3 max-w-(--container-prose) text-body-md text-body">
              연락처를 공개하지 않고 참가 요청과 승인으로 연결됩니다. 만 19세 이상 회원만 글을 쓰고 요청할 수 있어요.
            </p>
          </div>
          <Link href="/mates" className="inline-flex min-h-11 shrink-0 items-center text-button text-ink underline underline-offset-4">
            동행글 모두 보기
          </Link>
        </div>

        <div className="mt-8" aria-busy={state.status === "loading"}>
          {state.status === "loading" ? (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              <Skeleton className="h-48 w-full" count={3} label="최근 동행글을 불러오는 중" />
            </div>
          ) : state.status === "error" ? (
            <Alert
              tone="danger"
              role="alert"
              title="동행글을 불러오지 못했어요"
              action={
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="secondary" onClick={retry}>
                    다시 시도
                  </Button>
                  <Button href="/mates" variant="tertiary">
                    동행 찾기로 이동
                  </Button>
                </div>
              }
            >
              잠시 후 다시 시도해 주세요. 다른 내용은 그대로 볼 수 있어요.
            </Alert>
          ) : state.posts.length === 0 ? (
            <EmptyState
              title="아직 모집 중인 동행글이 없어요"
              description="첫 동행글을 올려 보세요. 국가·지역·기간과 여행 스타일을 적으면 조건이 맞는 회원이 참가를 요청합니다."
              primary={{ label: "동행글 쓰기", href: "/travel-tools?tab=mate" }}
              secondary={{ label: "동행 찾기 둘러보기", href: "/mates" }}
            >
              <StepGuide steps={STEPS} label="동행 3단계" className="text-left" />
            </EmptyState>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {state.posts.map((post) => (
                <li key={post.id}>
                  <MateCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {state.status === "ready" && state.posts.length > 0 ? (
          <div className="mt-8">
            <Button href="/travel-tools?tab=mate">동행글 쓰기</Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
