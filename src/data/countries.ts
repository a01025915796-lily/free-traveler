import type { Country, CountryCode } from "@/types/content";

/** Korea plus the 15 overseas countries in the MVP content seed (PRD §3-3). */
export const COUNTRIES: readonly Country[] = [
  { code: "KR", nameKo: "대한민국", nameEn: "South Korea", scope: "domestic", area: "국내" },
  { code: "JP", nameKo: "일본", nameEn: "Japan", scope: "overseas", area: "동아시아" },
  { code: "TW", nameKo: "대만", nameEn: "Taiwan", scope: "overseas", area: "동아시아" },
  { code: "TH", nameKo: "태국", nameEn: "Thailand", scope: "overseas", area: "동남아시아" },
  { code: "VN", nameKo: "베트남", nameEn: "Vietnam", scope: "overseas", area: "동남아시아" },
  { code: "SG", nameKo: "싱가포르", nameEn: "Singapore", scope: "overseas", area: "동남아시아" },
  { code: "ID", nameKo: "인도네시아", nameEn: "Indonesia", scope: "overseas", area: "동남아시아" },
  { code: "PH", nameKo: "필리핀", nameEn: "Philippines", scope: "overseas", area: "동남아시아" },
  { code: "MY", nameKo: "말레이시아", nameEn: "Malaysia", scope: "overseas", area: "동남아시아" },
  { code: "FR", nameKo: "프랑스", nameEn: "France", scope: "overseas", area: "유럽" },
  { code: "IT", nameKo: "이탈리아", nameEn: "Italy", scope: "overseas", area: "유럽" },
  { code: "ES", nameKo: "스페인", nameEn: "Spain", scope: "overseas", area: "유럽" },
  { code: "GB", nameKo: "영국", nameEn: "United Kingdom", scope: "overseas", area: "유럽" },
  { code: "US", nameKo: "미국", nameEn: "United States", scope: "overseas", area: "북미" },
  { code: "AU", nameKo: "호주", nameEn: "Australia", scope: "overseas", area: "오세아니아" },
  { code: "NZ", nameKo: "뉴질랜드", nameEn: "New Zealand", scope: "overseas", area: "오세아니아" },
];

export const OVERSEAS_COUNTRIES = COUNTRIES.filter((c) => c.scope === "overseas");

export function getCountry(code: CountryCode): Country {
  const country = COUNTRIES.find((c) => c.code === code);
  if (!country) throw new Error(`Unknown country code: ${code}`);
  return country;
}

export function isCountryCode(value: string | null | undefined): value is CountryCode {
  return value !== null && value !== undefined && COUNTRIES.some((c) => c.code === value);
}
