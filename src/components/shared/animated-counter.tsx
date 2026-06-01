import { useEffect, useState } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

/**
 * AnimatedCounter — smoothly counts from 0 up to `value` (~800ms).
 * - Clean number formatting with thousands separators.
 * - Optional decimals and a suffix/unit.
 * - Respects prefers-reduced-motion (jumps straight to the value).
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 0.8,
  suffix,
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, duration, motionValue, prefersReducedMotion]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
