import { cn } from "@/lib/utils";

export function Avatar({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? fallback}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden>{fallback}</span>
      )}
    </div>
  );
}
