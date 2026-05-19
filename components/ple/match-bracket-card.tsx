"use client";

import { cn } from "@/lib/utils";
import { BRACKET_LABELS } from "@/lib/bracket-labels";
import { normalizedMultiMarket, normalizedTwoWayMarket } from "@/lib/betting-odds";
import type { PleBracketTheme, BracketSideStyle } from "@/lib/wwe-ple-bracket-theme";
import type { PleCompetitor, PleMatchCard, PleMatchResultHint } from "@/lib/wwe-ple-matches";
import { isMultiMatch } from "@/lib/wwe-ple-matches";
import type { PleMatchResult } from "@/lib/ple-api";

type Side = "left" | "right";

type SinglesVotes = { left: number; right: number };
type MultiVotes = number[];

type MatchBracketCardProps = {
  match: PleMatchCard;
  bracketTheme: PleBracketTheme;
  votes: SinglesVotes | MultiVotes;
  selected: Side | number | null;
  locked: boolean;
  onSelect: (pick: Side | number) => void;
  result?: PleMatchResult | PleMatchResultHint | null;
  showResults?: boolean;
};

function pickOutcome(
  result: PleMatchResult | PleMatchResultHint | null | undefined,
  format: "singles" | "multi",
  index: Side | number
): "win" | "loss" | null {
  if (!result) return null;
  if (format === "singles" && (index === "left" || index === "right")) {
    if (result.winnerSide === index) return "win";
    if (result.winnerSide) return "loss";
    return null;
  }
  if (format === "multi" && typeof index === "number" && result.winnerIndex === index) {
    return "win";
  }
  if (format === "multi" && typeof result.winnerIndex === "number") {
    return "loss";
  }
  return null;
}

function ChampionBelt() {
  return (
    <span className="text-base leading-none" aria-hidden title={BRACKET_LABELS.championTitle}>
      {BRACKET_LABELS.trophy}
    </span>
  );
}

function CompetitorPick({
  competitor,
  nameStyle,
  isSelected,
  isOtherSelected,
  locked,
  onSelect,
  compact,
  outcome,
}: {
  competitor: PleCompetitor;
  nameStyle: BracketSideStyle;
  isSelected: boolean;
  isOtherSelected: boolean;
  locked: boolean;
  onSelect: () => void;
  compact?: boolean;
  outcome?: "win" | "loss" | null;
}) {
  const resultsLocked = outcome !== null && outcome !== undefined;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked || resultsLocked}
      aria-pressed={isSelected}
      aria-disabled={locked || resultsLocked}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 border-0 transition-colors",
        compact ? "min-h-[56px] px-2 py-2" : "min-h-[72px] flex-1 px-2 py-3",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-stone-400",
        outcome === "win" && "bg-emerald-100 ring-2 ring-inset ring-emerald-500",
        outcome === "loss" && "bg-stone-200/90 opacity-75",
        outcome == null && isSelected && nameStyle.selectedBg,
        outcome == null && !isSelected && !isOtherSelected && !locked && "bg-white hover:bg-stone-50",
        outcome == null && !isSelected && isOtherSelected && "bg-stone-100/80",
        outcome == null && !isSelected && locked && "bg-stone-50",
        (locked || resultsLocked) && "cursor-default"
      )}
    >
      <div className="flex items-center gap-1.5">
        {competitor.isChampion && <ChampionBelt />}
        <span
          className={cn(
            "text-center font-semibold",
            compact ? "text-xs sm:text-sm" : "text-sm sm:text-base",
            outcome === "win" ? "text-emerald-900" : nameStyle.nameText,
            outcome === "loss" && "text-stone-500"
          )}
        >
          {competitor.name}
        </span>
      </div>
      {outcome === "win" && (
        <span className="mt-0.5 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {BRACKET_LABELS.win}
        </span>
      )}
      {outcome === "loss" && (
        <span className="mt-0.5 rounded bg-stone-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {BRACKET_LABELS.loss}
        </span>
      )}
      {outcome == null && isSelected && (
        <span
          className={cn(
            "mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white",
            nameStyle.headerBg
          )}
        >
          {BRACKET_LABELS.myPick}
        </span>
      )}
    </button>
  );
}

function SiteVoteBarTwoWay({
  votes,
  leftBarClass,
  rightBarClass,
}: {
  votes: SinglesVotes;
  leftBarClass: string;
  rightBarClass: string;
}) {
  const total = votes.left + votes.right;

  if (total === 0) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="font-medium text-stone-500">{BRACKET_LABELS.siteVote}</span>
          <span className="text-stone-400">{BRACKET_LABELS.noVotesYet}</span>
        </div>
        <div className="h-2 rounded-full bg-stone-200" />
      </div>
    );
  }

  const leftPercent = Math.round((votes.left / total) * 1000) / 10;
  const rightPercent = Math.round((votes.right / total) * 1000) / 10;

  return (
    <DualStatBar
      label={BRACKET_LABELS.siteVote}
      leftPercent={leftPercent}
      rightPercent={rightPercent}
      leftBarClass={leftBarClass}
      rightBarClass={rightBarClass}
    />
  );
}

function SiteVoteMulti({
  competitors,
  votes,
  barClass,
}: {
  competitors: PleCompetitor[];
  votes: MultiVotes;
  barClass: string;
}) {
  const total = votes.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="font-medium text-stone-500">{BRACKET_LABELS.siteVote}</span>
          <span className="text-stone-400">{BRACKET_LABELS.noVotesYet}</span>
        </div>
        <div className="h-2 rounded-full bg-stone-200" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-medium text-stone-500 sm:text-xs">
        {BRACKET_LABELS.siteVote}
      </span>
      <ul className="space-y-1.5">
        {competitors.map((c, i) => {
          const pct = Math.round((votes[i]! / total) * 1000) / 10;
          return (
            <li key={`${c.name}-${i}`} className="space-y-0.5">
              <div className="flex justify-between gap-2 text-[10px] sm:text-xs">
                <span className="truncate font-medium text-stone-600">{c.name}</span>
                <span className="shrink-0 tabular-nums font-semibold text-stone-700">{pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
                <div className={cn("h-full transition-all", barClass)} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DualStatBar({
  label,
  leftPercent,
  rightPercent,
  leftBarClass,
  rightBarClass,
  muted,
}: {
  label: string;
  leftPercent: number;
  rightPercent: number;
  leftBarClass: string;
  rightBarClass: string;
  muted?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] sm:text-xs">
        <span className={cn("font-medium", muted ? "text-stone-400" : "text-stone-500")}>
          {label}
        </span>
        <span className="tabular-nums text-stone-600">
          <span className="font-semibold">{leftPercent}%</span>
          <span className="mx-1 text-stone-300">{BRACKET_LABELS.percentSep}</span>
          <span className="font-semibold">{rightPercent}%</span>
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className={cn("h-full transition-all", leftBarClass)}
          style={{ width: `${leftPercent}%` }}
        />
        <div
          className={cn("h-full transition-all", rightBarClass)}
          style={{ width: `${rightPercent}%` }}
        />
      </div>
    </div>
  );
}

function BookmakerMulti({
  competitors,
  decimals,
}: {
  competitors: PleCompetitor[];
  decimals: number[];
}) {
  const percents = normalizedMultiMarket(decimals);

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-medium text-stone-400 sm:text-xs">
        {BRACKET_LABELS.bookmaker}
      </span>
      <ul className="space-y-1">
        {competitors.map((c, i) => (
          <li
            key={`${c.name}-${i}`}
            className="flex justify-between gap-2 text-[10px] tabular-nums text-stone-500 sm:text-xs"
          >
            <span className="truncate">{c.name}</span>
            <span className="shrink-0 font-semibold">{percents[i]}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MatchBracketCard({
  match,
  bracketTheme,
  votes,
  selected,
  locked,
  onSelect,
  result,
  showResults = false,
}: MatchBracketCardProps) {
  const cardStyle = bracketTheme[match.cardVariant];
  const leftStyle = bracketTheme.sideA;
  const rightStyle = bracketTheme.sideB;
  const displayResults = showResults && !!result;

  if (isMultiMatch(match)) {
    const multiVotes = votes as MultiVotes;
    const selectedIndex = typeof selected === "number" ? selected : null;
    const barClass = leftStyle.voteBar;

    return (
      <article className="flex overflow-hidden rounded-sm shadow-md">
        <div className="w-1.5 shrink-0 bg-black" aria-hidden />
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "px-3 py-2 text-center text-xs font-semibold leading-snug sm:text-sm",
              cardStyle.headerBg,
              cardStyle.headerText
            )}
          >
            {match.title}
          </div>

          <div className={cn("border-2 border-t-0 bg-white p-2", cardStyle.border)}>
            <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-wide text-stone-400">
              {BRACKET_LABELS.participants}
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {match.competitors.map((competitor, index) => {
                const style = index % 2 === 0 ? leftStyle : rightStyle;
                return (
                  <CompetitorPick
                    key={`${competitor.name}-${index}`}
                    competitor={competitor}
                    nameStyle={style}
                    isSelected={selectedIndex === index}
                    isOtherSelected={selectedIndex !== null && selectedIndex !== index}
                    locked={locked}
                    onSelect={() => onSelect(index)}
                    compact
                    outcome={
                      displayResults ? pickOutcome(result, "multi", index) : null
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5 border-2 border-t-0 bg-stone-50 px-3 py-2.5 sm:px-4">
            <SiteVoteMulti
              competitors={match.competitors}
              votes={multiVotes}
              barClass={barClass}
            />
            {match.bookmakerDecimal && (
              <BookmakerMulti
                competitors={match.competitors}
                decimals={match.bookmakerDecimal}
              />
            )}
            <p className="text-center text-[9px] text-stone-400">{BRACKET_LABELS.bookNote}</p>
          </div>
        </div>
      </article>
    );
  }

  const singlesVotes = votes as SinglesVotes;
  const book = normalizedTwoWayMarket(
    match.bookmakerDecimal.left,
    match.bookmakerDecimal.right
  );

  return (
    <article className="flex overflow-hidden rounded-sm shadow-md">
      <div className="w-1.5 shrink-0 bg-black" aria-hidden />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "px-3 py-2 text-center text-xs font-semibold leading-snug sm:text-sm",
            cardStyle.headerBg,
            cardStyle.headerText
          )}
        >
          {match.title}
        </div>

        <div className={cn("flex border-2 border-t-0 bg-white", cardStyle.border)}>
          <CompetitorPick
            competitor={match.left}
            nameStyle={leftStyle}
            isSelected={selected === "left"}
            isOtherSelected={selected === "right"}
            locked={locked}
            onSelect={() => onSelect("left")}
            outcome={displayResults ? pickOutcome(result, "singles", "left") : null}
          />
          <div className="w-px shrink-0 bg-stone-200" aria-hidden />
          <CompetitorPick
            competitor={match.right}
            nameStyle={rightStyle}
            isSelected={selected === "right"}
            isOtherSelected={selected === "left"}
            locked={locked}
            onSelect={() => onSelect("right")}
            outcome={displayResults ? pickOutcome(result, "singles", "right") : null}
          />
        </div>

        <div className="space-y-2.5 border-2 border-t-0 bg-stone-50 px-3 py-2.5 sm:px-4">
          <SiteVoteBarTwoWay
            votes={singlesVotes}
            leftBarClass={leftStyle.voteBar}
            rightBarClass={rightStyle.voteBar}
          />
          <DualStatBar
            label={BRACKET_LABELS.bookmaker}
            leftPercent={book.left}
            rightPercent={book.right}
            leftBarClass="bg-stone-500"
            rightBarClass="bg-stone-400"
            muted
          />
          <p className="text-center text-[9px] text-stone-400">{BRACKET_LABELS.bookNote}</p>
        </div>
      </div>
    </article>
  );
}
