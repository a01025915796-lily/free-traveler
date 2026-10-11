"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

export type TabItem<T extends string> = { id: T; label: string };

type TabsProps<T extends string> = {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Accessible name of the tab list. */
  label: string;
  /** Prefix shared with <TabPanel idBase>; defaults to a generated id. */
  idBase?: string;
  className?: string;
};

export function tabId(idBase: string, id: string) {
  return `${idBase}-tab-${id}`;
}
export function panelId(idBase: string, id: string) {
  return `${idBase}-panel-${id}`;
}

/**
 * Text tabs with a 2px ink underline on the active tab. role="tablist", roving tabindex,
 * Left/Right/Home/End move and activate. Overflows horizontally on mobile.
 * The selected value is controlled so it can be stored in a URL query (e.g. ?tab=hotel).
 */
export function Tabs<T extends string>({ items, value, onChange, label, idBase, className = "" }: TabsProps<T>) {
  const generated = useId();
  const base = idBase ?? generated;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (index: number) => {
    const next = (index + items.length) % items.length;
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") move(index + 1);
    else if (event.key === "ArrowLeft") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div role="tablist" aria-label={label} className={`flex overflow-x-auto border-b border-hairline ${className}`}>
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={tabId(base, item.id)}
            aria-selected={selected}
            aria-controls={panelId(base, item.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`-mb-px h-12 shrink-0 whitespace-nowrap border-b-2 px-4 text-button ${
              selected ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

type TabPanelProps = {
  idBase: string;
  id: string;
  children: ReactNode;
  className?: string;
};

/** Panel linked to a tab via aria-labelledby. Render only the active panel. */
export function TabPanel({ idBase, id, children, className = "" }: TabPanelProps) {
  return (
    <div role="tabpanel" id={panelId(idBase, id)} aria-labelledby={tabId(idBase, id)} tabIndex={0} className={className}>
      {children}
    </div>
  );
}
