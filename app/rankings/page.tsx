"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { WweArenaShell } from "@/components/wwe-arena-shell";
import { getPleClientId } from "@/lib/ple-client-id";
import { linkPlePredictions } from "@/lib/ple-api";
import {
  fetchRankings,
  formatAccuracy,
  type RankingRow,
} from "@/lib/rankings-api";

type RankingsPageState = {
  loading: boolean;
  unavailable: boolean;
  rows: RankingRow[];
  myRank: RankingRow | null;
};

const initialState: RankingsPageState = {
  loading: true,
  unavailable: false,
  rows: [],
  myRank: null,
};

function rankRowClass(rank: number, isMe: boolean) {
  const base = "border-b border-stone-800/60";
  const meRing = isMe ? "ring-1 ring-inset ring-amber-500/40" : "";

  if (rank === 1) {
    return cn(
      base,
      meRing,
      "bg-gradient-to-r from-amber-400/22 via-amber-500/12 to-amber-950/5"
    );
  }
  if (rank === 2) {
    return cn(
      base,
      meRing,
      "bg-gradient-to-r from-stone-300/18 via-stone-400/10 to-stone-950/5"
    );
  }
  if (rank === 3) {
    return cn(
      base,
      meRing,
      "bg-gradient-to-r from-orange-700/22 via-amber-800/14 to-stone-950/5"
    );
  }
  if (rank >= 4 && rank <= 10) {
    return cn(base, meRing, "bg-stone-800/45");
  }
  return cn(base, isMe && "bg-amber-500/10");
}

function rankNumberClass(rank: number) {
  const base = "text-sm font-bold tabular-nums";
  if (rank === 1) return cn(base, "text-amber-200");
  if (rank === 2) return cn(base, "text-stone-200");
  if (rank === 3) return cn(base, "text-orange-300/95");
  if (rank >= 4 && rank <= 10) return cn(base, "text-stone-300");
  return cn(base, "text-stone-400 font-semibold");
}

function rankTextClass(rank: number) {
  if (rank === 1) return "text-amber-50";
  if (rank === 2) return "text-stone-100";
  if (rank === 3) return "text-orange-50/95";
  if (rank >= 4 && rank <= 10) return "text-stone-200";
  return "text-stone-100";
}

function TableRow({
  row,
  isMe,
}: {
  row: RankingRow;
  isMe: boolean;
}) {
  const text = rankTextClass(row.rank);

  return (
    <tr className={rankRowClass(row.rank, isMe)}>
      <td className={cn("py-3 pr-3 text-right", rankNumberClass(row.rank))}>
        {row.rank}
      </td>
      <td className={cn("py-3 pr-3 text-sm font-semibold", text)}>
        {row.nickname}
        {isMe && (
          <span className="ml-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-200">
            나
          </span>
        )}
      </td>
      <td
        className={cn(
          "py-3 pr-3 text-right text-sm font-semibold tabular-nums",
          text
        )}
      >
        {row.score}
      </td>
      <td
        className={cn(
          "py-3 text-right text-sm font-semibold tabular-nums",
          text
        )}
      >
        {formatAccuracy(row.accuracy)}
      </td>
    </tr>
  );
}

export default function RankingsPage() {
  const { user, isReady } = useAuth();
  const [state, setState] = useState<RankingsPageState>(initialState);

  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, unavailable: false }));

    void (async () => {
      if (user?.id != null) {
        await linkPlePredictions(getPleClientId(), user.id);
      }
      const data = await fetchRankings({
        limit: 20,
        nickname: user?.nickname,
      });
      if (cancelled) return;
      setState({
        loading: false,
        unavailable: data === null,
        rows: data?.rows ?? [],
        myRank: data?.myRank ?? null,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [isReady, user?.nickname, user?.id]);

  const myRow = useMemo(() => {
    if (!user) return null;
    const inTop = state.rows.find((r) => r.nickname === user.nickname);
    return inTop ?? state.myRank;
  }, [state.rows, state.myRank, user]);

  const showMySection =
    !!user && myRow != null && !state.rows.some((r) => r.nickname === user.nickname);

  return (
    <WweArenaShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            KayFabe
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-stone-50">
            순위표
          </h1>
          <p className="max-w-2xl text-sm text-stone-400">
            닉네임 · 점수 · 예측 성공 확률(%) 기준으로 표시합니다. 로그인 후 예측한
            회원만 집계됩니다.
          </p>
        </header>

        {!isReady || state.loading ? (
          <div className="mt-10 text-center text-sm text-stone-400">
            불러오는 중...
          </div>
        ) : state.unavailable ? (
          <div className="mt-10 rounded-2xl border border-stone-700/60 bg-stone-900/40 px-4 py-6 text-center text-sm text-stone-400">
            순위를 불러오지 못했습니다. 백엔드가 실행 중인지 확인해 주세요.
          </div>
        ) : (
          <>
            <section className="mt-10 rounded-3xl border border-stone-700/70 bg-stone-950/55 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tight text-stone-50">
                  TOP 20
                </h2>
              </div>
              {state.rows.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-stone-600/60 bg-stone-900/40 px-4 py-6 text-center text-sm text-stone-400">
                  아직 순위에 올라온 유저가 없습니다. PLE에서 예측하고 결과가
                  확정되면 표시됩니다.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px]">
                    <thead>
                      <tr className="border-b border-stone-700/70">
                        <th className="py-3 pr-3 text-right text-xs font-semibold tracking-wider text-stone-500">
                          순위
                        </th>
                        <th className="py-3 pr-3 text-left text-xs font-semibold tracking-wider text-stone-500">
                          닉네임
                        </th>
                        <th className="py-3 pr-3 text-right text-xs font-semibold tracking-wider text-stone-500">
                          점수
                        </th>
                        <th className="py-3 text-right text-xs font-semibold tracking-wider text-stone-500">
                          성공 확률
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.rows.map((row) => (
                        <TableRow
                          key={`${row.rank}-${row.nickname}`}
                          row={row}
                          isMe={!!user && row.nickname === user.nickname}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="mt-6 rounded-3xl border border-stone-700/70 bg-stone-950/55 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tight text-stone-50">
                  내 순위
                </h2>
                {!user && (
                  <span className="text-xs font-medium text-stone-500">
                    로그인하면 내 순위가 표시됩니다.
                  </span>
                )}
              </div>

              {!user ? (
                <div className="rounded-2xl border border-stone-700/60 bg-stone-900/40 px-4 py-3 text-sm text-stone-300">
                  로그인이 필요합니다.
                </div>
              ) : myRow == null ? (
                <div className="rounded-2xl border border-stone-700/60 bg-stone-900/40 px-4 py-3 text-sm text-stone-300">
                  아직 채점된 예측이 없습니다. PLE 페이지에서 예측하고 결과가
                  나오면 순위에 반영됩니다.
                </div>
              ) : showMySection ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px]">
                    <thead>
                      <tr className="border-b border-stone-700/70">
                        <th className="py-3 pr-3 text-right text-xs font-semibold tracking-wider text-stone-500">
                          순위
                        </th>
                        <th className="py-3 pr-3 text-left text-xs font-semibold tracking-wider text-stone-500">
                          닉네임
                        </th>
                        <th className="py-3 pr-3 text-right text-xs font-semibold tracking-wider text-stone-500">
                          점수
                        </th>
                        <th className="py-3 text-right text-xs font-semibold tracking-wider text-stone-500">
                          성공 확률
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRow row={myRow} isMe />
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-stone-400">
                  TOP 20 표에 내 순위가 포함되어 있습니다.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </WweArenaShell>
  );
}
