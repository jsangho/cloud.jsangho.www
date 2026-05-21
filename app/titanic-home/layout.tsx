"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ANALYSIS_HREF = "/titanic-home/analysis";
const DATA_COLLECTION_HREF = "/titanic-home/data-collection";

export default function TitanicHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAnalysis = pathname === ANALYSIS_HREF;
  const isDataCollection = pathname === DATA_COLLECTION_HREF;
  const isTitanicSection = isAnalysis || isDataCollection;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isDataCollection) {
      setExpanded(true);
    }
  }, [isDataCollection]);

  return (
    <div className="flex min-h-[calc(100vh-1px)] bg-white text-zinc-900">
      <aside className="w-52 shrink-0 border-r border-zinc-200 bg-zinc-50/90 px-3 py-6">
        <nav className="flex flex-col gap-1" aria-label="타이타닉 메뉴">
          <div
            className={cn(
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              isTitanicSection
                ? "bg-zinc-900 text-white"
                : "text-zinc-700"
            )}
          >
            <Link
              href={ANALYSIS_HREF}
              aria-current={isAnalysis ? "page" : undefined}
              className={cn(
                "min-w-0 flex-1 rounded-l-lg px-3 py-2.5 transition-colors",
                !isTitanicSection && "hover:bg-zinc-200/80",
                isTitanicSection && "hover:bg-zinc-800"
              )}
            >
              타이타닉
            </Link>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? "하위 메뉴 접기" : "하위 메뉴 펼치기"}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-r-lg px-2 py-2.5 transition-colors",
                !isTitanicSection && "hover:bg-zinc-200/80",
                isTitanicSection && "hover:bg-zinc-800"
              )}
            >
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-200",
                  expanded && "rotate-90"
                )}
                aria-hidden
              />
            </button>
          </div>

          {expanded && (
            <Link
              href={DATA_COLLECTION_HREF}
              aria-current={isDataCollection ? "page" : undefined}
              className={cn(
                "rounded-lg py-2 pl-6 pr-3 text-sm transition-colors",
                isDataCollection
                  ? "font-medium text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900"
              )}
            >
              1. 데이터 수집
            </Link>
          )}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
