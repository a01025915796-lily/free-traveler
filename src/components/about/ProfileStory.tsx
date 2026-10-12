import { CURATOR } from "@/data/curator";

/**
 * Section 3: about (4:8, sticky title on desktop). Three paragraphs:
 * ① the confirmed introduction (PRD 6-2, full text) ② why the travels started ③ philosophy and
 * editorial principle (PRD 6-1).
 */
export function ProfileStory() {
  return (
    <section aria-labelledby="about-story-title" className="bg-white">
      <div className="mx-auto grid max-w-content gap-8 px-page-x py-section-mobile md:grid-cols-12 md:gap-6 md:py-section">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-24">
            <h2 id="about-story-title" className="text-title-lg text-ink">
              free_traveler는 이런 여행을 합니다
            </h2>
            <p className="mt-3 text-body-md text-body">자기소개와 여행을 시작한 이유, 여행지를 고르는 원칙입니다.</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 md:col-span-8">
          <article>
            <h3 className="text-title-sm text-ink">소개</h3>
            <p className="mt-2 text-body-md text-body">{CURATOR.introduction}</p>
          </article>
          <article>
            <h3 className="text-title-sm text-ink">여행을 시작한 이유</h3>
            <p className="mt-2 text-body-md text-body">{CURATOR.whyTravel}</p>
          </article>
          <article>
            <h3 className="text-title-sm text-ink">여행 철학과 편집 원칙</h3>
            <blockquote className="mt-3 border-l-2 border-ink pl-4 text-title-sm text-ink">“{CURATOR.profile.philosophy}”</blockquote>
            <dl className="mt-4 grid gap-3 text-body-md text-body sm:grid-cols-2">
              <div>
                <dt className="text-caption text-muted">콘텐츠 원칙</dt>
                <dd>{CURATOR.profile.editorialPrinciple}</dd>
              </div>
              <div>
                <dt className="text-caption text-muted">전문 영역</dt>
                <dd>{CURATOR.profile.expertise}</dd>
              </div>
              <div>
                <dt className="text-caption text-muted">여행 권역</dt>
                <dd>{CURATOR.profile.regions}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
