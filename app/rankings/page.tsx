"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { WweArenaShell } from "@/components/wwe-arena-shell";

type RankingRow = {
  rank: number;
  nickname: string;
  score: number;
  accuracy: number; // 0..1
};

type RankingsPageState = {
  rows: RankingRow[];
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function formatAccuracy(value: number) {
  const pct = Math.round(clamp01(value) * 100);
  return `${pct}%`;
}

function stableHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildMockRankings(myNickname?: string | null): RankingRow[] {
  const rows: RankingRow[] = [];
  for (let rank = 1; rank <= 120; rank += 1) {
    const nick = `Player${String(rank).padStart(3, "0")}`;
    const score = Math.max(0, 240 - rank * 2 + (rank % 7));
    const accuracy = 0.75 - rank * 0.003 + ((rank % 5) * 0.004);
    rows.push({ rank, nickname: nick, score, accuracy: clamp01(accuracy) });
  }

  if (myNickname) {
    const seed = stableHash(myNickname);
    const myRank = 21 + (seed % 80);
    const myScore = 240 - myRank * 2 + (seed % 7);
    const myAccuracy = clamp01(0.7 - myRank * 0.0025 + ((seed % 11) * 0.002));
    rows[myRank - 1] = {
      rank: myRank,
      nickname: myNickname,
      score: Math.max(0, myScore),
      accuracy: myAccuracy,
    };
  }

  return rows;
}

function TableRow({
  row,
  isMe,
}: {
  row: RankingRow;
  isMe: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-b border-stone-800/60",
        isMe && "bg-amber-500/10"
      )}
    >
      <td className="py-3 pr-3 text-right text-sm font-semibold text-stone-200 tabular-nums">
        {row.rank}
      </td>
      <td className="py-3 pr-3 text-sm font-semibold text-stone-100">
        {row.nickname}
        {isMe && (
          <span className="ml-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-200">
            나
          </span>
        )}
      </td>
      <td className="py-3 pr-3 text-right text-sm font-semibold text-stone-100 tabular-nums">
        {row.score}
      </td>
      <td className="py-3 text-right text-sm font-semibold text-stone-100 tabular-nums">
        {formatAccuracy(row.accuracy)}
      </td>
    </tr>
  );
}

export default function RankingsPage() {
  const { user, isReady } = useAuth();
  const [state] = useState<RankingsPageState>(() => ({
    rows: buildMockRankings(user?.nickname ?? null),
  }));

  const myRow = useMemo(() => {
    if (!user) return null;
    return state.rows.find((r) => r.nickname === user.nickname) ?? null;
  }, [state.rows, user]);

  const top20 = useMemo(() => state.rows.slice(0, 20), [state.rows]);

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
          닉네임 · 점수 · 예측 성공 확률(%) 기준으로 표시합니다.
        </p>
      </header>

      {!isReady ? (
        <div className="mt-10 text-center text-sm text-stone-400">
          불러오는 중...
        </div>
      ) : (
        <>
          <section className="mt-10 rounded-3xl border border-stone-700/70 bg-stone-950/55 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold tracking-tight text-stone-50">
                TOP 20
              </h2>
              <span className="text-xs font-medium text-stone-500">
                (현재는 목업 데이터)
              </span>
            </div>
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
                  {top20.map((row) => (
                    <TableRow
                      key={row.rank}
                      row={row}
                      isMe={!!user && row.nickname === user.nickname}
                    />
                  ))}
                </tbody>
              </table>
            </div>
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
            ) : !myRow ? (
              <div className="rounded-2xl border border-stone-700/60 bg-stone-900/40 px-4 py-3 text-sm text-stone-300">
                내 순위를 찾을 수 없습니다.
              </div>
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
                    <TableRow row={myRow} isMe />
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
      </div>
    </WweArenaShell>
  );
}
