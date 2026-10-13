"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Tabs, panelId, tabId } from "@/components/ui/Tabs";

export type ToolTab = "flight" | "hotel" | "mate";

export const TOOL_TABS = [
  { id: "flight", label: "항공편" },
  { id: "hotel", label: "숙소" },
  { id: "mate", label: "동행 구하기" },
] as const satisfies readonly { id: ToolTab; label: string }[];

const ID_BASE = "travel-tools";

export function parseToolTab(value: string | null | undefined): ToolTab {
  return value === "hotel" || value === "mate" ? value : "flight";
}

type ToolsTabsProps = {
  /** Content per tab. All panels stay mounted so each tab keeps its own input state. */
  panels: Record<ToolTab, ReactNode>;
};

function ToolsTabsInner({ panels }: ToolsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = parseToolTab(params.get("tab"));

  // Only the tab name goes to the URL; ?edit is kept only on the mate tab. No input values.
  const select = (tab: ToolTab) => {
    const next = new URLSearchParams();
    next.set("tab", tab);
    const edit = params.get("edit");
    if (tab === "mate" && edit) next.set("edit", edit);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="sticky top-header-mobile z-30 border-b border-hairline bg-white md:top-header">
        <div className="mx-auto max-w-content px-page-x">
          <Tabs items={TOOL_TABS} value={active} onChange={select} label="여행 준비 도구" idBase={ID_BASE} className="border-b-0" />
        </div>
      </div>
      {TOOL_TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(ID_BASE, tab.id)}
          aria-labelledby={tabId(ID_BASE, tab.id)}
          hidden={tab.id !== active}
        >
          {panels[tab.id]}
        </div>
      ))}
    </>
  );
}

/**
 * Section 2: tabs 항공편 / 숙소 / 동행 구하기 (?tab=flight|hotel|mate, default flight), sticky
 * under the header, horizontal scroll on mobile. Reads the query inside its own Suspense.
 */
export function ToolsTabs({ panels }: ToolsTabsProps) {
  return (
    <Suspense fallback={<div className="h-12 border-b border-hairline bg-white" aria-hidden="true" />}>
      <ToolsTabsInner panels={panels} />
    </Suspense>
  );
}
