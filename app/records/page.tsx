"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchCompetitorNames } from "@/lib/records-api";
import { cn } from "@/lib/utils";

type RecordsPageState = {
  query: string;
  names: string[];
  loading: boolean;
};

const initialState: RecordsPageState = {
  query: "",
  names: [],
  loading: true,
};

export default function RecordsPage() {
  const [state, setState] = useState<RecordsPageState>(initialState);
  const patchState = (patch: Partial<RecordsPageState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      patchState({ loading: true });
      const names = await fetchCompetitorNames(state.query);
      if (!cancelled) patchState({ names, loading: false });
    }, state.query ? 250 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [state.query]);

  const emptyMessage = useMemo(() => {
    if (state.loading) return null;
    if (state.query.trim()) return "검색 결과가 없습니다.";
    return "동기화된 PLE 카드에 출전 선수가 없습니다.";
  }, [state.loading, state.query]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-5">
        <h1 className="text-xl font-extrabold tracking-tight text-stone-50 sm:text-2xl">
          기록
        </h1>
        <p className="mt-1 text-sm font-medium text-stone-400">
          PLE 출전 선수 목록에서 선택하면 승패 기록을 확인할 수 있습니다.
        </p>
      </header>

      <section className="mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-semibold text-stone-200" htmlFor="records-search">
            선수 검색
          </label>
          <input
            id="records-search"
            type="search"
            value={state.query}
            onChange={(e) => patchState({ query: e.target.value })}
            placeholder="이름으로 검색"
            className={cn(
              "h-10 w-full rounded-xl border border-stone-700/70 bg-stone-950/40 px-3 text-sm text-stone-100",
              "placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/40 sm:max-w-sm"
            )}
          />
        </div>
      </section>

      <section aria-label="선수 목록">
        {state.loading ? (
          <div className="rounded-xl border border-stone-700/60 bg-stone-950/40 p-4 text-sm text-stone-300">
            불러오는 중…
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {state.names.map((name) => (
              <li key={name} className="min-w-0">
                <Link
                  href={`/records/${encodeURIComponent(name)}`}
                  className={cn(
                    "block rounded-xl border border-stone-700/70 bg-stone-950/40 px-3 py-3",
                    "transition-colors hover:border-stone-500/80 hover:bg-stone-900/40"
                  )}
                >
                  <div className="truncate text-sm font-semibold text-stone-50">{name}</div>
                  <div className="mt-0.5 text-xs font-medium text-stone-400">
                    상세 기록 보기
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!state.loading && state.names.length === 0 && emptyMessage && (
          <div className="mt-8 rounded-xl border border-stone-700/60 bg-stone-950/40 p-4 text-sm text-stone-300">
            {emptyMessage}
          </div>
        )}
      </section>
    </main>
  );
}
