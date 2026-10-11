/**
 * Static content types (src/data). Required fields and minimum counts are enforced here;
 * text length (intro 300+ chars) and quantities (10 domestic, 15 countries / 30 cities)
 * are checked by the content completeness unit test (UNIT-CONTENT-DATA, REQ-FUNC-074).
 */

export type Scope = "domestic" | "overseas";

/** ISO 3166-1 alpha-2 */
export type CountryCode =
  | "KR"
  | "JP"
  | "TW"
  | "TH"
  | "VN"
  | "SG"
  | "ID"
  | "PH"
  | "MY"
  | "FR"
  | "IT"
  | "ES"
  | "GB"
  | "US"
  | "AU"
  | "NZ";

export type ThemeId = "beach" | "city" | "history" | "food" | "nature" | "weekend";
export type Season = "spring" | "summer" | "autumn" | "winter";
/** Recommended trip length */
export type TripLength = "1-2days" | "3-4days" | "5plus";

export type AtLeast1<T> = [T, ...T[]];
export type AtLeast2<T> = [T, T, ...T[]];
export type AtLeast3<T> = [T, T, T, ...T[]];
export type AtLeast5<T> = [T, T, T, T, T, ...T[]];

export type HttpsUrl = `https://${string}`;
/** YYYY-MM-DD */
export type IsoDate = `${number}-${number}-${number}`;

/** Internet image URL plus alt text describing the real place (no license workflow, DEC-018). */
export type ContentImage = { src: HttpsUrl; alt: string };

export type SourceLink = { label: string; url: HttpsUrl };

export type Country = {
  code: CountryCode;
  nameKo: string;
  nameEn: string;
  scope: Scope;
  /** Continent or area label for grouping */
  area: string;
};

export type Theme = { id: ThemeId; label: string; description: string };

export type Attraction = { name: string; description: string };

export type ItineraryStop = { time: string; plan: string };
export type DayPlan = { title: string; plan: string };

export type Itinerary = {
  oneDay: AtLeast3<ItineraryStop>;
  threeDay: [DayPlan, DayPlan, DayPlan];
};

/** Categorical budget per person per day, with and without lodging. */
export type Budget = { withoutLodging: string; withLodging: string; note: string };

export type Transport = { arrival: string; local: string; payment: string };

export type Food = { name: string; description: string; caution?: string };

export type Destination = {
  slug: string;
  name: string;
  nameEn: string;
  scope: Scope;
  countryCode: CountryCode;
  /** Region / province label shown under the name */
  region: string;
  /** One-line card summary */
  summary: string;
  /** 300+ characters, including who it suits */
  intro: string;
  recommendedFor: string;
  themes: AtLeast2<ThemeId>;
  seasons: AtLeast1<Season>;
  bestTime: string;
  avoidTime: string;
  duration: TripLength;
  image: ContentImage;
  attractions: AtLeast5<Attraction>;
  itinerary: Itinerary;
  budget: Budget;
  transport: Transport;
  foods: AtLeast3<Food>;
  etiquette: AtLeast3<string>;
  sources: AtLeast1<SourceLink>;
  updatedAt: IsoDate;
};
