interface SpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ label, size = "md" }: SpinnerProps) {
  const dim = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-12 w-12" : "h-8 w-8";

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div className={`relative ${dim}`}>
        <div className="absolute inset-0 rounded-full border-4 border-wc-ink/10" />
        <div
          className={`absolute inset-0 rounded-full border-4 border-transparent
                      border-t-wc-green border-r-wc-red border-b-wc-blue border-l-wc-gold
                      animate-spin-fast`}
        />
      </div>
      {label ? (
        <span className="font-stadium uppercase tracking-wider text-sm text-wc-ink/70">
          {label}
        </span>
      ) : (
        <span className="sr-only">Loading…</span>
      )}
    </div>
  );
}
