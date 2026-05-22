import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PleEventDetail } from "@/lib/wwe-ple-detail";
import type { PleSlug } from "@/lib/wwe-ple";
import { formatPleMonth, WWE_PLE_MONTHLY_ORDER } from "@/lib/wwe-ple";
import { PleMatchBracket } from "@/components/ple/ple-match-bracket";

type PleBase = (typeof WWE_PLE_MONTHLY_ORDER)[number];

type PleEventDetailViewProps = {
  ple: PleBase;
  detail: PleEventDetail;
};

export function PleEventDetailView({ ple, detail }: PleEventDetailViewProps) {
  const { theme } = detail;
  const idx = WWE_PLE_MONTHLY_ORDER.findIndex((e) => e.slug === ple.slug);
  const prev = idx > 0 ? WWE_PLE_MONTHLY_ORDER[idx - 1] : undefined;
  const next =
    idx >= 0 && idx < WWE_PLE_MONTHLY_ORDER.length - 1
      ? WWE_PLE_MONTHLY_ORDER[idx + 1]
      : undefined;

  return (
    <main className={cn("relative min-h-[calc(100dvh-5.5rem)] overflow-hidden", theme.pageBg)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b",
          theme.heroGradient
        )}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            href="/ple"
            className="text-stone-400 transition-colors hover:text-stone-200"
          >
            ← PLE 목록
          </Link>
          <div className="flex gap-2">
            {prev && (
              <Link
                href={`/ple/${prev.slug}`}
                className="rounded-lg border border-stone-700/60 px-3 py-1 text-stone-400 hover:border-stone-500 hover:text-stone-200"
              >
                {formatPleMonth(prev.month)}
              </Link>
            )}
            {next && (
              <Link
                href={`/ple/${next.slug}`}
                className="rounded-lg border border-stone-700/60 px-3 py-1 text-stone-400 hover:border-stone-500 hover:text-stone-200"
              >
                {formatPleMonth(next.month)}
              </Link>
            )}
          </div>
        </nav>

        <header
          className={cn(
            "rounded-2xl border p-6 sm:p-8",
            theme.border,
            theme.glow,
            "bg-stone-900/55 backdrop-blur-sm"
          )}
        >
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
              theme.badge
            )}
          >
            {formatPleMonth(ple.month)} · {detail.signatureLabel}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl">
            {ple.label}
          </h1>
          <p className={cn("mt-2 text-lg font-medium", theme.accent)}>
            {detail.tagline}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-stone-400">
            {ple.description}
          </p>
        </header>

        <PleMatchBracket slug={ple.slug as PleSlug} className="mt-8" />

        <PleHighlightsSection detail={detail} />

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-stone-600 bg-stone-800/60 px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-700"
          >
            홈으로
          </Link>
          <Link
            href="/ple"
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              theme.border,
              theme.accent,
              "bg-stone-900/50 hover:bg-stone-800/80"
            )}
          >
            다른 PLE 보기
          </Link>
        </div>
      </div>
    </main>
  );
}

function PleHighlightsSection({ detail }: { detail: PleEventDetail }) {
  const { theme, highlights } = detail;

  return (
    <section className="mt-8">
      <h2 className={cn("mb-3 text-sm font-semibold uppercase tracking-wider", theme.accentMuted)}>
        PLE 안내
      </h2>
      <HighlightList highlights={highlights} theme={theme} />
    </section>
  );
}

function HighlightList({
  highlights,
  theme,
}: {
  highlights: PleEventDetail["highlights"];
  theme: PleEventDetail["theme"];
}) {
  return (
    <ul className="grid gap-3">
      {highlights.map((h) => (
        <li
          key={h.title}
          className={cn("rounded-xl border p-4", theme.border, "bg-stone-900/45")}
        >
          <p className={cn("font-semibold", theme.accent)}>{h.title}</p>
          <p className="mt-1 text-sm text-stone-400">{h.detail}</p>
        </li>
      ))}
    </ul>
  );
}
