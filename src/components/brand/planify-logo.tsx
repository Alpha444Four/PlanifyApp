import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BRAND_GOLD,
  BRAND_NAVY,
  PlanifyBrandLockup,
  PlanifyIconMark,
} from "@/components/brand/planify-icon-mark";

const ICON_PX = {
  xs: 28,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
} as const;

const LOCKUP_WIDTH = {
  xs: 140,
  sm: 168,
  md: 200,
  lg: 240,
  xl: 280,
} as const;

const WORD_SIZES = {
  xs: "text-base",
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
} as const;

export type PlanifyLogoProps = {
  variant?: "full" | "icon" | "lockup";
  size?: keyof typeof ICON_PX;
  slogan?: string;
  className?: string;
  href?: string;
  onDark?: boolean;
};

function StylizedA({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-2 -2 32 36"
      aria-hidden
      className={cn(
        "block h-[1em] w-[0.68em] shrink-0",
        className,
      )}
    >
      <path
        d="M5 30 L16 6 L27 30"
        stroke={BRAND_GOLD}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="16" cy="25" r="2" fill={BRAND_GOLD} />
    </svg>
  );
}

function Wordmark({
  size,
  onDark,
}: {
  size: keyof typeof ICON_PX;
  onDark?: boolean;
}) {
  const letterColor = onDark ? "#FFFFFF" : BRAND_NAVY;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0 font-display text-base font-extrabold uppercase leading-none tracking-[0.08em]",
        WORD_SIZES[size],
      )}
      style={{ color: letterColor }}
    >
      <span className="shrink-0">PL</span>
      <StylizedA />
      <span className="shrink-0">NIFY</span>
    </span>
  );
}

export function PlanifyIcon({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof ICON_PX;
}) {
  return (
    <PlanifyIconMark
      size={ICON_PX[size]}
      className={className}
    />
  );
}

export function PlanifyLogo({
  variant = "full",
  size = "md",
  slogan,
  className,
  href,
  onDark,
}: PlanifyLogoProps) {
  const isLockup = variant === "lockup";

  if (isLockup) {
    const lockup = (
      <PlanifyBrandLockup
        width={LOCKUP_WIDTH[size]}
        slogan={slogan}
        onDark={onDark}
        className={className}
      />
    );
    if (href) {
      return (
        <Link
          to={href}
          className="focus-ring inline-block rounded-lg"
          aria-label="Planify home"
        >
          {lockup}
        </Link>
      );
    }
    return lockup;
  }

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        className,
      )}
    >
      <PlanifyIcon size={size} />
      {variant !== "icon" && <Wordmark size={size} onDark={onDark} />}
    </span>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="focus-ring inline-flex rounded-lg"
        aria-label="Planify home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
