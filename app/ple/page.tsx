import { PleEventGrid } from "@/components/ple-event-grid";

export default function PlePage() {
  return (
    <main className="min-h-[calc(100dvh-5.5rem)] w-full min-w-0 bg-stone-900 px-4 py-10 text-stone-100">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-stone-50 sm:text-3xl">
            월별 PLE
          </h1>
          <p className="mt-2 text-sm text-stone-400 sm:text-base">
            예측할 이벤트를 선택하세요
          </p>
        </header>
        <PleEventGrid variant="large" />
      </div>
    </main>
  );
}
