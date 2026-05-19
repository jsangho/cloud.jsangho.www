import Link from "next/link";
import { cn } from "@/lib/utils";
import { WWE_PLE_MONTHLY_ORDER } from "@/lib/wwe-ple";

type PleEventGridProps = {
  variant?: "compact" | "large";
  className?: string;
  onNavigate?: () => void;
};

export function PleEventGrid({
  variant = "large",
  className,
  onNavigate,
}: PleEventGridProps) {
  const isLarge = variant === "large";

  return (
    <ul
      className={cn(
        "list-none p-0 m-0",
        isLarge
          ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-wrap items-center justify-center gap-2",
        className
      )}
    >
      {WWE_PLE_MONTHLY_ORDER.map((ple) => (
        <li key={ple.slug}>
          <Link
            href={`/ple/${ple.slug}`}
            onClick={onNavigate}
            className={cn(
              "block rounded-xl border text-left shadow-sm transition-colors",
              isLarge
                ? "border-stone-600/80 bg-stone-800/55 px-5 py-4 hover:border-stone-500 hover:bg-stone-700/70"
                : "border-stone-600/80 bg-stone-800/55 px-2.5 py-1.5 text-xs text-stone-200 hover:border-stone-500 hover:bg-stone-700/70 hover:text-stone-50 sm:px-3 sm:text-sm"
            )}
          >
            <span
              className={cn(
                "font-medium text-stone-500",
                isLarge ? "text-sm" : "block text-[10px] font-normal sm:text-xs"
              )}
            >
              {ple.month}월
            </span>
            <span
              className={cn(
                "block font-semibold text-stone-50",
                isLarge
                  ? "mt-1 text-xl leading-tight sm:text-2xl"
                  : "font-medium leading-snug"
              )}
            >
              {ple.label}
            </span>
            {isLarge && (
              <span className="mt-2 block text-sm leading-snug text-stone-400">
                {ple.description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
