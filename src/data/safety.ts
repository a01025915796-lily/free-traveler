import type { AtLeast1, CountryCode, HttpsUrl, IsoDate } from "@/types/content";

/*
 * Country safety notes for the 15 overseas countries (static data, no DB).
 * Based on public guidance from the Ministry of Foreign Affairs (0404.go.kr) and local
 * emergency services. Stale is computed at render time as verifiedAt + 7 days (REQ-FUNC-050).
 * Before publishing, the editor re-checks every advisory level, scope and contact against the
 * MOFA original and updates verifiedAt; this file is updated by code review and redeploy.
 */

export type OverseasCountryCode = Exclude<CountryCode, "KR">;

/** MOFA travel advisory levels. "special" = 특별여행주의보. */
export type AdvisoryLevel = "none" | "level1" | "level2" | "special" | "level3" | "level4";

export const ADVISORY_LABELS: Record<AdvisoryLevel, string> = {
  none: "여행경보 없음",
  level1: "1단계 여행유의",
  level2: "2단계 여행자제",
  special: "특별여행주의보",
  level3: "3단계 출국권고",
  level4: "4단계 여행금지",
};

/** Levels shown as a critical (danger) alert above other blocks. */
export const CRITICAL_LEVELS: readonly AdvisoryLevel[] = ["special", "level3", "level4"];

export type AdvisoryScope =
  | { scopeType: "COUNTRY"; level: AdvisoryLevel; scopeText?: string }
  | { scopeType: "REGION"; level: AdvisoryLevel; scopeText: string };

/** The 8 safety categories; every country must fill all of them. */
export type SafetyCategoryId = "security" | "scams" | "laws" | "transport" | "disaster" | "health" | "culture" | "emergency";

export const SAFETY_CATEGORIES: readonly { id: SafetyCategoryId; label: string }[] = [
  { id: "security", label: "치안" },
  { id: "scams", label: "흔한 사기" },
  { id: "laws", label: "현지 법규" },
  { id: "transport", label: "교통" },
  { id: "disaster", label: "재난·기후" },
  { id: "health", label: "보건" },
  { id: "culture", label: "문화·복장" },
  { id: "emergency", label: "긴급연락처" },
];

export type EmergencyContact = { label: string; phone?: string; url?: HttpsUrl };

export type CountrySafety = {
  countryCode: OverseasCountryCode;
  /** Highest level that applies somewhere in the country (for the card badge). */
  headlineLevel: AdvisoryLevel;
  summary: string;
  advisories: AtLeast1<AdvisoryScope>;
  categories: Record<Exclude<SafetyCategoryId, "emergency">, AtLeast1<string>>;
  emergency: {
    localEmergency: AtLeast1<EmergencyContact>;
    embassy: EmergencyContact;
    consularCallCenter: EmergencyContact;
  };
  source: { name: string; url: HttpsUrl };
  verifiedAt: IsoDate;
  editor: string;
};

const MOFA_SOURCE = { name: "외교부 해외안전여행", url: "https://www.0404.go.kr/" } as const;
const CONSULAR_CALL_CENTER: EmergencyContact = {
  label: "영사콜센터 (24시간, 해외에서)",
  phone: "+82-2-3210-0404",
  url: "https://www.0404.go.kr/",
};
const VERIFIED_AT: IsoDate = "2026-10-11";
const EDITOR = "free_traveler";

function embassy(name: string, code: string): EmergencyContact {
  return { label: name, url: `https://overseas.mofa.go.kr/${code}-ko/index.do` };
}

export const SAFETY: readonly CountrySafety[] = [
  {
    countryCode: "JP",
    headlineLevel: "none",
    summary: "치안이 좋은 편이지만 지진·태풍 같은 자연재해 대비가 중요합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "도쿄·오사카·교토 등 주요 여행지" }],
    categories: {
      security: ["강력 범죄는 드물지만 번화가 유흥가의 호객 행위를 따라가지 않습니다."],
      scams: ["번화가 바의 과다 청구(바가지) 피해가 있으니 가격을 먼저 확인합니다.", "길에서 접근하는 기부·서명 요청에 응하지 않습니다."],
      laws: ["일부 감기약·각성 성분 의약품은 반입이 제한되니 처방전을 챙깁니다.", "길거리 흡연은 지정 구역에서만 가능한 지역이 많습니다."],
      transport: ["차량은 좌측 통행이며 자전거도 도로 표지를 따릅니다.", "막차 시간이 이르니 귀가 교통편을 미리 확인합니다."],
      disaster: ["지진이 잦으므로 숙소의 피난 경로를 확인하고 긴급지진속보 앱을 설치합니다.", "6~10월 태풍·폭우 시 교통이 멈출 수 있습니다."],
      health: ["의료비가 높으니 여행자보험에 가입합니다.", "여름 열사병에 주의하고 물을 자주 마십니다."],
      culture: ["신사·사찰에서는 안내된 구역만 들어가고 촬영 금지 표시를 지킵니다.", "실내에서 신발을 벗는 곳이 많습니다."],
    },
    emergency: {
      localEmergency: [{ label: "경찰", phone: "110" }, { label: "화재·구급", phone: "119" }],
      embassy: embassy("주일본 대한민국 대사관", "jp"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "TW",
    headlineLevel: "none",
    summary: "치안은 양호하며 여름·가을 태풍과 지진에 대비합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "타이베이 등 주요 여행지" }],
    categories: {
      security: ["야시장 등 붐비는 곳에서 소매치기에 주의합니다."],
      scams: ["택시는 미터기 사용을 확인하고 공식 택시를 탑니다."],
      laws: ["MRT 역과 열차 안에서는 물을 포함해 음식·음료를 먹으면 벌금이 있습니다.", "육류 가공품 반입이 엄격히 금지됩니다."],
      transport: ["스쿠터가 많아 횡단보도에서도 좌우를 살핍니다."],
      disaster: ["6~10월 태풍 시 항공편이 결항될 수 있습니다.", "지진이 자주 발생하니 대피 요령을 확인합니다."],
      health: ["여름 무더위와 모기 매개 질환(뎅기열)에 주의합니다."],
      culture: ["사원 참배객의 동선을 막지 않고 향로 주변에서 조심합니다."],
    },
    emergency: {
      localEmergency: [{ label: "경찰", phone: "110" }, { label: "화재·구급", phone: "119" }],
      embassy: embassy("주타이베이 대한민국 대표부", "tw"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "TH",
    headlineLevel: "level3",
    summary: "주요 관광지는 비교적 안전하지만 남부 국경 일부 지역에는 높은 단계의 경보가 있습니다.",
    advisories: [
      { scopeType: "COUNTRY", level: "none", scopeText: "방콕·치앙마이·푸껫 등 주요 관광지" },
      { scopeType: "REGION", level: "level3", scopeText: "말레이시아 접경 남부 일부 지역(나라티왓·얄라·빳따니 및 송클라 일부)" },
    ],
    categories: {
      security: ["관광지 소매치기와 오토바이 날치기에 주의합니다.", "남부 국경 지역 방문은 피합니다."],
      scams: ["'오늘 왕궁이 문을 닫았다'며 다른 곳으로 안내하는 사기에 주의합니다.", "툭툭·택시는 탑승 전 요금을 확인합니다."],
      laws: ["왕실 모독은 법으로 엄하게 처벌됩니다.", "전자담배 반입·사용이 금지되어 있습니다."],
      transport: ["오토바이 대여 시 국제운전면허와 헬멧이 필요하며 사고가 잦습니다."],
      disaster: ["5~10월 우기에는 침수와 높은 파도가 있어 해변 수영 깃발을 확인합니다.", "북부는 2~4월 연무(미세먼지)가 심할 수 있습니다."],
      health: ["뎅기열 예방을 위해 모기 기피제를 씁니다.", "길거리 음식은 위생 상태를 살피고 생수를 마십니다."],
      culture: ["사원에서는 어깨·무릎을 가리고 신발을 벗습니다.", "사람의 머리를 만지지 않습니다."],
    },
    emergency: {
      localEmergency: [{ label: "관광경찰", phone: "1155" }, { label: "경찰", phone: "191" }, { label: "구급", phone: "1669" }],
      embassy: embassy("주태국 대한민국 대사관", "th"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "VN",
    headlineLevel: "none",
    summary: "전반적으로 안전하지만 오토바이 교통과 날치기에 주의해야 합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "다낭·하노이·호찌민 등 주요 여행지" }],
    categories: {
      security: ["오토바이 날치기가 잦아 휴대폰·가방을 도로 반대쪽으로 듭니다."],
      scams: ["택시는 앱으로 부르거나 미터기를 확인합니다.", "환전 시 큰 지폐 단위(0의 개수)를 다시 확인합니다."],
      laws: ["군사시설·공항 등은 촬영이 금지됩니다.", "마약 범죄는 매우 엄하게 처벌됩니다."],
      transport: ["길을 건널 때는 일정한 속도로 천천히 건너 오토바이가 피해 가게 합니다."],
      disaster: ["중부는 9~12월 태풍과 홍수, 남부는 5~11월 우기 소나기가 있습니다."],
      health: ["물은 생수를 마시고 얼음의 위생을 살핍니다.", "뎅기열 예방을 위해 모기를 막습니다."],
      culture: ["사원·묘소 방문 시 노출이 적은 옷을 입습니다."],
    },
    emergency: {
      localEmergency: [{ label: "경찰", phone: "113" }, { label: "화재", phone: "114" }, { label: "구급", phone: "115" }],
      embassy: embassy("주베트남 대한민국 대사관", "vn"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "SG",
    headlineLevel: "none",
    summary: "치안이 매우 좋지만 생활 법규 위반에 대한 벌금이 엄격합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none" }],
    categories: {
      security: ["범죄는 드물지만 붐비는 곳에서 소지품을 챙깁니다."],
      scams: ["가짜 경찰·공무원을 사칭한 전화 사기에 응하지 않습니다."],
      laws: ["껌 반입·판매, 쓰레기 투기, 지정 외 흡연은 벌금 대상입니다.", "전자담배는 소지만으로도 처벌됩니다.", "마약 범죄는 사형까지 가능한 중범죄입니다."],
      transport: ["MRT 안에서는 먹고 마실 수 없습니다.", "무단횡단은 벌금 대상입니다."],
      disaster: ["11~1월 몬순 시기 소나기와 번개가 잦습니다.", "주변국 산불로 연무가 생기면 공기질 지수를 확인합니다."],
      health: ["뎅기열 경보 지역을 확인하고 모기를 막습니다."],
      culture: ["사원·모스크 방문 시 복장 규정을 지킵니다."],
    },
    emergency: {
      localEmergency: [{ label: "경찰", phone: "999" }, { label: "화재·구급", phone: "995" }],
      embassy: embassy("주싱가포르 대한민국 대사관", "sg"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "ID",
    headlineLevel: "none",
    summary: "발리 등 관광지는 비교적 안전하지만 화산·지진과 교통 안전에 주의합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "발리 등 주요 관광지" }],
    categories: {
      security: ["관광지 소매치기와 오토바이 날치기에 주의합니다."],
      scams: ["환전은 공인 환전소에서 하고 받은 금액을 그 자리에서 셉니다.", "택시는 미터기나 앱 요금을 확인합니다."],
      laws: ["마약 범죄는 사형까지 가능한 중범죄입니다.", "공공장소 애정 표현과 음주에 대한 지역 규정을 확인합니다."],
      transport: ["오토바이 사고가 많으니 헬멧을 쓰고 면허 없이 운전하지 않습니다."],
      disaster: ["화산 활동 시 공항이 폐쇄될 수 있어 항공편을 확인합니다.", "지진·쓰나미 대피 경로를 숙소에서 확인합니다."],
      health: ["물은 생수를 마시고 여행자 설사에 대비합니다.", "광견병 위험이 있어 원숭이·개에 다가가지 않습니다."],
      culture: ["사원에서는 사롱을 두르고 생리 중 출입 자제 안내를 따릅니다.", "길에 놓인 제물(짜낭)을 밟지 않습니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "112" }, { label: "경찰", phone: "110" }, { label: "구급", phone: "118" }],
      embassy: embassy("주인도네시아 대한민국 대사관", "id"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "PH",
    headlineLevel: "level3",
    summary: "세부·보라카이 등 관광지는 방문할 수 있지만 민다나오 일부 지역은 높은 단계의 경보가 있습니다.",
    advisories: [
      { scopeType: "COUNTRY", level: "level1", scopeText: "세부·보라카이·마닐라 등 주요 지역" },
      { scopeType: "REGION", level: "level3", scopeText: "민다나오 일부 지역과 술루 군도 등 남서부 섬 지역" },
    ],
    categories: {
      security: ["총기 범죄가 있어 밤늦게 외진 곳을 다니지 않습니다.", "고가품을 드러내지 않습니다."],
      scams: ["낯선 사람이 권하는 음료를 마시지 않습니다(약물 강도).", "공항 비공식 택시 대신 공식 택시·앱을 씁니다."],
      laws: ["마약 범죄 처벌이 매우 엄합니다.", "공공장소 흡연·음주 제한 지역이 있습니다."],
      transport: ["섬 간 배는 기상 악화 시 결항되니 일정을 여유 있게 잡습니다."],
      disaster: ["7~10월 태풍이 잦으니 기상 특보를 확인합니다.", "지진과 화산 활동이 있는 지역입니다."],
      health: ["뎅기열과 수인성 질환에 주의하고 생수를 마십니다."],
      culture: ["성당 방문 시 단정한 복장을 합니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "911" }],
      embassy: embassy("주필리핀 대한민국 대사관", "ph"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "MY",
    headlineLevel: "none",
    summary: "도시 관광은 대체로 안전하며 날치기와 이슬람 문화 예절에 유의합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "쿠알라룸푸르 등 주요 여행지" }],
    categories: {
      security: ["오토바이 날치기에 주의해 가방을 도로 반대쪽으로 멥니다."],
      scams: ["택시는 앱이나 미터기 택시를 이용합니다."],
      laws: ["마약 범죄는 사형까지 가능한 중범죄입니다.", "라마단 기간에는 공공장소 낮 시간 음식 섭취를 삼갑니다."],
      transport: ["도로 교통이 혼잡하니 이동 시간을 넉넉히 잡습니다."],
      disaster: ["10~12월 동부 해안 몬순 홍수, 연무 시 공기질 지수를 확인합니다."],
      health: ["뎅기열 예방을 위해 모기를 막습니다."],
      culture: ["모스크 방문 시 긴 옷과 머리 가리개를 착용합니다.", "왼손으로 음식을 건네지 않습니다."],
    },
    emergency: {
      localEmergency: [{ label: "경찰·구급", phone: "999" }],
      embassy: embassy("주말레이시아 대한민국 대사관", "my"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "FR",
    headlineLevel: "none",
    summary: "관광지 소매치기가 가장 흔한 피해이며 시위 일정도 확인합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "파리·니스 등 주요 여행지" }],
    categories: {
      security: ["지하철·에펠탑·루브르 주변 소매치기가 많아 가방을 앞으로 멥니다.", "대규모 시위·파업 시 해당 지역을 피합니다."],
      scams: ["팔찌를 채우고 돈을 요구하거나 서명을 받으며 지갑을 노리는 수법에 주의합니다.", "금반지를 주웠다며 접근하는 사기에 응하지 않습니다."],
      laws: ["대중교통 표는 탑승 전 개찰하지 않으면 벌금이 부과될 수 있습니다."],
      transport: ["파업 시 열차·지하철이 멈출 수 있으니 운행 정보를 확인합니다."],
      disaster: ["여름 폭염 경보 시 야외 일정을 줄입니다.", "남부는 여름 산불 위험이 있습니다."],
      health: ["의료비가 높으니 여행자보험에 가입합니다."],
      culture: ["상점에 들어가면 먼저 인사합니다.", "성당 미사 중에는 관람을 자제합니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "112" }, { label: "경찰", phone: "17" }, { label: "구급(SAMU)", phone: "15" }],
      embassy: embassy("주프랑스 대한민국 대사관", "fr"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "IT",
    headlineLevel: "none",
    summary: "소매치기와 관광지 벌금 규정에 주의하면 비교적 안전합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "로마·피렌체·베네치아 등 주요 여행지" }],
    categories: {
      security: ["테르미니역·관광지·버스 안 소매치기가 많습니다."],
      scams: ["사진을 찍어 주겠다며 휴대폰을 가져가는 수법, 서명 요구에 주의합니다.", "식당 메뉴판에 없는 요금(자릿세)을 계산 전에 확인합니다."],
      laws: ["스페인 계단에 앉기, 분수 들어가기, 광장 계단 취식은 벌금 대상입니다.", "도심 차량 통행 제한 구역(ZTL)에 진입하면 벌금이 나옵니다."],
      transport: ["버스·트램 표는 탑승 후 개찰기에 찍어야 합니다."],
      disaster: ["여름 폭염과 베네치아 겨울 침수(아쿠아 알타)에 대비합니다.", "지진이 발생하는 지역입니다."],
      health: ["여름 열사병에 주의하고 물을 자주 마십니다."],
      culture: ["성당에서는 어깨·무릎을 가립니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "112" }, { label: "구급", phone: "118" }],
      embassy: embassy("주이탈리아 대한민국 대사관", "it"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "ES",
    headlineLevel: "none",
    summary: "바르셀로나·마드리드의 소매치기가 가장 흔한 피해입니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "바르셀로나·마드리드 등 주요 여행지" }],
    categories: {
      security: ["람블라스 거리, 지하철, 해변에서 소매치기가 매우 많습니다."],
      scams: ["옷에 무언가 묻었다며 닦아 주는 척 지갑을 노리는 수법에 주의합니다."],
      laws: ["해변·거리 음주와 수영복 차림 시내 활보를 제한하는 지역 규정이 있습니다."],
      transport: ["지하철 개찰구에서 뒤따라 들어오는 사람을 조심합니다."],
      disaster: ["여름 폭염과 산불 경보를 확인합니다."],
      health: ["한여름 낮 야외 활동 시 수분을 충분히 섭취합니다."],
      culture: ["점심·저녁 식사 시간이 늦은 편입니다.", "성당 방문 시 단정한 복장을 합니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "112" }],
      embassy: embassy("주스페인 대한민국 대사관", "es"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "GB",
    headlineLevel: "none",
    summary: "치안은 양호한 편이나 번화가 소매치기와 휴대폰 날치기에 주의합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "런던 등 주요 여행지" }],
    categories: {
      security: ["번화가에서 자전거·오토바이를 탄 휴대폰 날치기에 주의합니다."],
      scams: ["길거리 야바위·가짜 모금 활동에 응하지 않습니다."],
      laws: ["입국 전 전자여행허가(ETA)가 필요합니다."],
      transport: ["차량이 좌측 통행이라 길을 건널 때 오른쪽을 먼저 봅니다.", "철도 파업 일정을 확인합니다."],
      disaster: ["비가 잦고 날씨 변화가 커 우산과 겉옷을 챙깁니다."],
      health: ["응급이 아니면 NHS 111로 상담합니다."],
      culture: ["줄 서기 문화를 지키고 에스컬레이터 왼쪽을 비웁니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "999" }, { label: "통합 긴급(유럽 공통)", phone: "112" }],
      embassy: embassy("주영국 대한민국 대사관", "gb"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "US",
    headlineLevel: "none",
    summary: "도시마다 치안 차이가 크고 총기 사건 대응 요령을 알아 두는 것이 좋습니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "뉴욕·로스앤젤레스·샌프란시스코 등 주요 여행지" }],
    categories: {
      security: ["밤늦게 인적이 드문 거리와 지하철 끝 칸을 피합니다.", "차량 안에 가방을 두면 유리창 파손 절도가 잦습니다."],
      scams: ["길에서 CD·팔찌를 건네고 돈을 요구하는 수법에 응하지 않습니다."],
      laws: ["입국 전 ESTA 승인이 필요합니다.", "공공장소 음주는 대부분 금지입니다."],
      transport: ["주마다 교통 법규가 다르며 스쿨버스 정차 시 반대 차선도 멈춥니다."],
      disaster: ["서부는 산불·지진, 동부는 겨울 폭설과 여름 허리케인에 대비합니다."],
      health: ["의료비가 매우 높아 여행자보험이 필수입니다."],
      culture: ["식당·택시 팁은 보통 18~22%입니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "911" }],
      embassy: embassy("주미국 대한민국 대사관", "us"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "AU",
    headlineLevel: "none",
    summary: "치안은 양호하며 강한 자외선, 바다 안전, 산불에 주의합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "시드니·멜버른 등 주요 여행지" }],
    categories: {
      security: ["밤늦은 유흥가에서 시비가 붙지 않게 주의합니다."],
      scams: ["숙소·워킹홀리데이 구인 광고를 가장한 선입금 사기에 주의합니다."],
      laws: ["입국 전 전자비자(ETA)가 필요합니다.", "음식·동식물 반입은 반드시 신고하며 미신고 시 벌금이 큽니다."],
      transport: ["차량은 좌측 통행입니다."],
      disaster: ["여름(12~2월) 산불 경보와 폭염을 확인합니다.", "해변 이안류가 위험해 깃발 사이에서만 수영합니다."],
      health: ["자외선이 매우 강해 모자·선크림을 꼭 씁니다."],
      culture: ["원주민 성지와 문화 공간에서는 안내를 따릅니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "000" }, { label: "휴대전화 긴급", phone: "112" }],
      embassy: embassy("주호주 대한민국 대사관", "au"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
  {
    countryCode: "NZ",
    headlineLevel: "none",
    summary: "치안은 좋은 편이며 급변하는 산악 날씨와 생물 보안 규정에 주의합니다.",
    advisories: [{ scopeType: "COUNTRY", level: "none", scopeText: "오클랜드·퀸스타운 등 주요 여행지" }],
    categories: {
      security: ["관광지 주차 차량 내 물품 도난에 주의합니다."],
      scams: ["캠퍼밴·숙소 직거래 선입금 사기에 주의합니다."],
      laws: ["입국 전 전자여행허가(NZeTA)와 관광세가 필요합니다.", "음식·흙 묻은 장비는 반드시 신고합니다(생물 보안)."],
      transport: ["차량 좌측 통행, 일차선 다리 우선 표시를 따릅니다."],
      disaster: ["지진·화산 지역이며 산악 날씨가 급변하니 하이킹 전 기상을 확인합니다."],
      health: ["자외선이 강하니 선크림을 씁니다."],
      culture: ["마오리 문화 공간에서는 안내에 따라 예를 갖춥니다."],
    },
    emergency: {
      localEmergency: [{ label: "통합 긴급", phone: "111" }],
      embassy: embassy("주뉴질랜드 대한민국 대사관", "nz"),
      consularCallCenter: CONSULAR_CALL_CENTER,
    },
    source: MOFA_SOURCE,
    verifiedAt: VERIFIED_AT,
    editor: EDITOR,
  },
];

/** Countries shown in the main page safety section (6). */
export const FEATURED_SAFETY: readonly OverseasCountryCode[] = ["JP", "TH", "VN", "PH", "FR", "US"];

export function getSafety(code: string): CountrySafety | undefined {
  return SAFETY.find((s) => s.countryCode === code);
}
