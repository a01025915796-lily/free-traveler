import { Badge } from "@/components/ui/Badge";
import type { AdvisoryLevel } from "@/data/safety";
import { advisoryLabel, advisoryTone } from "@/lib/safety/stale";

/** Travel advisory badge: semantic color + icon + MOFA level name (never color alone). */
export function AdvisoryBadge({ level }: { level: AdvisoryLevel }) {
  return <Badge tone={advisoryTone(level)}>{advisoryLabel(level)}</Badge>;
}

/** Freshness badge: "최신" while fresh, "재확인 권장" once stale (the "최신" badge is hidden). */
export function FreshnessBadge({ stale }: { stale: boolean }) {
  return stale ? <Badge tone="warning">재확인 권장</Badge> : <Badge tone="success">최신</Badge>;
}
