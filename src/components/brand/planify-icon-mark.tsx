import { cn } from "@/lib/utils";

export const BRAND_NAVY = "#001B44";
export const BRAND_GOLD = "#B38E5D";

type PlanifyIconMarkProps = {
  className?: string;
  /** Render width in CSS pixels (height matches — square) */
  size: number;
};

/**
 * Reference-accurate Planify app icon: squircle, gold frame, circuit nodes,
 * white checkmark breaking through the top-right with motion accent.
 */
export function PlanifyIconMark({ size, className }: PlanifyIconMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("block shrink-0", className)}
    >
      <rect width="100" height="100" rx="22" fill={BRAND_NAVY} />
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        rx="12"
        stroke={BRAND_GOLD}
        strokeWidth="2.5"
        fill="none"
      />
      {/* Top-left circuit */}
      <path
        d="M26 26 L31 38"
        stroke={BRAND_GOLD}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="26" cy="23.5" r="2.5" fill={BRAND_GOLD} />
      {/* Bottom-right circuits */}
      <path
        d="M74 74 L69 62"
        stroke={BRAND_GOLD}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="76" cy="76.5" r="2.5" fill={BRAND_GOLD} />
      <path
        d="M74 74 L80 66"
        stroke={BRAND_GOLD}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="82" cy="64" r="2.5" fill={BRAND_GOLD} />
      {/* Checkmark — navy outline for overlap, then white */}
      <path
        d="M34 54 L48 72 L84 34"
        stroke={BRAND_NAVY}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 54 L48 72 L84 34"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M76 38 L88 24"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

type PlanifyBrandLockupProps = {
  className?: string;
  /** Total width in CSS pixels */
  width?: number;
  slogan?: string;
  onDark?: boolean;
};

/**
 * Full brand lockup (icon + PLANIFY) as one SVG — avoids flex/inline clipping.
 */
export function PlanifyBrandLockup({
  width = 240,
  className,
  slogan,
  onDark,
}: PlanifyBrandLockupProps) {
  const height = width * (slogan ? 1.28 : 1.12);
  const iconSize = width * 0.42;
  const iconX = (width - iconSize) / 2;
  const textY = iconSize + width * 0.14;
  const letterColor = onDark ? "#FFFFFF" : BRAND_NAVY;
  const fontSize = width * 0.155;
  const sloganSize = width * 0.048;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Planify"
      className={cn("mx-auto block max-w-full", className)}
    >
      <svg
        x={iconX}
        y={0}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
      >
        <rect width="100" height="100" rx="22" fill={BRAND_NAVY} />
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="12"
          stroke={BRAND_GOLD}
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M26 26 L31 38"
          stroke={BRAND_GOLD}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="26" cy="23.5" r="2.5" fill={BRAND_GOLD} />
        <path
          d="M74 74 L69 62"
          stroke={BRAND_GOLD}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="76" cy="76.5" r="2.5" fill={BRAND_GOLD} />
        <path
          d="M74 74 L80 66"
          stroke={BRAND_GOLD}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="82" cy="64" r="2.5" fill={BRAND_GOLD} />
        <path
          d="M34 54 L48 72 L84 34"
          stroke={BRAND_NAVY}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 54 L48 72 L84 34"
          stroke="#FFFFFF"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M76 38 L88 24"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {(() => {
        const startX = (width - fontSize * 5.6) / 2;
        const aX = startX + fontSize * 1.38;
        const nifyX = startX + fontSize * 2.05;
        return (
          <>
            <text
              x={startX}
              y={textY}
              fill={letterColor}
              fontFamily="Montserrat, Inter, ui-sans-serif, system-ui, sans-serif"
              fontWeight="800"
              fontSize={fontSize}
              letterSpacing="0.08em"
            >
              PL
            </text>
            <g transform={`translate(${aX}, ${textY - fontSize * 0.78}) scale(${fontSize / 32})`}>
              <path
                d="M5 30 L16 6 L27 30"
                stroke={BRAND_GOLD}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="16" cy="25" r="2" fill={BRAND_GOLD} />
            </g>
            <text
              x={nifyX}
              y={textY}
              fill={letterColor}
              fontFamily="Montserrat, Inter, ui-sans-serif, system-ui, sans-serif"
              fontWeight="800"
              fontSize={fontSize}
              letterSpacing="0.08em"
            >
              NIFY
            </text>
          </>
        );
      })()}
      {slogan ? (
        <text
          x={width / 2}
          y={textY + width * 0.11}
          textAnchor="middle"
          fill={onDark ? "rgba(255,255,255,0.7)" : "#64748b"}
          fontFamily="Montserrat, Inter, ui-sans-serif, system-ui, sans-serif"
          fontWeight="600"
          fontSize={sloganSize}
          letterSpacing="0.18em"
        >
          {slogan.toUpperCase()}
        </text>
      ) : null}
    </svg>
  );
}
