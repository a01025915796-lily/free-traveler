import type { ContentImage, CountryCode, HttpsUrl } from "@/types/content";

/*
 * free_traveler representative content (static data, no DB). Single source for the
 * `free_traveler`, `50+ Trips`, `30+ Countries` values used on SCR-001 and SCR-002.
 * Texts marked as drafts in docs/04_UIUX_PLAN.md §6.2 become final after the representative
 * confirms them (CURATOR_CONTENT_CONFIRMED). Photos: Wikimedia Commons Public domain / CC0 (DEC-018).
 */

export const CURATOR_CONTENT_CONFIRMED = false;

export const CURATOR_NAME = "free_traveler";
export const TRIPS_LABEL = "50+ Trips";
export const COUNTRIES_LABEL = "30+ Countries";

export type Stat = { value: string; label: string; description: string };
export type TimelineItem = { year: number; place: string; summary: string };
export type VisitedCountry = {
  nameKo: string;
  /** Set when the country has Free Traveler safety notes; the chip links to /?safety=<code>. */
  code?: Exclude<CountryCode, "KR">;
};
export type VisitedRegion = { region: string; countries: VisitedCountry[] };
export type GalleryPhoto = { place: string; image: ContentImage };
export type MemoryPlace = { slug: string; place: string; memory: string; image: ContentImage };
/** Only https: or mailto: links are allowed. Empty values are not rendered. */
export type ContactLink = { kind: "email" | "instagram" | "youtube" | "blog"; label: string; href: HttpsUrl | `mailto:${string}` | "" };

export const CURATOR = {
  name: CURATOR_NAME,
  headline: "내가 감당할 수 있는 속도로, 현지를 이해하는 여행",
  tagline:
    "free_traveler는 50번 넘는 자유여행으로 30개국 이상을 경험한 여행 큐레이터입니다. 많이 보는 여행보다 오래 기억에 남는 여행을 함께 설계합니다.",
  heroImage: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Person_hiking_on_trail_-_Lula_Lake_Land_Trust_%28Unsplash%29.jpg/1920px-Person_hiking_on_trail_-_Lula_Lake_Land_Trust_%28Unsplash%29.jpg",
    alt: "배낭을 멘 여행자가 뒷모습으로 숲속 오솔길을 걸어가는 모습",
  } satisfies ContentImage,
  /** PRD 6-1 */
  profile: {
    regions: "아시아, 유럽, 북미, 오세아니아 중심",
    expertise: "첫 자유여행 설계, 도시 간 이동, 일정 밀도 조절, 예산과 안전의 균형",
    philosophy: "좋은 여행은 많이 보는 여행이 아니라, 내가 감당할 수 있는 속도로 현지를 이해하는 여행이다.",
    editorialPrinciple: "직접 이해한 정보와 공식 출처를 구분하고, 변동 가능한 정보에는 확인일을 표시한다.",
  },
  /** PRD 6-2, full text (do not shorten). */
  introduction:
    "free_traveler는 50회 이상의 자유여행으로 30개국 이상을 경험한 여행 큐레이터다. 유명 명소만 나열하기보다 이동 동선, 머무는 시간, 여행자의 체력, 안전정보까지 함께 살피는 여행을 지향한다. 처음 해외여행을 준비하는 사람도 목적지와 일정을 스스로 결정할 수 있도록 여행지의 장점뿐 아니라 불편한 점과 주의할 점을 함께 소개한다.",
  whyTravel:
    "처음 혼자 떠난 도쿄에서 지하철 노선도 한 장에 의지해 사흘을 보냈습니다. 길을 잃을 때마다 계획보다 현지 사람들의 속도를 따라가는 편이 더 많은 것을 보여 준다는 사실을 배웠고, 그 경험이 지금까지 여행을 이어 온 이유가 되었습니다.",
} as const;

export const STATS: readonly Stat[] = [
  { value: TRIPS_LABEL, label: "자유여행 횟수", description: "혼자, 또 함께 떠난 자유여행만 셌습니다." },
  { value: COUNTRIES_LABEL, label: "방문 국가", description: "아시아부터 오세아니아까지 다녀온 나라입니다." },
  { value: "4개 권역", label: "여행 권역", description: "아시아·유럽·북미·오세아니아를 다녔습니다." },
  { value: "40곳", label: "소개한 여행지", description: "Free Traveler에 정리한 국내외 여행지입니다." },
];

export const TIMELINE: readonly TimelineItem[] = [
  { year: 2012, place: "일본 도쿄", summary: "첫 자유여행. 노선도 한 장으로 혼자 길을 찾는 법을 배웠습니다." },
  { year: 2014, place: "태국 치앙마이", summary: "한 도시에 2주 머물며 '오래 머무는 여행'을 처음 시도했습니다." },
  { year: 2016, place: "프랑스·이탈리아", summary: "첫 유럽 여행. 도시 간 열차 이동과 일정 밀도를 설계하기 시작했습니다." },
  { year: 2018, place: "미국 뉴욕·샌프란시스코", summary: "장거리 비행과 시차를 고려한 일정 짜는 법을 정리했습니다." },
  { year: 2020, place: "제주·강릉·통영", summary: "해외 대신 국내를 깊게 다니며 국내 여행지 기록을 쌓았습니다." },
  { year: 2023, place: "뉴질랜드 퀸스타운", summary: "날씨와 체력에 맞춰 일정을 바꾸는 여유의 중요성을 다시 배웠습니다." },
  { year: 2025, place: "스페인 바르셀로나", summary: "50번째 자유여행이자 서른 번째 나라를 넘긴 여행이었습니다." },
];

export const VISITED_REGIONS: readonly VisitedRegion[] = [
  {
    region: "아시아",
    countries: [
      { nameKo: "일본", code: "JP" },
      { nameKo: "대만", code: "TW" },
      { nameKo: "태국", code: "TH" },
      { nameKo: "베트남", code: "VN" },
      { nameKo: "싱가포르", code: "SG" },
      { nameKo: "인도네시아", code: "ID" },
      { nameKo: "필리핀", code: "PH" },
      { nameKo: "말레이시아", code: "MY" },
      { nameKo: "캄보디아" },
      { nameKo: "라오스" },
      { nameKo: "몽골" },
      { nameKo: "인도" },
    ],
  },
  {
    region: "유럽",
    countries: [
      { nameKo: "프랑스", code: "FR" },
      { nameKo: "이탈리아", code: "IT" },
      { nameKo: "스페인", code: "ES" },
      { nameKo: "영국", code: "GB" },
      { nameKo: "포르투갈" },
      { nameKo: "독일" },
      { nameKo: "스위스" },
      { nameKo: "오스트리아" },
      { nameKo: "체코" },
      { nameKo: "네덜란드" },
      { nameKo: "크로아티아" },
      { nameKo: "그리스" },
    ],
  },
  {
    region: "북미",
    countries: [{ nameKo: "미국", code: "US" }, { nameKo: "캐나다" }, { nameKo: "멕시코" }],
  },
  {
    region: "오세아니아",
    countries: [{ nameKo: "호주", code: "AU" }, { nameKo: "뉴질랜드", code: "NZ" }, { nameKo: "피지" }],
  },
];

export const GALLERY: readonly GalleryPhoto[] = [
  { place: "교토", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/20181110_Fushimi_Inari_Torii_9.jpg/1920px-20181110_Fushimi_Inari_Torii_9.jpg", alt: "교토 후시미 이나리 신사의 붉은 도리이가 줄지어 이어진 산길" } },
  { place: "파리", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Sous_la_Tour_Eiffel_1.jpg/1920px-Sous_la_Tour_Eiffel_1.jpg", alt: "파리 에펠탑 아래에서 올려다본 철골 구조" } },
  { place: "바르셀로나", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Sagrada_Fam%C3%ADlia%2C_Barcelona.jpg/1920px-Sagrada_Fam%C3%ADlia%2C_Barcelona.jpg", alt: "바르셀로나 사그라다 파밀리아 성당의 첨탑과 외관" } },
  { place: "치앙마이", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Chiang_Mai%2C_Thailand_%28Unsplash_74yB8FhZyWc%29.jpg/1920px-Chiang_Mai%2C_Thailand_%28Unsplash_74yB8FhZyWc%29.jpg", alt: "치앙마이 시내와 사원 지붕, 뒤편의 산이 보이는 풍경" } },
  { place: "퀸스타운", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Lake_Wakatipu_Queenstown._%2810435735595%29.jpg/1920px-Lake_Wakatipu_Queenstown._%2810435735595%29.jpg", alt: "퀸스타운 와카티푸 호수와 호숫가를 둘러싼 산" } },
  { place: "뉴욕", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Panorama_of_Brooklyn_bridge_and_Manhattan.jpg/1920px-Panorama_of_Brooklyn_bridge_and_Manhattan.jpg", alt: "브루클린 브리지와 그 너머 맨해튼 고층 빌딩이 펼쳐진 풍경" } },
  { place: "피렌체", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Duomo_di_Firenze_%2855116%29.jpg/1920px-Duomo_di_Firenze_%2855116%29.jpg", alt: "피렌체 두오모(산타 마리아 델 피오레 대성당)의 붉은 돔과 외벽" } },
  { place: "시드니", image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Sydney_Harbour_including_Harbour_bridge_and_Opera_House.jpg/1920px-Sydney_Harbour_including_Harbour_bridge_and_Opera_House.jpg", alt: "하버 브리지와 오페라하우스가 함께 보이는 시드니 항구" } },
];

export const MEMORY_PLACES: readonly MemoryPlace[] = [
  {
    slug: "kyoto",
    place: "교토",
    memory: "새벽 다섯 시 후시미 이나리의 텅 빈 산길을 걸으며, 유명한 곳도 시간을 바꾸면 전혀 다른 장소가 된다는 걸 알았습니다.",
    image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Kiyomizu_Dera_Temple_Kyoto_Skyline_%28219542405%29.jpeg/1920px-Kiyomizu_Dera_Temple_Kyoto_Skyline_%28219542405%29.jpeg", alt: "교토 기요미즈데라 사찰과 주변 시가지가 넓게 보이는 풍경" },
  },
  {
    slug: "hanoi",
    place: "하노이",
    memory: "호안끼엠 호숫가에서 아침 체조를 하는 사람들 사이에 앉아 쌀국수를 먹던 시간이 가장 오래 남았습니다.",
    image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Hoan_Kiem_Lake_-_Hanoi%2C_Vietnam_-_DSC03687.JPG/1920px-Hoan_Kiem_Lake_-_Hanoi%2C_Vietnam_-_DSC03687.JPG", alt: "하노이 호안끼엠 호수와 호숫가 나무들" },
  },
  {
    slug: "florence",
    place: "피렌체",
    memory: "미술관 세 곳을 하루에 몰아 보다 지쳐 버린 뒤, 하루에 한 곳만 깊게 보는 일정이 더 좋다는 원칙이 생겼습니다.",
    image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Sunset_in_Florence_%28Unsplash%29.jpg/1920px-Sunset_in_Florence_%28Unsplash%29.jpg", alt: "해 질 녘 피렌체 시가지와 두오모가 보이는 풍경" },
  },
  {
    slug: "queenstown",
    place: "퀸스타운",
    memory: "비 때문에 트레킹을 하루 미루고 호숫가 카페에서 보낸 오후 덕분에, 일정에 빈칸을 남기는 법을 배웠습니다.",
    image: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Queenstown._Lake_Wakatipu._%2850854629786%29.jpg/1920px-Queenstown._Lake_Wakatipu._%2850854629786%29.jpg", alt: "퀸스타운 와카티푸 호수와 주변 산 풍경" },
  },
];

/** "free_traveler 추천 여행지 6곳" chips → /?dest=<slug> (slugs must exist in destinations.ts). */
export const RECOMMENDED_SLUGS = ["gyeongju", "tongyeong", "taipei", "chiang-mai", "nice", "melbourne"] as const;

/** Fill after the representative confirms; empty values are not rendered. */
export const CONTACT_LINKS: readonly ContactLink[] = [
  { kind: "email", label: "이메일 문의", href: "" },
  { kind: "instagram", label: "인스타그램", href: "" },
  { kind: "youtube", label: "유튜브", href: "" },
  { kind: "blog", label: "블로그", href: "" },
];

export function isAllowedContactHref(href: string): boolean {
  return href.startsWith("https://") || href.startsWith("mailto:");
}

/** Links that should be rendered: non-empty and https:/mailto: only. */
export function visibleContactLinks(): ContactLink[] {
  return CONTACT_LINKS.filter((link) => link.href !== "" && isAllowedContactHref(link.href));
}
