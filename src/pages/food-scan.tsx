import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, RefreshCw } from "lucide-react";
import { FoodScanCamera } from "@/components/food-scan/food-scan-camera";
import { FoodScanImport } from "@/components/food-scan/food-scan-import";
import {
  ScanSourceToggle,
  type ScanSourceMode,
} from "@/components/food-scan/scan-source-toggle";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/hooks/use-i18n";
import {
  analyzeFoodImage,
  FoodScanError,
  type FoodScanResult,
} from "@/services/food-scanner-service";
import { usePlan } from "@/hooks/use-plan";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { useUserDataStore } from "@/store/user-data-store";

type Phase = "capture" | "analyzing" | "result";

function toMacros(result: FoodScanResult, t: (key: string) => string) {
  return [
    { label: t("dashboard.protein"), value: result.protein, unit: "g", color: "from-emerald-500 to-teal-500" },
    { label: t("foodScan.carbs"), value: result.carbs, unit: "g", color: "from-sky-500 to-cyan-500" },
    { label: t("foodScan.fat"), value: result.fats, unit: "g", color: "from-amber-500 to-orange-500" },
  ];
}

function scanErrorMessage(code: FoodScanError["code"], t: (key: string) => string): string {
  switch (code) {
    case "NO_IMAGE":
      return t("foodScan.needPhoto");
    case "INVALID_IMAGE":
      return t("foodScan.invalidImage");
    case "FILE_TOO_LARGE":
      return t("foodScan.fileTooLarge");
    default:
      return t("foodScan.scanFailed");
  }
}

export default function FoodScanPage() {
  const [sourceMode, setSourceMode] = useState<ScanSourceMode>("live");
  const [phase, setPhase] = useState<Phase>("capture");
  const [result, setResult] = useState<FoodScanResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useI18n();
  const saveScannedMeal = useUserDataStore((s) => s.saveScannedMeal);
  const recordFoodScan = useUserDataStore((s) => s.recordFoodScan);
  const { canScanFood, isPaid, scanRemaining } = usePlan();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setPreviewFromFile = (file: File) => {
    setPendingFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const resetScan = () => {
    setPhase("capture");
    setResult(null);
    setPendingFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const runAnalysis = async (file: File) => {
    if (!canScanFood) {
      toast({
        title: t("plans.scanLimitReached"),
        description: t("plans.scanLimitDesc"),
        variant: "warning",
      });
      return;
    }
    setPhase("analyzing");
    setResult(null);
    try {
      const scan = await analyzeFoodImage(file);
      if (!recordFoodScan()) {
        setPhase("capture");
        toast({
          title: t("plans.scanLimitReached"),
          description: t("plans.scanLimitDesc"),
          variant: "warning",
        });
        return;
      }
      setResult(scan);
      setPhase("result");
    } catch (e) {
      setPhase("capture");
      const message =
        e instanceof FoodScanError
          ? scanErrorMessage(e.code, t)
          : t("foodScan.scanFailed");
      toast({ title: t("foodScan.scanFailed"), description: message, variant: "warning" });
    }
  };

  const onCameraCapture = (file: File) => {
    setPreviewFromFile(file);
    void runAnalysis(file);
  };

  const onImportFile = (file: File | undefined) => {
    if (!file) return;
    setPreviewFromFile(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onImportAnalyze = () => {
    if (!pendingFile) {
      toast({ title: t("foodScan.title"), description: t("foodScan.needPhoto"), variant: "info" });
      fileRef.current?.click();
      return;
    }
    void runAnalysis(pendingFile);
  };

  const handleModeChange = (mode: ScanSourceMode) => {
    if (phase !== "capture") return;
    setSourceMode(mode);
    if (mode === "live") {
      setPendingFile(null);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  };

  const liveCameraActive =
    sourceMode === "live" && (phase === "capture" || phase === "analyzing");
  const showToggle = phase === "capture";

  if (!canScanFood && !isPaid && phase === "capture") {
    return (
      <div className="space-y-5">
        <PageHeader title={t("foodScan.title")} description={t("foodScan.subtitle")} />
        <UpgradePrompt
          title={t("plans.scanLimitReached")}
          description={t("plans.scanLimitDesc")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("foodScan.title")}
        description={phase === "result" ? t("foodScan.subtitle") : undefined}
        className="hidden sm:block"
      />

      <div className="-mx-4 sm:-mx-6 lg:mx-0">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="space-y-3 px-4 lg:px-0">
            {!isPaid && phase === "capture" ? (
              <p className="text-center text-xs text-muted-foreground">
                {t("plans.remainingToday", { count: scanRemaining })}
              </p>
            ) : null}

            {showToggle ? (
              <ScanSourceToggle
                mode={sourceMode}
                onChange={handleModeChange}
                liveLabel={t("foodScan.modeLive")}
                importLabel={t("foodScan.modeImport")}
              />
            ) : null}

            <AnimatePresence mode="wait">
              {sourceMode === "live" ? (
                <motion.div
                  key="live"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <FoodScanCamera
                    active={liveCameraActive}
                    freezeSrc={phase !== "capture" ? previewUrl : null}
                    scanning={phase === "analyzing"}
                    hint={t("foodScan.cameraHint")}
                    galleryLabel={t("foodScan.uploadPhoto")}
                    captureLabel={t("foodScan.capture")}
                    permissionHint={t("foodScan.cameraPermission")}
                    useGalleryLabel={t("foodScan.useGallery")}
                    onCapture={onCameraCapture}
                    onOpenGallery={() => {
                      setSourceMode("import");
                      fileRef.current?.click();
                    }}
                    onPermissionDenied={() => {
                      setSourceMode("import");
                      toast({
                        title: t("foodScan.modeImport"),
                        description: t("foodScan.switchedToImport"),
                        variant: "info",
                      });
                    }}
                    className="rounded-2xl"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="import"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FoodScanImport
                    previewUrl={previewUrl}
                    hint={t("foodScan.importHint")}
                    chooseLabel={t("foodScan.choosePhoto")}
                    analyzeLabel={t("foodScan.analyzePhoto")}
                    changeLabel={t("foodScan.changePhoto")}
                    analyzingLabel={t("foodScan.analyzing")}
                    analyzing={phase === "analyzing"}
                    disabled={phase === "analyzing"}
                    onChoose={() => fileRef.current?.click()}
                    onAnalyze={onImportAnalyze}
                    className="rounded-2xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => onImportFile(e.target.files?.[0])}
            />

            {phase === "result" ? (
              <Button variant="outline" className="w-full" onClick={resetScan}>
                <RefreshCw className="h-4 w-4" />
                {t("foodScan.scanAgain")}
              </Button>
            ) : null}
          </div>

          <div className="space-y-4 px-4 lg:px-0">
            <AnimatePresence mode="wait">
              {phase === "result" && result ? (
                <motion.div
                  key="macros"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold">{result.name}</h3>
                          <p className="text-sm text-muted-foreground">{t("foodScan.estimated")}</p>
                        </div>
                        <Badge variant="success">
                          {t("foodScan.matchPercent", { confidence: result.confidence })}
                        </Badge>
                      </div>

                      <p className="mt-4 text-4xl font-bold tracking-tight">
                        {result.calories}
                        <span className="ml-1 text-base font-medium text-muted-foreground">kcal</span>
                      </p>

                      <div className="mt-5 space-y-3">
                        {toMacros(result, t).map((m) => (
                          <div key={m.label}>
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="text-muted-foreground">{m.label}</span>
                              <span className="font-semibold">
                                {m.value}
                                {m.unit}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(m.value, 100)}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="gradient"
                        className="mt-6 w-full"
                        onClick={() => {
                          saveScannedMeal(result, pendingFile?.name);
                          toast({
                            title: t("foodScan.logged"),
                            description: `${result.name} · ${result.calories} kcal`,
                            variant: "success",
                          });
                        }}
                      >
                        <Check className="h-4 w-4" />
                        {t("foodScan.logConfirm")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center gap-2 p-8 text-center sm:p-10">
                      <p className="text-sm text-muted-foreground">
                        {phase === "analyzing"
                          ? t("foodScan.analyzing")
                          : t("foodScan.placeholder")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-sm text-muted-foreground">{t("foodScan.disclaimer")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
