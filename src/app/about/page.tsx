import type { Metadata } from "next";
import { CountryChipGroup } from "@/components/about/CountryChipGroup";
import { MemorySection } from "@/components/about/MemoryCard";
import { PhotoGallery } from "@/components/about/PhotoGallery";
import { ProfileHero, TravelStats } from "@/components/about/ProfileHero";
import { ProfileStory } from "@/components/about/ProfileStory";
import { TravelTimeline } from "@/components/about/TravelTimeline";
import { CURATOR } from "@/data/curator";

/*
 * SCR-002 대표 소개 (Page Owner). Static server rendering from src/data/curator.ts, assembled in
 * UI_CONTRACT §3.1 order: ① profile-hero → ② stats → ③ story → ④ timeline → ⑤ countries
 * → ⑥ gallery → ⑦ memories. No loading or empty states (static data); empty SNS links are
 * not rendered; failed images show the place-name placeholder.
 */

const TITLE = "free_traveler 소개 — 50+ Trips, 30+ Countries";

export const metadata: Metadata = {
  title: TITLE,
  description: CURATOR.tagline,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${TITLE} | Free Traveler`,
    description: CURATOR.tagline,
    url: "/about",
    images: [{ url: CURATOR.heroImage.src, alt: CURATOR.heroImage.alt }],
  },
};

export default function AboutPage() {
  return (
    <>
      <div id="profile-hero">
        <ProfileHero />
      </div>
      <div id="stats">
        <TravelStats />
      </div>
      <div id="story">
        <ProfileStory />
      </div>
      <div id="timeline">
        <TravelTimeline />
      </div>
      <div id="countries">
        <CountryChipGroup />
      </div>
      <div id="gallery">
        <PhotoGallery />
      </div>
      <div id="memories">
        <MemorySection />
      </div>
    </>
  );
}
