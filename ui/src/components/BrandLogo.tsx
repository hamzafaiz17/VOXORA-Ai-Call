import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  inverse = false,
  mark = false,
}: {
  className?: string;
  inverse?: boolean;
  mark?: boolean;
}) {
  if (mark) {
    return (
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground text-base shadow-sm select-none", className)}>
        V
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 font-bold tracking-tight select-none", className)}>
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-extrabold text-primary-foreground text-sm shadow-sm">
        V
      </div>
      <span
        className={cn(
          "font-extrabold text-lg tracking-wide",
          inverse
            ? "text-white"
            : "text-foreground"
        )}
      >
        VOXORA
      </span>
    </div>
  );
}
