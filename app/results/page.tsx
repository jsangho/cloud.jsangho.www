"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WWE_PLE_MONTHLY_ORDER, type PleSlug } from "@/lib/wwe-ple";
import {
  fetchPleBoard,
  type PleBoard,
  type PleBoardMatch,
} from "@/lib/ple-api";
import { cn } from "@/lib/utils";
import { WweArenaShell } from "@/components/wwe-arena-shell";
import { getBracketTheme } from "@/lib/wwe-ple-bracket-theme";

type ResultsPageState = {
  boardsBySlug: Partial<Record<PleSlug, PleBoard | null>>;
  isLoading: boolean;
  hasError: boolean;
};

const initialState: ResultsPageState = {
  boardsBySlug: {},
  isLoading: true,
  hasError: false,
};

function patchState(
  setState: React.Dispatch<React.SetStateAction<ResultsPageState>>,
  patch: Partial<ResultsPageState>
) {
  setState((prev) => ({ ...prev, ...patch }));
}

function winnerLabel(match: PleBoardMatch): string {
  const result = match.result;
  if (!result) return "결과 미정";
  if (result.winnerName) return result.winnerName;

  if (match.format === "multi") {
    const idx = result.winnerIndex;
    if (typeof idx === "number") {
      const name = match.competitors?.[idx]?.name;
      return name ?? "승자";
    }
    return "승자";
  }

  const side = result.winnerSide;
  if (side === "left") return match.left?.name ?? "승자";
  if (side === "right") return match.right?.name ?? "승자";
  return "승자";
}

function statusBadge(
  status: PleBoard["status"] | string | undefined,
  accentBg?: string,
  accentText?: string
) {
  const label =
    status === "finished" ? "완료" : status === "live" ? "진행 중" : "예정";
  const classes =
    status === "finished"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : status === "live"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
        : "border-stone-600/60 bg-stone-800/50 text-stone-300";
  const accent = accentBg
    ? cn("border-transparent", accentBg, accentText ?? "text-white")
    : null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        classes,
        accent
      )}
    >
      {label}
    </span>
  );
}

export default function ResultsPage() {
  const [state, setState] = useState<ResultsPageState>(initialState);

  const slugs = useMemo(
    () => WWE_PLE_MONTHLY_ORDER.map((ple) => ple.slug as PleSlug),
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      patchState(setState, { isLoading: true, hasError: false });
      try {
        const entries = await Promise.all(
          slugs.map(async (slug) => {
            try {
              let board = await fetchPleBoard(slug);
              return [slug, board] as const;
            } catch {
              return [slug, null] as const;
            }
          })
        );

        if (cancelled) return;
        const boardsBySlug = Object.fromEntries(entries) as Partial<
          Record<PleSlug, PleBoard | null>
        >;
        patchState(setState, { boardsBySlug, isLoading: false });
      } catch {
        if (cancelled) return;
        patchState(setState, { isLoading: false, hasError: true });
      }
    }

    void loadAll();
    return () => {
      cancelled = true;
    };
  }, [slugs]);

  return (
    <WweArenaShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          KayFabe
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-stone-50">
          PLE 결과
        </h1>
        <p className="max-w-2xl text-sm text-stone-400">
          월별 PLE의 경기 결과를 한 번에 확인할 수 있어요.
        </p>
      </header>

      {state.hasError && (
        <div className="mt-8 rounded-2xl border border-red-800/40 bg-red-950/20 px-4 py-3 text-sm text-red-200">
          결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      {state.isLoading ? (
        <div className="mt-10 text-center text-sm text-stone-400">
          불러오는 중...
        </div>
      ) : (
        <section className="mt-10 space-y-6">
          {WWE_PLE_MONTHLY_ORDER.map((ple) => {
            const slug = ple.slug as PleSlug;
            const board = state.boardsBySlug[slug] ?? null;
            const theme = getBracketTheme(slug);

            const matches = board?.matches ?? [];
            const finishedMatches = matches.filter((m) => m.status === "finished");
            const showMatches = board?.status === "finished" ? finishedMatches : matches;

            return (
              <article
                key={slug}
                className={cn(
                  "relative overflow-hidden rounded-3xl border bg-stone-950/55 shadow-2xl shadow-black/20 backdrop-blur-xl",
                  theme.sideA.border
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-1.5 opacity-90",
                    theme.sideA.headerBg
                  )}
                />
                <div className="p-5 sm:p-7">
                  <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-stone-50">
                      {ple.label}
                    </h2>
                    {statusBadge(
                      board?.status,
                      theme.sideA.headerBg,
                      theme.sideA.headerText
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    {ple.month}월 PLE ·{" "}
                    <Link
                      href={`/ple/${slug}`}
                      className="underline underline-offset-4 hover:text-stone-200"
                    >
                      상세 보기
                    </Link>
                  </p>
                  </div>

                {!board && (
                  <div className="mt-6 rounded-2xl border border-stone-700/60 bg-stone-900/40 px-4 py-3 text-sm text-stone-300">
                    아직 결과 데이터가 없습니다.
                  </div>
                )}

                {board && showMatches.length === 0 && (
                  <div className="mt-6 rounded-2xl border border-stone-700/60 bg-stone-900/40 px-4 py-3 text-sm text-stone-300">
                    표시할 경기가 없습니다.
                  </div>
                )}

                {board && showMatches.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {showMatches.map((m) => (
                      <li
                        key={m.id}
                        className={cn(
                          "rounded-2xl border bg-stone-900/55 px-4 py-3",
                          theme.sideA.border
                        )}
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-stone-100">
                              {m.title}
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                              {m.status === "finished" ? "종료" : "미종료"}
                            </p>
                          </div>
                          <div className="shrink-0 text-sm font-bold text-stone-50">
                            {winnerLabel(m)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                </div>
              </article>
            );
          })}
        </section>
      )}
      </div>
    </WweArenaShell>
  );
}

