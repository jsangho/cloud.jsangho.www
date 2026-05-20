"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BRACKET_LABELS } from "@/lib/bracket-labels";
import type { PleSlug } from "@/lib/wwe-ple";
import { getBracketTheme } from "@/lib/wwe-ple-bracket-theme";
import {
  getPleMatches,
  isMultiMatch,
  type PleMatchCard,
} from "@/lib/wwe-ple-matches";
import {
  boardMatchesToCards,
  fetchPleBoard,
  submitPlePrediction,
  subscribePleLive,
  syncPleFromClient,
  type PleBoard,
  type PleBoardMatch,
} from "@/lib/ple-api";
import { getPleClientId } from "@/lib/ple-client-id";
import { MatchBracketCard } from "@/components/ple/match-bracket-card";

type Side = "left" | "right";

type SinglesVoteState = {
  kind: "singles";
  votes: { left: number; right: number };
  selected: Side | null;
};

type MultiVoteState = {
  kind: "multi";
  votes: number[];
  selected: number | null;
};

type VoteState = SinglesVoteState | MultiVoteState;

type StoredBracketState = Record<string, VoteState>;

function storageKey(slug: PleSlug) {
  return `kayfabe-ple-votes-${slug}`;
}

function emptySinglesVotes() {
  return { left: 0, right: 0 };
}

function emptyMultiVotes(count: number) {
  return Array.from({ length: count }, () => 0);
}

function buildInitialState(matches: PleMatchCard[]): StoredBracketState {
  const state: StoredBracketState = {};
  for (const m of matches) {
    if (isMultiMatch(m)) {
      state[m.id] = {
        kind: "multi",
        votes: emptyMultiVotes(m.competitors.length),
        selected: null,
      };
    } else {
      state[m.id] = {
        kind: "singles",
        votes: emptySinglesVotes(),
        selected: null,
      };
    }
  }
  return state;
}

function stateFromBoard(board: PleBoard): StoredBracketState {
  const state: StoredBracketState = {};
  for (const m of board.matches) {
    const card = boardMatchesToCards([m])[0]!;
    if (m.format === "multi") {
      const votes = m.siteVotes.multi.length
        ? [...m.siteVotes.multi]
        : emptyMultiVotes(m.competitors?.length ?? 0);
      let selected: number | null = null;
      if (m.myPick != null) {
        const idx = Number(m.myPick);
        if (!Number.isNaN(idx)) selected = idx;
      }
      state[m.id] = { kind: "multi", votes, selected };
    } else {
      state[m.id] = {
        kind: "singles",
        votes: { left: m.siteVotes.left, right: m.siteVotes.right },
        selected:
          m.myPick === "left" || m.myPick === "right" ? (m.myPick as Side) : null,
      };
    }
    void card;
  }
  return state;
}

function normalizeStoredEntry(entry: VoteState, match: PleMatchCard): VoteState {
  if (isMultiMatch(match)) {
    const count = match.competitors.length;
    const base =
      entry.kind === "multi" ? [...entry.votes] : emptyMultiVotes(count);
    while (base.length < count) base.push(0);
    const votes = base.slice(0, count);

    if (entry.kind === "multi" && entry.selected !== null && entry.selected < count) {
      votes[entry.selected] = 1;
      return { kind: "multi", votes, selected: entry.selected };
    }
    return { kind: "multi", votes: emptyMultiVotes(count), selected: null };
  }

  if (entry.kind === "singles") {
    if (entry.selected === "left") {
      return { kind: "singles", votes: { left: 1, right: 0 }, selected: "left" };
    }
    if (entry.selected === "right") {
      return { kind: "singles", votes: { left: 0, right: 1 }, selected: "right" };
    }
  }

  return { kind: "singles", votes: emptySinglesVotes(), selected: null };
}

type PleMatchBracketProps = {
  slug: PleSlug;
  className?: string;
};

type BracketUiState = {
  board: PleBoard | null;
  useApi: boolean;
  offline: boolean;
};

const initialBracketUiState: BracketUiState = {
  board: null,
  useApi: false,
  offline: false,
};

export function PleMatchBracket({ slug, className }: PleMatchBracketProps) {
  const staticMatches = getPleMatches(slug);
  const bracketTheme = getBracketTheme(slug);
  const clientId = useMemo(() => getPleClientId(), []);

  const [ui, setUi] = useState<BracketUiState>(initialBracketUiState);
  const [state, setState] = useState<StoredBracketState>(() =>
    buildInitialState(staticMatches)
  );

  const patchUi = (patch: Partial<BracketUiState>) =>
    setUi((prev) => ({ ...prev, ...patch }));

  const matches: PleBoardMatch[] =
    ui.useApi && ui.board ? ui.board.matches : staticMatches;
  const showResults = ui.useApi && ui.board?.status === "finished";

  useEffect(() => {
    let cancelled = false;
    const staticCards = getPleMatches(slug);

    async function bootstrap() {
      try {
        let data = await fetchPleBoard(slug, clientId);
        if (!data || data.matches.length === 0) {
          data = await syncPleFromClient(slug, staticCards);
        }
        if (cancelled) return;
        patchUi({ board: data, useApi: true, offline: false });
        setState(stateFromBoard(data));
      } catch {
        if (cancelled) return;
        patchUi({ board: null, useApi: false, offline: true });
        setState(buildInitialState(staticCards));
        try {
          const raw = localStorage.getItem(storageKey(slug));
          if (raw) {
            const parsed = JSON.parse(raw) as StoredBracketState;
            setState((prev) => {
              const next = { ...prev };
              for (const m of staticCards) {
                if (parsed[m.id]) {
                  next[m.id] = normalizeStoredEntry(parsed[m.id], m);
                }
              }
              return next;
            });
          }
        } catch {
          /* ignore */
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [slug, clientId]);

  useEffect(() => {
    if (!ui.offline) return;

    let cancelled = false;
    const staticCards = getPleMatches(slug);

    async function retryConnect() {
      try {
        let data = await fetchPleBoard(slug, clientId);
        if (!data || data.matches.length === 0) {
          data = await syncPleFromClient(slug, staticCards);
        }
        if (cancelled) return;
        patchUi({ board: data, useApi: true, offline: false });
        setState(stateFromBoard(data));
      } catch {
        // keep offline until next retry
      }
    }

    const timer = setInterval(() => {
      void retryConnect();
    }, 4000);

    void retryConnect();
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [slug, clientId, ui.offline]);

  useEffect(() => {
    if (!ui.useApi) return;
    return subscribePleLive(
      slug,
      clientId,
      (live) => {
        patchUi({ board: live });
        setState(stateFromBoard(live));
      },
      () => {
        /* SSE 실패 시 폴링 없이 마지막 스냅샷 유지 */
      }
    );
  }, [slug, clientId, ui.useApi]);

  const persistLocal = useCallback(
    (next: StoredBracketState) => {
      if (ui.useApi) return;
      try {
        localStorage.setItem(storageKey(slug), JSON.stringify(next));
      } catch {
        /* quota */
      }
    },
    [slug, ui.useApi]
  );

  const handleSelect = useCallback(
    async (match: PleMatchCard, pick: Side | number) => {
      if (ui.useApi && ui.board) {
        const pickStr = typeof pick === "number" ? String(pick) : pick;
        try {
          const updated = await submitPlePrediction(slug, match.id, pickStr, clientId);
          patchUi({ board: updated });
          setState(stateFromBoard(updated));
        } catch {
          /* ignore */
        }
        return;
      }

      setState((prev) => {
        const current = prev[match.id];
        if (!current || current.selected !== null) return prev;

        if (isMultiMatch(match) && current.kind === "multi" && typeof pick === "number") {
          const votes = [...current.votes];
          votes[pick] = (votes[pick] ?? 0) + 1;
          const next = {
            ...prev,
            [match.id]: { kind: "multi" as const, votes, selected: pick },
          };
          persistLocal(next);
          return next;
        }

        if (!isMultiMatch(match) && current.kind === "singles" && (pick === "left" || pick === "right")) {
          const votes = { ...current.votes };
          if (pick === "left") votes.left += 1;
          else votes.right += 1;
          const next = {
            ...prev,
            [match.id]: { kind: "singles" as const, votes, selected: pick },
          };
          persistLocal(next);
          return next;
        }

        return prev;
      });
    },
    [ui.useApi, ui.board, slug, clientId, persistLocal]
  );

  if (matches.length === 0) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="text-lg font-bold text-stone-50">전체 경기 · 예측</h2>
        <p className="mt-1 text-xs text-stone-500">
          한 번 선택하면 변경할 수 없습니다 · 사이트 투표와 북메이커 승률은 별도 표시
          {ui.useApi && ui.board?.status === "finished" && (
            <span className="ml-1 text-emerald-400">· {BRACKET_LABELS.liveResults}</span>
          )}
        </p>
        {ui.offline && (
          <p className="mt-1 text-xs text-amber-500/90">
            서버 연결 없음 — 로컬 예측만 저장됩니다
          </p>
        )}
      </div>
      <ul className="space-y-4">
        {matches.map((matchRow) => {
          const match = boardMatchesToCards([matchRow])[0]!;
          const entry =
            state[match.id] ??
            (isMultiMatch(match)
              ? {
                  kind: "multi" as const,
                  votes: emptyMultiVotes(match.competitors.length),
                  selected: null,
                }
              : {
                  kind: "singles" as const,
                  votes: emptySinglesVotes(),
                  selected: null,
                });

          const votes = entry.kind === "multi" ? entry.votes : entry.votes;
          const selected = entry.selected;

          return (
            <li key={match.id}>
              <MatchBracketCard
                match={match}
                bracketTheme={bracketTheme}
                votes={votes}
                selected={selected}
                locked={selected !== null}
                onSelect={(pick) => handleSelect(match, pick)}
                result={matchRow.result}
                showResults={showResults && !!matchRow.result}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
