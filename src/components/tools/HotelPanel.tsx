"use client";

import { TripPlanner } from "./TripConditionForm";

/**
 * Hotel tab content (sections 3–4): the same form and summary card as the flight tab in hotel
 * mode — check-in / check-out, "호텔 보러 가기". It has its own state instance, so it is fully
 * separate from the flight tab. Inputs stay in component state only.
 */
export function HotelPanel({ sectionIds }: { sectionIds?: { form: string; summary: string } }) {
  return <TripPlanner kind="hotel" sectionIds={sectionIds} />;
}
