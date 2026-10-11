import type { ReactNode } from "react";
import { Button } from "./Button";

export type EmptyStateAction = { label: string; href: string } | { label: string; onClick: () => void };

type EmptyStateProps = {
  title: string;
  /** Reason and how to proceed, 1–2 sentences. */
  description: string;
  primary: EmptyStateAction;
  secondary: EmptyStateAction;
  icon?: ReactNode;
  /** Heading level for the title inside the surrounding section. */
  headingLevel?: "h2" | "h3";
  /** Extra content such as a StepGuide. */
  children?: ReactNode;
  className?: string;
};

function renderAction(action: EmptyStateAction, variant: "primary" | "secondary") {
  return "href" in action ? (
    <Button href={action.href} variant={variant}>
      {action.label}
    </Button>
  ) : (
    <Button onClick={action.onClick} variant={variant}>
      {action.label}
    </Button>
  );
}

function DefaultIcon() {
  return (
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="20" cy="20" r="15" />
      <path d="m26 14-4 8-8 4 4-8 8-4Z" />
    </svg>
  );
}

/** Complete empty state: icon + title + reason/usage + primary and secondary CTA (all required). */
export function EmptyState({
  title,
  description,
  primary,
  secondary,
  icon,
  headingLevel = "h3",
  children,
  className = "",
}: EmptyStateProps) {
  const Heading = headingLevel;
  return (
    <div className={`flex flex-col items-center rounded-card border border-hairline bg-white px-6 py-10 text-center ${className}`}>
      <span className="text-muted">{icon ?? <DefaultIcon />}</span>
      <Heading className="mt-4 text-title-sm">{title}</Heading>
      <p className="mt-2 max-w-(--container-prose) text-body-md text-body">{description}</p>
      {children ? <div className="mt-6 w-full">{children}</div> : null}
      <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {renderAction(primary, "primary")}
        {renderAction(secondary, "secondary")}
      </div>
    </div>
  );
}
