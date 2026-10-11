import type { ReactNode } from "react";

type CtaBannerProps = {
  title: string;
  description: string;
  /** One or two Buttons. */
  actions: ReactNode;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** surface-soft rounded box: title + description on the left, 1–2 buttons on the right (stacked full width on mobile). */
export function CtaBanner({ title, description, actions, headingLevel = "h2", className = "" }: CtaBannerProps) {
  const Heading = headingLevel;
  return (
    <div
      className={`flex flex-col gap-6 rounded-card bg-surface-soft p-6 md:flex-row md:items-center md:justify-between md:p-10 ${className}`}
    >
      <div className="max-w-(--container-prose)">
        <Heading className="text-title-lg">{title}</Heading>
        <p className="mt-3 text-body-md text-body">{description}</p>
      </div>
      <div className="flex flex-col gap-3 [&>*]:w-full md:flex-row md:[&>*]:w-auto">{actions}</div>
    </div>
  );
}
