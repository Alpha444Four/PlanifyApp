import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BRAND_BORDER =
  "linear-gradient(45deg, #1E3A8A, #4D6FD4, #C9A86C, #E8D4B0, #1E3A8A) 1";

interface NestedSquaresProps {
  className?: string;
}

export function NestedSquares({ className }: NestedSquaresProps) {
  const squares = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div
      className={cn(
        "relative flex h-full w-full min-h-[28rem] min-w-[28rem] items-center justify-center",
        className,
      )}
    >
      {squares.map((index) => {
        const padding = (index + 1) * 10;
        const delay = index * 0.1;

        return (
          <motion.div
            key={index}
            className="absolute border-2 border-transparent"
            style={{
              padding: `${padding}px`,
              borderImage: BRAND_BORDER,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 2, rotate: 180 }}
            transition={{
              duration: 2,
              delay,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </div>
  );
}

/** Full-width landing hero backdrop */
export function BloomHeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(100vh,860px)] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.35] dark:opacity-[0.28]">
        <div className="h-[min(90vw,720px)] w-[min(90vw,720px)]">
          <NestedSquares className="h-full w-full min-h-0 min-w-0" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
    </div>
  );
}
