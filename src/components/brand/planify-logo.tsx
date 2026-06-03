import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const BRAND_NAVY = "#001B44";
const BRAND_GOLD = "#B38E5D";

/** Icon size in navigation, topbar, sidebar */
const ICON_PX = {
  xs: 28,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
} as const;

/** Larger icon for stacked hero lockups */
const LOCKUP_ICON_PX = {
  xs: 44,
  sm: 52,
  md: 64,
  lg: 80,
  xl: 96,
} as const;

const WORD_SIZES = {
  xs: "text-base",
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
} as const;

const LOCKUP_WORD_SIZES = {
  xs: "text-lg",
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl sm:text-5xl",
} as const;

export type PlanifyLogoProps = {
  variant?: "full" | "icon" | "lockup";
  size?: keyof typeof ICON_PX;
  slogan?: string;
  className?: string;
  href?: string;
  onDark?: boolean;
};

function PlanifyIconSvg({
  px,
  className,
}: {
  px: number;
  className?: string;
}) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="-4 -4 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0 overflow-visible", className)}
    >
      <rect x="0" y="0" width="64" height="64" rx="14" fill={BRAND_NAVY} />
      <rect
        x="13"
        y="13"
        width="38"
        height="38"
        rx="8"
        stroke={BRAND_GOLD}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M19 18v8"
        stroke={BRAND_GOLD}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="19" cy="16" r="1.85" fill={BRAND_GOLD} />
      <path
        d="M45 46V38"
        stroke={BRAND_GOLD}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="45" cy="48" r="1.85" fill={BRAND_GOLD} />
      <path
        d="M24 35.5 31.5 44.5 42 26"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M39.5 25 45.5 19"
        stroke="#FFFFFF"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StylizedA({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-2 -2 32 36"
      aria-hidden
      className={cn(
        "inline-block h-[1em] w-[0.68em] shrink-0 overflow-visible",
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
  lockup,
  onDark,
}: {
  size: keyof typeof ICON_PX;
  lockup?: boolean;
  onDark?: boolean;
}) {
  const letterColor = onDark ? "#FFFFFF" : BRAND_NAVY;

  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-0 overflow-visible py-0.5",
        "font-extrabold uppercase leading-[1.15] tracking-[0.08em]",
        lockup ? LOCKUP_WORD_SIZES[size] : WORD_SIZES[size],
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
  lockup = false,
}: {
  className?: string;
  size?: keyof typeof ICON_PX;
  lockup?: boolean;
}) {
  const px = lockup ? LOCKUP_ICON_PX[size] : ICON_PX[size];
  return <PlanifyIconSvg px={px} className={className} />;
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

  const content = (
    <span
      className={cn(
        "inline-flex overflow-visible",
        isLockup
          ? "flex-col items-center gap-4 text-center"
          : "items-center gap-2.5",
        className,
      )}
    >
      <PlanifyIcon size={size} lockup={isLockup} />
      {variant !== "icon" && (
        <span
          className={cn(
            "overflow-visible",
            isLockup && "flex flex-col items-center gap-1.5",
          )}
        >
          <Wordmark size={size} lockup={isLockup} onDark={onDark} />
          {isLockup && slogan && (
            <span
              className={cn(
                "max-w-xs font-display text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] sm:text-xs",
                onDark ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {slogan}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="focus-ring inline-flex overflow-visible rounded-lg"
        aria-label="Planify home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
