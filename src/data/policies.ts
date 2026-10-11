/**
 * Policy documents shown in the footer policy dialogs (static data, no DB).
 * POLICY_VERSION is stored with each mate post as `policy_version` together with
 * `safety_agreed_at` when the author agrees to the mate safety rules (REQ-FUNC-080).
 * Change the text through code review and redeploy; bump POLICY_VERSION when the meaning changes.
 */

export const POLICY_VERSION = "2026-10-11";

export type PolicyId = "terms" | "privacy" | "mate-safety" | "content-disclaimer";

export type PolicySection = { heading: string; paragraphs: readonly string[] };

export type PolicyDocument = {
  id: PolicyId;
  title: string;
  summary: string;
  effectiveDate: string;
  sections: readonly PolicySection[];
};

export const POLICY_IDS: readonly PolicyId[] = ["terms", "privacy", "mate-safety", "content-disclaimer"];

export const POLICIES: Record<PolicyId, PolicyDocument> = {
  terms: {
    id: "terms",
    title: "이용약관",
    summary: "Free Traveler를 이용할 때 지켜야 할 기본 약속입니다.",
    effectiveDate: POLICY_VERSION,
    sections: [
      {
        heading: "서비스 범위",
        paragraphs: [
          "Free Traveler는 여행지 정보, 국가별 안전정보, 항공·숙소 외부 사이트 연결, 여행 동행 모집 기능을 제공합니다.",
          "항공권·숙소의 검색, 예약, 결제는 연결된 외부 사이트에서 이루어지며 Free Traveler는 그 거래의 당사자가 아닙니다.",
        ],
      },
      {
        heading: "회원과 이용 연령",
        paragraphs: [
          "동행 모집글 작성과 참가 요청은 이메일 인증을 마치고 만 19세 이상임을 확인한 회원만 이용할 수 있습니다.",
          "여행지·안전정보 열람과 항공·숙소 조건 정리는 로그인 없이 이용할 수 있습니다.",
        ],
      },
      {
        heading: "금지 행위",
        paragraphs: [
          "모집글과 참가 요청에 전화번호·메신저 아이디·SNS 계정 등 공개 연락처를 쓰지 않습니다.",
          "다른 회원을 괴롭히거나 속이는 행위, 영리 목적의 광고, 타인의 개인정보를 올리는 행위를 금지합니다.",
          "금지 행위가 신고되면 운영자가 신고 내용을 검토하고 처리 결과를 신고 상태로 기록합니다.",
        ],
      },
      {
        heading: "게시물 관리",
        paragraphs: [
          "회원은 자신이 올린 모집글을 수정·마감·삭제할 수 있습니다. 종료일이 지난 모집글은 자동으로 마감 상태로 표시됩니다.",
          "불편한 회원은 차단할 수 있으며, 차단한 회원과는 서로의 글·프로필·요청이 보이지 않습니다.",
        ],
      },
      {
        heading: "약관 변경",
        paragraphs: ["약관을 바꿀 때는 시행일을 이 화면에 함께 표시합니다. 변경 후에도 서비스를 계속 이용하면 바뀐 약관에 동의한 것으로 봅니다."],
      },
    ],
  },
  privacy: {
    id: "privacy",
    title: "개인정보 처리방침",
    summary: "동행 기능에 꼭 필요한 최소한의 정보만 저장합니다.",
    effectiveDate: POLICY_VERSION,
    sections: [
      {
        heading: "저장하는 정보",
        paragraphs: [
          "계정: 이메일 주소와 비밀번호(인증 서비스가 암호화해 보관). 이메일은 다른 회원에게 보이지 않습니다.",
          "프로필: 닉네임, 연령대, 성별(선택), 여행 스타일, 자기소개, 만 19세 이상 여부와 확인 시각. 생년월일은 받지 않습니다.",
          "동행 활동: 모집글, 참가 요청 메시지와 상태, 차단 목록, 신고 내용, 안전수칙 동의 시각과 정책 버전.",
        ],
      },
      {
        heading: "저장하지 않는 정보",
        paragraphs: [
          "항공·숙소 탭에서 입력한 국가·도시·날짜는 브라우저 화면 안에서만 쓰고 서버·데이터베이스·주소창·쿠키·로그로 보내지 않습니다.",
          "즐겨찾기한 여행지는 사용 중인 브라우저에만 저장되며 서버로 전송하지 않습니다.",
          "방문 기록이나 행동 분석 정보를 수집하지 않습니다.",
        ],
      },
      {
        heading: "공개 범위",
        paragraphs: [
          "다른 회원에게는 닉네임·연령대·성별·여행 스타일·자기소개와 모집글 조건만 보입니다.",
          "참가 요청은 요청한 회원과 해당 글 작성자만 볼 수 있습니다. 신고 내용은 신고자 본인과 운영자만 볼 수 있습니다.",
        ],
      },
      {
        heading: "보관과 삭제",
        paragraphs: [
          "회원 탈퇴나 개인정보 삭제를 원하면 계정 화면의 안내에 따라 요청해 주세요. 요청을 확인한 뒤 운영자가 직접 처리합니다.",
        ],
      },
    ],
  },
  "mate-safety": {
    id: "mate-safety",
    title: "동행 안전수칙",
    summary: "동행을 구하고 만날 때 꼭 지켜 주세요. 모집글을 올릴 때 이 수칙에 동의해야 합니다.",
    effectiveDate: POLICY_VERSION,
    sections: [
      {
        heading: "연락처는 승인 뒤에",
        paragraphs: [
          "모집글과 참가 요청에는 전화번호·메신저 아이디·SNS 계정을 쓰지 않습니다. 연락처가 들어간 글은 올라가지 않습니다.",
          "작성자가 참가 요청을 승인한 뒤에 필요한 만큼만 연락처를 주고받으세요.",
        ],
      },
      {
        heading: "첫 만남은 공개된 장소에서",
        paragraphs: [
          "처음 만날 때는 사람이 많은 공개된 장소를 고르고, 일정과 만나는 사람을 가족이나 지인에게 알려 두세요.",
        ],
      },
      {
        heading: "돈과 신분증은 직접 챙기기",
        paragraphs: [
          "숙소·교통비를 미리 보내 달라는 요청, 여권·신분증 사진을 요구하는 요청에는 응하지 마세요.",
        ],
      },
      {
        heading: "불편하면 신고·차단",
        paragraphs: [
          "불쾌하거나 위험하다고 느끼면 글이나 회원을 신고하고 차단하세요. 신고하면 접수번호와 접수 시각이 바로 표시됩니다.",
          "급한 위험이 있으면 현지 경찰이나 재외공관에 먼저 연락하세요.",
        ],
      },
    ],
  },
  "content-disclaimer": {
    id: "content-disclaimer",
    title: "콘텐츠 면책 안내",
    summary: "여행·안전 정보는 판단을 돕는 참고 자료이며 공식 기관의 최신 안내를 대신하지 않습니다.",
    effectiveDate: POLICY_VERSION,
    sections: [
      {
        heading: "안전정보",
        paragraphs: [
          "국가별 주의사항은 외교부 해외안전여행 등 공식 출처를 바탕으로 정리하고 출처와 최종 확인일을 함께 표시합니다.",
          "최종 확인일로부터 7일이 지난 정보에는 재확인 권장 표시가 붙습니다. 출발 전에는 반드시 공식 사이트에서 최신 여행경보를 확인하세요.",
        ],
      },
      {
        heading: "여행지 정보",
        paragraphs: [
          "일정·예산·교통 정보는 free_traveler의 여행 경험과 공개 자료를 바탕으로 한 예시이며 계절과 현지 사정에 따라 달라질 수 있습니다.",
          "비자·입국 요건, 법률·의료 판단은 해당 국가 대사관과 전문 기관의 안내를 따르세요.",
        ],
      },
      {
        heading: "외부 사이트",
        paragraphs: [
          "항공·숙소 버튼은 외부 사이트의 일반 페이지를 새 탭으로 엽니다. 입력한 조건은 외부 사이트로 전달되지 않으며, 외부 사이트의 가격·예약·환불은 해당 사이트의 정책을 따릅니다.",
        ],
      },
    ],
  },
};

export function isPolicyId(value: string | null | undefined): value is PolicyId {
  return value !== null && value !== undefined && (POLICY_IDS as readonly string[]).includes(value);
}
