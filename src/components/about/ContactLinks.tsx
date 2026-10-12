import { visibleContactLinks, type ContactLink } from "@/data/curator";

const ICONS: Record<ContactLink["kind"], string> = {
  email: "M3 6h14v9H3zM3 6l7 5 7-5",
  instagram: "M5 3h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM14.5 5.5v.01",
  youtube: "M3 6.5C3 5 4 4 5.5 4h9C16 4 17 5 17 6.5v7c0 1.5-1 2.5-2.5 2.5h-9C4 16 3 15 3 13.5zM8.5 7.5v5l4-2.5z",
  blog: "M4 16l1-4 8-8 3 3-8 8-4 1ZM11 6l3 3",
};

/**
 * Contact / SNS icon links (44px). Only non-empty https: or mailto: values are rendered,
 * so missing links leave no gap. External links open in a new tab.
 */
export function ContactLinks() {
  const links = visibleContactLinks();
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="문의·SNS">
      {links.map((link) => {
        const external = link.href.startsWith("https://");
        return (
          <li key={link.kind}>
            <a
              href={link.href}
              aria-label={`${link.label}${external ? " (새 탭에서 열림)" : ""}`}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex size-11 items-center justify-center rounded-pill border border-hairline bg-white text-ink hover:border-ink"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                <path d={ICONS[link.kind]} />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
