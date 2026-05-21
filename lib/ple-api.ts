import { apiBaseUrl, requestTimeoutMs } from "@/lib/api";
import type { PleMatchCard } from "@/lib/wwe-ple-matches";
import type { PleSlug } from "@/lib/wwe-ple";
import { getPleBySlug } from "@/lib/wwe-ple";

export type PleMatchResult = {
  winnerSide?: "left" | "right";
  winnerIndex?: number;
  winnerName?: string;
};

export type PleBoardMatch = {
  id: string;
  dbId: number;
  title: string;
  cardVariant: "sideA" | "sideB";
  format: "singles" | "multi";
  left?: { name: string; isChampion?: boolean };
  right?: { name: string; isChampion?: boolean };
  competitors?: { name: string; isChampion?: boolean }[];
  bookmakerDecimal?: PleMatchCard["bookmakerDecimal"] | number[];
  status: string;
  result?: PleMatchResult | null;
  siteVotes: { left: number; right: number; multi: number[] };
  locked: boolean;
  myPick?: string | null;
};

export type PleBoard = {
  slug: string;
  label: string;
  month: number;
  year: number;
  status: "upcoming" | "live" | "finished";
  finishedAt?: string | null;
  matches: PleBoardMatch[];
  updatedAt: string;
};

function boardMatchToCard(m: PleBoardMatch): PleMatchCard {
  const base = {
    id: m.id,
    title: m.title,
    cardVariant: m.cardVariant,
  };
  if (m.format === "multi") {
    return {
      ...base,
      format: "multi",
      competitors: m.competitors ?? [],
      bookmakerDecimal: m.bookmakerDecimal as number[] | undefined,
    };
  }
  return {
    ...base,
    format: "singles",
    left: m.left!,
    right: m.right!,
    bookmakerDecimal: m.bookmakerDecimal as { left: number; right: number },
  };
}

export function boardMatchesToCards(matches: PleBoardMatch[]): PleMatchCard[] {
  return matches.map(boardMatchToCard);
}

export function buildSyncPayload(slug: PleSlug, cards: PleMatchCard[]) {
  const ple = getPleBySlug(slug);
  if (!ple) throw new Error(`Unknown PLE: ${slug}`);
  return {
    slug,
    label: ple.label,
    month: ple.month,
    year: 2026,
    matches: cards,
  };
}

export async function syncPleFromClient(slug: PleSlug, cards: PleMatchCard[]): Promise<PleBoard> {
  const res = await fetch(`${apiBaseUrl}/ple/${slug}/sync-from-client`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildSyncPayload(slug, cards)),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? res.statusText);
  }
  return res.json();
}

export async function fetchPleBoard(
  slug: PleSlug,
  clientId?: string
): Promise<PleBoard | null> {
  const q = clientId ? `?client_id=${encodeURIComponent(clientId)}` : "";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
  const res = await fetch(`${apiBaseUrl}/ple/${slug}${q}`, {
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export type MatchResultPayload = {
  winnerSide?: "left" | "right";
  winnerIndex?: number;
  winnerName?: string;
  status?: "scheduled" | "live" | "finished";
};

export async function submitPleMatchResult(
  slug: PleSlug,
  matchKey: string,
  body: MatchResultPayload
): Promise<PleBoard> {
  const res = await fetch(
    `${apiBaseUrl}/ple/${slug}/matches/${matchKey}/result`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        winnerSide: body.winnerSide,
        winnerIndex: body.winnerIndex,
        winnerName: body.winnerName,
        status: body.status ?? "finished",
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? res.statusText);
  }
  return res.json();
}

export async function submitPlePrediction(
  slug: PleSlug,
  matchKey: string,
  pick: string,
  clientId: string
): Promise<PleBoard> {
  const res = await fetch(`${apiBaseUrl}/ple/${slug}/matches/${matchKey}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pick, clientId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? res.statusText);
  }
  return res.json();
}

export async function setPleMatchResult(
  slug: PleSlug,
  matchKey: string,
  payload: PleMatchResult
): Promise<PleBoard> {
  const res = await fetch(`${apiBaseUrl}/ple/${slug}/matches/${matchKey}/result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? res.statusText);
  }
  return res.json();
}

export function subscribePleLive(
  slug: PleSlug,
  clientId: string,
  onBoard: (board: PleBoard) => void,
  onError?: (err: unknown) => void
): () => void {
  const url = `${apiBaseUrl}/ple/${slug}/live?client_id=${encodeURIComponent(clientId)}`;
  const source = new EventSource(url);

  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as PleBoard & { error?: string };
      if (data.error) {
        onError?.(new Error(data.error));
        return;
      }
      onBoard(data);
    } catch (e) {
      onError?.(e);
    }
  };

  source.onerror = () => onError?.(new Error("SSE connection error"));

  return () => source.close();
}
