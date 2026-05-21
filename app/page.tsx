"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Database, RefreshCw } from "lucide-react";
import { GeminiChatPanel } from "@/components/gemini-chat-panel";
import { PleEventGrid } from "@/components/ple-event-grid";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

interface SampleDataItem {
  [key: string]: string | number | boolean | null;
}

/** Soft warm “arena dim” — low contrast, easy on the eyes. */
function WweArenaShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-full min-w-0 overflow-x-hidden bg-stone-900 text-stone-100">
      {/* Gentle overhead wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_130%_85%_at_50%_-35%,rgba(168,162,158,0.2),transparent_62%)]"
      />
      {/* Warm corner depth (muted, no saturated red/gold) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_100%,rgba(120,113,108,0.14),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_100%_0%,rgba(87,83,78,0.12),transparent_52%)]"
      />
      {/* Barely-there grain (avoids harsh stripes) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[repeating-linear-gradient(118deg,#fafaf9_0px,#fafaf9_1px,transparent_1px,transparent_24px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950/25 via-transparent to-stone-950/75"
      />
      <div className="relative z-10">{children}</div>
    </main>
  );
}

function TitanicQaAppContent() {
  const searchParams = useSearchParams();
  const currentView =
    searchParams.get("view") === "data" ? "data" : "qa";

  return (
    <WweArenaShell>
      {currentView === "qa" ? (
        <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col">
          <section className="shrink-0 px-4 py-8 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl md:text-5xl">
                <span className="block">WWE PLE를</span>
                <span className="block">색 다르게 즐기는 방법</span>
              </h2>
              <p className="mt-4 text-balance text-lg font-medium text-stone-400 sm:text-xl">
                결과를 예측해서 Head of Table이 되어보자!
              </p>
            </div>
          </section>
          <div className="mx-auto w-full max-w-5xl shrink-0 px-4 pb-4">
            <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-stone-500">
              월별 PLE
            </p>
            <PleEventGrid variant="compact" />
          </div>
          <div className="min-h-0 flex-1" aria-hidden />
          <div className="mx-auto mt-auto w-full max-w-2xl shrink-0 px-4 pb-6 pt-2">
            <GeminiChatPanel className="min-h-[280px] h-[min(46dvh,560px)] max-h-[52dvh]" />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-6">
          <TitanicSampleDataPage />
        </div>
      )}
    </WweArenaShell>
  );
}

export default function TitanicQaApp() {
  return (
    <Suspense
      fallback={
        <WweArenaShell>
          <div className="mx-auto max-w-2xl px-4 py-6" />
        </WweArenaShell>
      }
    >
      <TitanicQaAppContent />
    </Suspense>
  );
}

function TitanicSampleDataPage() {
  const [data, setData] = useState<SampleDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/titanic/data`);

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result: SampleDataItem[] = await response.json();
      setData(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatValue = (value: string | number | boolean | null): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "예" : "아니오";
    return String(value);
  };

  const formatKey = (key: string): string => {
    const keyMap: Record<string, string> = {
      PassengerId: "승객 ID",
      Survived: "생존 여부",
      Pclass: "객실 등급",
      Name: "이름",
      Sex: "성별",
      Age: "나이",
      SibSp: "형제/배우자 수",
      Parch: "부모/자녀 수",
      Ticket: "티켓 번호",
      Fare: "요금",
      Cabin: "객실",
      Embarked: "탑승항",
    };
    return keyMap[key] || key;
  };

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-zinc-400" />
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400 mb-3">
            {errorMessage}
          </p>
          <button
            onClick={fetchData}
            aria-label="다시 불러오기"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-red-300 dark:border-red-700 bg-white dark:bg-zinc-900 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <RefreshCw size={14} />
            다시 불러오기
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && data.length === 0 && (
        <div className="text-center text-zinc-400 dark:text-zinc-500 py-12">
          <Database size={48} className="mx-auto mb-3 opacity-50" />
          <p>데이터가 없습니다</p>
        </div>
      )}

      {!isLoading && data.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            총 {data.length}개의 레코드
          </p>

          {data.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatKey(key)}
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
