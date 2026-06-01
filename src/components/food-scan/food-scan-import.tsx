import { ImageIcon, ScanLine, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface FoodScanImportProps {
  previewUrl: string | null;
  hint: string;
  chooseLabel: string;
  analyzeLabel: string;
  changeLabel: string;
  analyzingLabel?: string;
  analyzing?: boolean;
  disabled?: boolean;
  onChoose: () => void;
  onAnalyze: () => void;
  className?: string;
}

export function FoodScanImport({
  previewUrl,
  hint,
  chooseLabel,
  analyzeLabel,
  changeLabel,
  analyzingLabel,
  analyzing = false,
  disabled = false,
  onChoose,
  onAnalyze,
  className,
}: FoodScanImportProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[min(72dvh,720px)] w-full flex-col overflow-hidden rounded-2xl border-2 border-dashed border-primary/25 bg-muted/30",
        className,
      )}
    >
      {analyzing && previewUrl ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <p className="text-sm font-medium text-white">{analyzingLabel}</p>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=""
            className="max-h-[min(50dvh,480px)] w-full rounded-2xl object-contain shadow-soft"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <ImageIcon className="h-10 w-10" />
          </span>
        )}

        <p className="max-w-xs text-center text-sm text-muted-foreground">
          {hint}
        </p>

        <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onChoose}
            disabled={disabled}
          >
            <Upload className="h-4 w-4" />
            {previewUrl ? changeLabel : chooseLabel}
          </Button>

          {previewUrl ? (
            <Button
              type="button"
              variant="gradient"
              className="flex-1"
              onClick={onAnalyze}
              disabled={disabled}
            >
              <ScanLine className="h-4 w-4" />
              {analyzeLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
