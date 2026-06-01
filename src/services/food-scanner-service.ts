/**
 * FOOD SCANNER SERVICE — Planify (MOCK, Vision-ready)
 * ---------------------------------------------------------------------------
 * Production: POST image to server route -> OpenAI Vision / nutrition API.
 * Env: VITE_API_BASE_URL, VITE_OPENAI_API_KEY (server-side only).
 * ---------------------------------------------------------------------------
 */

export interface FoodScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
}

export type FoodScanErrorCode = "NO_IMAGE" | "INVALID_IMAGE" | "FILE_TOO_LARGE" | "ANALYSIS_FAILED";

export class FoodScanError extends Error {
  readonly code: FoodScanErrorCode;

  constructor(code: FoodScanErrorCode, message?: string) {
    super(message ?? code);
    this.name = "FoodScanError";
    this.code = code;
  }
}

const MOCK_MEALS: FoodScanResult[] = [
  { name: "Grilled chicken bowl", calories: 540, protein: 42, carbs: 48, fats: 18, confidence: 86 },
  { name: "Avocado toast & eggs", calories: 420, protein: 18, carbs: 32, fats: 24, confidence: 82 },
  { name: "Greek yogurt & berries", calories: 280, protein: 22, carbs: 35, fats: 6, confidence: 79 },
  { name: "Salmon & rice plate", calories: 620, protein: 38, carbs: 52, fats: 22, confidence: 88 },
  { name: "Protein smoothie", calories: 310, protein: 28, carbs: 38, fats: 8, confidence: 74 },
];

const MAX_BYTES = 10 * 1024 * 1024;

function delay(ms = 1800): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function pickByFilename(hint: string): FoodScanResult | null {
  if (hint.includes("salmon")) return MOCK_MEALS[3];
  if (hint.includes("yogurt") || hint.includes("berry")) return MOCK_MEALS[2];
  if (hint.includes("toast") || hint.includes("egg")) return MOCK_MEALS[1];
  if (hint.includes("smoothie")) return MOCK_MEALS[4];
  if (hint.includes("chicken") || hint.includes("bowl")) return MOCK_MEALS[0];
  return null;
}

/** Stable mock result from image pixels (same photo → same meal). */
async function pickByImageContent(file: File): Promise<FoodScanResult> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new FoodScanError("ANALYSIS_FAILED"));
      el.src = url;
    });

    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new FoodScanError("ANALYSIS_FAILED");

    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    let hash = 0;
    let warm = 0;
    let green = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      hash = (hash + r + g + b) | 0;
      warm += r > g && r > b ? 1 : 0;
      green += g > r && g > b ? 1 : 0;
    }

    if (green > warm * 1.2) return MOCK_MEALS[2];
    if (warm > green * 1.4) return MOCK_MEALS[1];
    return MOCK_MEALS[Math.abs(hash) % MOCK_MEALS.length]!;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function validateFile(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new FoodScanError("INVALID_IMAGE");
  }
  if (file.size > MAX_BYTES) {
    throw new FoodScanError("FILE_TOO_LARGE");
  }
}

/** Analyze a food image. Requires a photo file (no random scan without input). */
export async function analyzeFoodImage(file: File): Promise<FoodScanResult> {
  if (!file) {
    throw new FoodScanError("NO_IMAGE");
  }
  validateFile(file);

  await delay();

  const hint = file.name.toLowerCase();
  const byName = pickByFilename(hint);
  if (byName) return byName;

  try {
    return await pickByImageContent(file);
  } catch (e) {
    if (e instanceof FoodScanError) throw e;
    throw new FoodScanError("ANALYSIS_FAILED");
  }
}
