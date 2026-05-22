import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPleMonth, WWE_PLE_MONTHLY_ORDER } from "@/lib/wwe-ple";

type PleEventGridProps = {
  variant?: "compact" | "large";
  className?: string;
  onNavigate?: () => void;
  /** 링크 접두사 (기본 `/ple`, 결과 페이지는 `/results`) */
  hrefPrefix?: string;
};

export function PleEventGrid({
  variant = "large",
  className,
  onNavigate,
  hrefPrefix = "/ple",
}: PleEventGridProps) {
  const isLarge = variant === "large";

  return (
    <ul
      className={cn(
        "list-none m-0 w-full p-0",
        isLarge
          ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "mx-auto flex max-w-5xl flex-wrap justify-center gap-2 sm:gap-2.5",
        className
      )}
    >
      {WWE_PLE_MONTHLY_ORDER.map((ple) => (
        <li
          key={ple.slug}
          className={cn("min-w-0", !isLarge && "w-[calc(50%-0.25rem)] sm:w-[9.5rem]")}
        >
          <Link
            href={`${hrefPrefix}/${ple.slug}`}
            onClick={onNavigate}
            className={cn(
              "block h-full w-full min-w-0 rounded-xl border text-left shadow-sm transition-colors",
              isLarge
                ? "border-stone-600/80 bg-stone-800/55 px-3.5 py-3 hover:border-stone-500 hover:bg-stone-700/70 sm:px-4 sm:py-3.5"
                : "border-stone-600/80 bg-stone-800/55 px-2.5 py-2 text-xs text-stone-200 hover:border-stone-500 hover:bg-stone-700/70 hover:text-stone-50 sm:px-3 sm:text-sm"
            )}
          >
            <span
              className={cn(
                "font-medium text-stone-500",
                isLarge ? "text-sm" : "block text-[10px] font-normal sm:text-xs"
              )}
            >
              {formatPleMonth(ple.month)}
            </span>
            <span
              className={cn(
                "block font-semibold text-stone-50",
                isLarge
                  ? "mt-0.5 text-base leading-tight sm:text-lg"
                  : "font-medium leading-snug"
              )}
            >
              {ple.label}
            </span>
            {isLarge && (
              <span className="mt-1.5 block text-xs leading-snug text-stone-400 sm:text-sm">
                {ple.description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
