import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const BRAND_NAVY = "#001B44";
const BRAND_GOLD = "#B38E5D";

const ICON_SIZES = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
} as const;

const WORD_SIZES = {
  xs: "text-base",
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
} as const;

export type PlanifyLogoProps = {
  /** `full` icon + wordmark; `icon` only; `lockup` stacked icon, wordmark, optional slogan */
  variant?: "full" | "icon" | "lockup";
  size?: keyof typeof ICON_SIZES;
  slogan?: string;
  className?: string;
  href?: string;
  onDark?: boolean;
};

function StylizedA({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 32"
      aria-hidden
      className={cn("inline-block h-[0.92em] w-[0.62em] align-[-0.08em]", className)}
    >
      <path
        d="M3 28 L14 4 L25 28"
        stroke={BRAND_GOLD}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="14" cy="23.5" r="2.1" fill={BRAND_GOLD} />
    </svg>
  );
}

function Wordmark({
  size,
  onDark,
}: {
  size: keyof typeof ICON_SIZES;
  onDark?: boolean;
}) {
  const letterColor = onDark ? "#FFFFFF" : BRAND_NAVY;

  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline font-extrabold uppercase leading-none tracking-[0.1em]",
        WORD_SIZES[size],
      )}
      style={{ color: letterColor }}
    >
      <span>PL</span>
      <StylizedA />
      <span>NIFY</span>
    </span>
  );
}

export function PlanifyIcon({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof ICON_SIZES;
}) {
  return (
    <img
      src="/brand/planify-icon.svg"
      alt=""
      aria-hidden
      className={cn("shrink-0", ICON_SIZES[size], className)}
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

  const content = (
    <span
      className={cn(
        "inline-flex",
        isLockup
          ? "flex-col items-center gap-3 text-center"
          : "items-center gap-2.5",
        className,
      )}
    >
      <PlanifyIcon size={size} />
      {variant !== "icon" && (
        <span className={cn(isLockup && "flex flex-col items-center gap-1")}>
          <Wordmark size={size} onDark={onDark} />
          {isLockup && slogan && (
            <span
              className={cn(
                "font-display text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs",
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
      <Link to={href} className="focus-ring w-fit rounded-lg" aria-label="Planify home">
        {content}
      </Link>
    );
  }

  return content;
}
