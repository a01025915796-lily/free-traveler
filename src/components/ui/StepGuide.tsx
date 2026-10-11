export type Step = { title: string; description: string };

type StepGuideProps = {
  steps: readonly Step[];
  /** Accessible name for the list, e.g. "동행 신청 3단계". */
  label: string;
  className?: string;
};

/** Numbered steps: 32px ink-outlined number + title + one sentence. 3 columns on desktop, stacked on mobile. */
export function StepGuide({ steps, label, className = "" }: StepGuideProps) {
  return (
    <ol aria-label={label} className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-pill border border-ink text-caption text-ink"
          >
            {index + 1}
          </span>
          <div>
            <p className="text-title-sm">
              <span className="sr-only">{index + 1}단계: </span>
              {step.title}
            </p>
            <p className="mt-1 text-body-sm text-body">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
