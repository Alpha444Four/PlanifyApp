import { useRef } from "react";
import { cn } from "@/lib/utils";

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  const setAt = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d.trim())).join("").slice(0, length);
    onChange(next.replace(/\s/g, ""));
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digits[i]?.trim() ?? ""}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "focus-ring h-12 w-11 rounded-xl border border-border bg-card text-center text-lg font-bold",
            "transition focus:border-primary",
          )}
          onChange={(e) => {
            const c = e.target.value.replace(/\D/g, "").slice(-1);
            setAt(i, c);
            if (c && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i]?.trim() && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}
