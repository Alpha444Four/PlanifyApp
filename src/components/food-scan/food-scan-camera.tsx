import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  FlipHorizontal2,
  ImageIcon,
  ScanLine,
  Zap,
  ZapOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  capturePhotoFromVideo,
  getCameraStream,
  stopCameraStream,
  toggleTorch,
  type CameraFacing,
} from "@/lib/camera-utils";

export interface FoodScanCameraProps {
  active: boolean;
  /** Frozen frame while analyzing */
  freezeSrc?: string | null;
  scanning?: boolean;
  hint: string;
  galleryLabel: string;
  captureLabel: string;
  permissionHint: string;
  useGalleryLabel: string;
  onCapture: (file: File) => void;
  onOpenGallery: () => void;
  onPermissionDenied?: () => void;
  className?: string;
}

export function FoodScanCamera({
  active,
  freezeSrc,
  scanning = false,
  hint,
  galleryLabel,
  captureLabel,
  permissionHint,
  useGalleryLabel,
  onCapture,
  onOpenGallery,
  onPermissionDenied,
  className,
}: FoodScanCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<CameraFacing>("environment");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const stopStream = useCallback(() => {
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setReady(false);
    setTorchOn(false);
    setTorchSupported(false);
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setError(null);
    try {
      const stream = await getCameraStream(facing);
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setReady(true);

      const capabilities = stream.getVideoTracks()[0]?.getCapabilities?.() as
        | { torch?: boolean }
        | undefined;
      setTorchSupported(Boolean(capabilities?.torch));
    } catch {
      setError("denied");
      onPermissionDenied?.();
    }
  }, [facing, stopStream, onPermissionDenied]);

  useEffect(() => {
    if (active && !freezeSrc) {
      void startStream();
    } else {
      stopStream();
    }
    return () => stopStream();
  }, [active, freezeSrc, startStream, stopStream]);

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video || !ready || capturing || scanning) return;
    setCapturing(true);
    try {
      const file = await capturePhotoFromVideo(video);
      stopStream();
      onCapture(file);
    } catch {
      setError("capture");
    } finally {
      setCapturing(false);
    }
  };

  const handleFlip = () => {
    setFacing((f) => (f === "environment" ? "user" : "environment"));
  };

  const handleTorch = async () => {
    const stream = streamRef.current;
    if (!stream) return;
    const next = !torchOn;
    const ok = await toggleTorch(stream, next);
    if (ok) setTorchOn(next);
  };

  const showLive = active && !freezeSrc && !error;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black shadow-2xl",
        "min-h-[min(72dvh,720px)] w-full",
        className,
      )}
    >
      {error ? (
        <div className="flex h-full min-h-[min(72dvh,720px)] flex-col items-center justify-center gap-5 bg-zinc-950 px-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white">
            <Camera className="h-10 w-10" />
          </span>
          <p className="max-w-xs text-sm text-white/80">{permissionHint}</p>
          <button
            type="button"
            onClick={onOpenGallery}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white/90"
          >
            {useGalleryLabel}
          </button>
        </div>
      ) : (
        <>
          {showLive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          {freezeSrc ? (
            <img
              src={freezeSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          {!showLive && !freezeSrc ? (
            <div className="absolute inset-0 animate-pulse bg-zinc-900" />
          ) : null}

          {/* Dim overlay + viewfinder (Yuka-style cutout) */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <p className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 to-transparent px-4 pb-8 pt-5 text-center text-sm font-medium tracking-wide text-white">
              {hint}
            </p>

            <div
              className={cn(
                "absolute left-[7%] right-[7%] top-[14%] bottom-[24%] rounded-2xl border-2 border-white/90",
                "shadow-[0_0_0_9999px_rgba(0,0,0,0.52)]",
              )}
            >
              <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-white" />
              <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-white" />
              <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-white" />

              {scanning ? (
                <>
                  <motion.div
                    className="absolute inset-x-2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[hsl(var(--brand-beige))] to-transparent shadow-[0_0_12px_hsl(var(--brand-beige))]"
                    animate={{ top: ["8%", "92%", "8%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <ScanLine className="absolute inset-0 m-auto h-14 w-14 text-white/25" />
                </>
              ) : null}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-6 pb-6 pt-16">
            <div className="mx-auto flex max-w-md items-center justify-between">
              <button
                type="button"
                onClick={onOpenGallery}
                disabled={scanning || capturing}
                aria-label={galleryLabel}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 disabled:opacity-40"
              >
                <ImageIcon className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={() => void handleCapture()}
                disabled={!ready || scanning || capturing || Boolean(freezeSrc)}
                aria-label={captureLabel}
                className="group relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.35),0_8px_32px_rgba(0,0,0,0.45)] transition active:scale-95 disabled:opacity-50"
              >
                <span className="absolute inset-2 rounded-full border-2 border-zinc-300/80 group-hover:border-zinc-400" />
                <span className="h-[3.25rem] w-[3.25rem] rounded-full bg-white" />
              </button>

              <div className="flex w-12 shrink-0 flex-col items-center gap-2">
                {torchSupported ? (
                  <button
                    type="button"
                    onClick={() => void handleTorch()}
                    disabled={scanning || !showLive}
                    aria-label="Torch"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 disabled:opacity-40"
                  >
                    {torchOn ? (
                      <Zap className="h-5 w-5 fill-amber-300 text-amber-300" />
                    ) : (
                      <ZapOff className="h-5 w-5" />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFlip}
                    disabled={scanning || Boolean(freezeSrc)}
                    aria-label="Flip camera"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 disabled:opacity-40"
                  >
                    <FlipHorizontal2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
