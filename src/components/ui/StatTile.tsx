/** Stat tile: big number (stat) + label + one-line description on surface-soft, no border. */
export function StatTile({ value, label, description }: { value: string; label: string; description?: string }) {
  return (
    <div className="rounded-card bg-surface-soft p-6">
      <p className="text-stat text-ink">{value}</p>
      <p className="mt-1 text-body-sm font-semibold text-ink">{label}</p>
      {description ? <p className="mt-1 text-body-sm text-body">{description}</p> : null}
    </div>
  );
}
