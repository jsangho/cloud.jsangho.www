"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

type UploadState =
  | { kind: "empty" }
  | { kind: "ready"; fileName: string; text: string };

export function TitanicCsvUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<UploadState>({ kind: "empty" });

  const ingestFile = useCallback((file: File | undefined) => {
    setError(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("CSV 파일(.csv)만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setState({ kind: "ready", fileName: file.name, text });
    };
    reader.onerror = () => {
      setError("파일을 읽는 중 오류가 발생했습니다.");
    };
    reader.readAsText(file, "UTF-8");
  }, []);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    ingestFile(file);
    e.target.value = "";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    ingestFile(file);
  };

  const summary =
    state.kind === "ready"
      ? (() => {
          const text = state.text;
          const lines = text.trim().length ? text.split(/\r?\n/).length : 0;
          const bytes = new TextEncoder().encode(text).length;
          const preview = text.slice(0, 900);
          return { lines, bytes, preview };
        })()
      : null;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={onInputChange}
      />

      <div className="space-y-8">
        <section aria-labelledby="upload-panel-title">
          <h2
            id="upload-panel-title"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500"
          >
            방식 1 · 업로드 창
          </h2>
          <button
            type="button"
            onClick={openPicker}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            aria-label="CSV 파일을 여기에 놓거나 클릭하여 선택"
            className={[
              "flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
              dragOver
                ? "border-zinc-900 bg-zinc-100"
                : "border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-50",
            ].join(" ")}
          >
            <Upload
              className="mb-3 size-10 text-zinc-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="text-base font-medium text-zinc-800">
              파일을 이 영역에 끌어다 놓기
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              또는 클릭해서 탐색기에서 선택
            </p>
          </button>
        </section>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide text-zinc-400">
            <span className="bg-white px-3">또는</span>
          </div>
        </div>

        <section aria-labelledby="upload-button-title">
          <h2
            id="upload-button-title"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500"
          >
            방식 2 · 업로드 버튼
          </h2>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={openPicker}
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
            >
              <Upload className="size-4" aria-hidden />
              CSV 업로드
            </button>
            <p className="max-w-xs text-center text-sm text-zinc-500 sm:text-left">
              버튼을 누르면 파일 선택 창이 열립니다.
            </p>
          </div>
        </section>
      </div>

      {error && (
        <p
          className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      {state.kind === "ready" && summary && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
          <p className="text-sm font-medium text-zinc-800">
            불러온 파일: {state.fileName}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {summary.lines.toLocaleString("ko-KR")}줄 ·{" "}
            {summary.bytes.toLocaleString("ko-KR")}바이트
          </p>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-700">
            {summary.preview}
            {state.text.length > summary.preview.length ? "\n…" : ""}
          </pre>
        </div>
      )}
    </>
  );
}
