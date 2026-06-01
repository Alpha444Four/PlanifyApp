import { motion, useReducedMotion } from "framer-motion";

export function ProgressRing({
  value,
  max = 100,
  size = 88,
  stroke = 8,
  label,
  sublabel,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={prefersReducedMotion ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold leading-none">
            {Math.round(pct)}%
          </span>
          {sublabel && (
            <span className="mt-0.5 text-[10px] text-muted-foreground">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      )}
    </div>
  );
}
