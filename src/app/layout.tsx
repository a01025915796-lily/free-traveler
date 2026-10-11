import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { PolicyDialog } from "@/components/policy/PolicyDialog";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

// Korean text falls back to system fonts listed in --font-sans (globals.css).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Traveler — 여행지·안전정보·동행을 한곳에서",
    template: "%s | Free Traveler",
  },
  description:
    "여행지를 고르고, 항공·숙소 조건을 정리하고, 국가별 안전정보와 여행 동행을 확인하는 여행 준비 공간입니다.",
  applicationName: "Free Traveler",
  openGraph: {
    type: "website",
    siteName: "Free Traveler",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <ToastProvider>
          <SkipLink />
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <PolicyDialog />
        </ToastProvider>
      </body>
    </html>
  );
}
