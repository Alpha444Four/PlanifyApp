import { Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScanSourceMode = "live" | "import";

export function ScanSourceToggle({
  mode,
  onChange,
  liveLabel,
  importLabel,
  disabled,
  className,
}: {
  mode: ScanSourceMode;
  onChange: (mode: ScanSourceMode) => void;
  liveLabel: string;
  importLabel: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md rounded-2xl border border-border bg-muted/50 p-1",
        className,
      )}
      role="tablist"
      aria-label="Scan source"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "live"}
        disabled={disabled}
        onClick={() => onChange("live")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
          mode === "live"
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <Camera className="h-4 w-4 shrink-0" />
        {liveLabel}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "import"}
        disabled={disabled}
        onClick={() => onChange("import")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
          mode === "import"
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <ImageIcon className="h-4 w-4 shrink-0" />
        {importLabel}
      </button>
    </div>
  );
}
