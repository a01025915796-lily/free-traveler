import { todayInSeoul } from "@/lib/mates/state";
import type { CountryCode } from "@/types/content";
import { isRegionOf } from "./regions";

/*
 * Pure validation for the flight / hotel / mate forms. Values are passed as arguments only —
 * nothing is stored, logged or sent anywhere (flight/hotel inputs stay in component state).
 * "Today" is the calendar date in Asia/Seoul. Dates are YYYY-MM-DD strings.
 */

export type FieldErrors<K extends string> = Partial<Record<K, string>>;
export type ValidationResult<K extends string> = { ok: boolean; errors: FieldErrors<K> };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDate(value: string | null | undefined): value is string {
  if (!value || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Whole nights between two dates (check-in → check-out). */
export function nightsBetween(start: string, end: string): number {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);
}

function checkPlace<K extends string>(errors: FieldErrors<K>, country: string, region: string, countryKey: K, regionKey: K) {
  if (!country) errors[countryKey] = "여행할 국가를 선택해 주세요.";
  if (!region) errors[regionKey] = "도시를 선택해 주세요.";
  else if (country && !isRegionOf(country as CountryCode, region)) errors[regionKey] = "선택한 국가의 도시를 골라 주세요.";
}

// Flight ------------------------------------------------------------------------------------

export type FlightInput = { country: string; region: string; departDate: string; returnDate: string };
export type FlightField = keyof FlightInput;

/** Departure before today, or return before departure, blocks moving on. Same-day return is allowed. */
export function validateFlight(input: FlightInput, now: Date = new Date()): ValidationResult<FlightField> {
  const errors: FieldErrors<FlightField> = {};
  checkPlace(errors, input.country, input.region, "country", "region");
  const today = todayInSeoul(now);
  if (!isValidDate(input.departDate)) errors.departDate = "출발일을 선택해 주세요.";
  else if (input.departDate < today) errors.departDate = "출발일은 오늘 이후로 선택해 주세요.";
  if (!isValidDate(input.returnDate)) errors.returnDate = "귀국일을 선택해 주세요.";
  else if (isValidDate(input.departDate) && input.returnDate < input.departDate) errors.returnDate = "귀국일은 출발일과 같거나 그 뒤여야 해요.";
  return { ok: Object.keys(errors).length === 0, errors };
}

// Hotel -------------------------------------------------------------------------------------

export type HotelInput = { country: string; region: string; checkIn: string; checkOut: string };
export type HotelField = keyof HotelInput;

/** Check-in before today, or check-out not after check-in, blocks moving on. */
export function validateHotel(input: HotelInput, now: Date = new Date()): ValidationResult<HotelField> {
  const errors: FieldErrors<HotelField> = {};
  checkPlace(errors, input.country, input.region, "country", "region");
  const today = todayInSeoul(now);
  if (!isValidDate(input.checkIn)) errors.checkIn = "체크인 날짜를 선택해 주세요.";
  else if (input.checkIn < today) errors.checkIn = "체크인은 오늘 이후로 선택해 주세요.";
  if (!isValidDate(input.checkOut)) errors.checkOut = "체크아웃 날짜를 선택해 주세요.";
  else if (isValidDate(input.checkIn) && input.checkOut <= input.checkIn) errors.checkOut = "체크아웃은 체크인 다음 날 이후여야 해요.";
  return { ok: Object.keys(errors).length === 0, errors };
}

// Mate post dates ---------------------------------------------------------------------------

export type MateDatesInput = { country: string; region: string; startDate: string; endDate: string };
export type MateDatesField = keyof MateDatesInput;

/** Mate post: country/region required, end >= start, end not in the past (Asia/Seoul). */
export function validateMateDates(input: MateDatesInput, now: Date = new Date()): ValidationResult<MateDatesField> {
  const errors: FieldErrors<MateDatesField> = {};
  checkPlace(errors, input.country, input.region, "country", "region");
  const today = todayInSeoul(now);
  if (!isValidDate(input.startDate)) errors.startDate = "시작일을 선택해 주세요.";
  if (!isValidDate(input.endDate)) errors.endDate = "종료일을 선택해 주세요.";
  else if (isValidDate(input.startDate) && input.endDate < input.startDate) errors.endDate = "종료일은 시작일과 같거나 그 뒤여야 해요.";
  else if (input.endDate < today) errors.endDate = "종료일이 이미 지났어요. 날짜를 다시 골라 주세요.";
  return { ok: Object.keys(errors).length === 0, errors };
}

/** Min value for <input type="date"> (today in Asia/Seoul). */
export function minDate(now: Date = new Date()): string {
  return todayInSeoul(now);
}
