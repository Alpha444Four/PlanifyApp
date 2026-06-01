import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  /** `full` icon + wordmark; `icon` only; `lockup` includes slogan */
  variant?: "full" | "icon" | "lockup";
  size?: keyof typeof ICON_SIZES;
  slogan?: string;
  className?: string;
  href?: string;
  onDark?: boolean;
};

function Wordmark({
  size,
  onDark,
}: {
  size: keyof typeof ICON_SIZES;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display font-extrabold uppercase leading-none tracking-[0.12em]",
        WORD_SIZES[size],
        onDark ? "text-white" : "text-[#1E3A8A] dark:text-white",
      )}
    >
      PL
      <span className="relative inline-block">
        A
        <span
          aria-hidden
          className="absolute left-1/2 top-[0.42em] h-[0.2em] w-[0.2em] -translate-x-1/2 rounded-full bg-[#C9A86C]"
        />
      </span>
      NIFY
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
      className={cn("shrink-0 rounded-[22%] shadow-glow", ICON_SIZES[size], className)}
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
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        variant === "lockup" && "flex-col items-start gap-1.5",
        className,
      )}
    >
      <PlanifyIcon size={size} />
      {variant !== "icon" && (
        <span
          className={cn(
            variant === "lockup" && "flex flex-col gap-0.5",
            variant === "lockup" && className?.includes("items-center")
              ? "items-center text-center"
              : variant === "lockup" && "items-start",
          )}
        >
          <Wordmark size={size} onDark={onDark} />
          {variant === "lockup" && slogan && (
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
