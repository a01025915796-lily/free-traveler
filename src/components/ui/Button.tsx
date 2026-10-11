import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

const base =
  "inline-flex h-12 min-w-11 items-center justify-center gap-2 rounded-control px-5 text-button transition-colors";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover",
  secondary: "border border-ink bg-white text-ink hover:bg-surface-soft",
  tertiary: "px-2 text-ink underline-offset-4 hover:underline",
};

const disabledClass = "cursor-not-allowed bg-surface-strong text-muted border-transparent hover:bg-surface-strong hover:no-underline";

function NewTabIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2.5h4.5V7M13.5 2.5 7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
    </svg>
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  /** Opens in a new tab with noopener,noreferrer and announces "(새 탭에서 열림)". */
  external?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * D-001 Button: 48px high. Primary (coral), Secondary (ink border), Tertiary (text).
 * Disabled uses aria-disabled so it stays focusable and is announced.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", fullWidth, className = "", children } = props;
  const isDisabled = Boolean(props.disabled);
  const cls = [base, variants[variant], isDisabled ? disabledClass : "", fullWidth ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");

  if (props.href !== undefined) {
    const { href, external, onClick } = props;
    if (isDisabled) {
      return (
        <span role="link" aria-disabled="true" className={cls}>
          {children}
        </span>
      );
    }
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
          {children}
          <NewTabIcon />
          <span className="sr-only">(새 탭에서 열림)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { variant: _v, fullWidth: _f, className: _c, children: _ch, disabled, onClick, type, ...rest } = props;
  void _v;
  void _f;
  void _c;
  void _ch;
  return (
    <button
      {...rest}
      type={type ?? "button"}
      aria-disabled={disabled ? true : undefined}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      className={cls}
    >
      {children}
    </button>
  );
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> & {
  /** Accessible name; required because the button has no visible text. */
  label: string;
  icon: ReactNode;
  tone?: "plain" | "on-photo";
};

/** 44×44px icon-only button with a required accessible label. */
export function IconButton({ label, icon, tone = "plain", className = "", type, ...rest }: IconButtonProps) {
  const toneClass =
    tone === "on-photo" ? "on-photo bg-white text-ink shadow-raised hover:bg-surface-soft" : "text-ink hover:bg-surface-soft";
  return (
    <button
      {...rest}
      type={type ?? "button"}
      aria-label={label}
      className={`inline-flex size-11 items-center justify-center rounded-pill ${toneClass} ${className}`}
    >
      {icon}
    </button>
  );
}
