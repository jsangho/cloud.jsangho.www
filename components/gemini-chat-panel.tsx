"use client";

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  FormEvent,
} from "react";
import {
  Loader2,
  Mic,
  Plus,
  RefreshCw,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const MODEL_OPTIONS = [
  { value: "gemini-2.0-flash", label: "빠른 모델" },
  { value: "gemini-1.5-pro", label: "고성능 모델" },
] as const;

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  ts: string;
}

export function GeminiChatPanel({ className }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(MODEL_OPTIONS[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<{
    messages: ChatMessage[];
    model: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /** 백엔드 `/chat`은 `{ message: string }` 단일 필드만 받음 */
  function historyToMessage(history: ChatMessage[]): string {
    if (history.length === 1) return history[0].text.trim();
    return history
      .map((m) =>
        m.role === "user"
          ? `User: ${m.text.trim()}`
          : `Assistant: ${m.text.trim()}`
      )
      .join("\n");
  }

  const sendWithHistory = async (
    history: ChatMessage[],
    modelId: string
  ) => {
    const last = history[history.length - 1];
    if (!last || last.role !== "user" || !last.text.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setLastPayload({
      messages: history,
      model: modelId,
    });

    try {
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: historyToMessage(history),
        }),
      });

      const raw = await response.text();
      let data: { reply?: string; detail?: string | unknown } = {};
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        /* ignore */
      }

      if (!response.ok) {
        const detail = data.detail;
        let detailStr: string;
        if (typeof detail === "string") {
          detailStr = detail;
        } else if (Array.isArray(detail)) {
          detailStr = detail
            .map((item) =>
              typeof item === "object" &&
              item !== null &&
              "msg" in item &&
              typeof (item as { msg: unknown }).msg === "string"
                ? (item as { msg: string }).msg
                : JSON.stringify(item)
            )
            .join("; ");
        } else {
          detailStr = raw || `서버 오류: ${response.status}`;
        }
        throw new Error(detailStr);
      }

      const reply = data.reply?.trim();
      if (!reply) {
        throw new Error("빈 응답을 받았습니다.");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        text: reply,
        ts: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLastPayload(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      text,
      ts: new Date().toISOString(),
    };

    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    void sendWithHistory(next, model);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.requestSubmit();
    }
  };

  const handleRetry = () => {
    if (!lastPayload) return;
    setErrorMessage(null);
    void sendWithHistory(lastPayload.messages, lastPayload.model);
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startVoiceInput = () => {
    if (typeof window === "undefined") return;
    const w = window as typeof window & {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((ev: Event) => void) | null;
        onerror: (() => void) | null;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((ev: Event) => void) | null;
        onerror: (() => void) | null;
        start: () => void;
      };
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setErrorMessage("이 브라우저에서는 음성 입력을 지원하지 않습니다.");
      return;
    }
    const recognition = new SR();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: Event) => {
      const res = event as unknown as {
        results: { 0: { 0: { transcript: string } } };
      };
      const transcript = res.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        textareaRef.current?.focus();
      }
    };
    recognition.onerror = () => {
      setErrorMessage("음성 인식 중 오류가 발생했습니다.");
    };
    recognition.start();
  };

  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col h-[calc(100vh-14rem)]",
        className
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end gap-4 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={`${msg.ts}-${idx}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.role === "user"
                      ? "text-zinc-300 dark:text-zinc-600"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {formatTime(msg.ts)}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3">
                <Loader2 size={20} className="animate-spin text-zinc-500" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400 mb-2">
            {errorMessage}
          </p>
          {lastPayload && (
            <button
              type="button"
              onClick={handleRetry}
              aria-label="재시도"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-red-300 dark:border-red-700 bg-white dark:bg-zinc-900 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <RefreshCw size={14} />
              재시도
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="rounded-[1.35rem] border border-zinc-200/90 bg-white px-3 pt-2 pb-2 shadow-sm dark:border-zinc-600 dark:bg-zinc-800/80">
          <label htmlFor="gemini-input" className="sr-only">
            Gemini에게 물어보기
          </label>
          <textarea
            ref={textareaRef}
            id="gemini-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Gemini에게 물어보기"
            maxLength={8000}
            rows={2}
            disabled={isLoading}
            className="w-full resize-none border-0 bg-transparent px-1 py-1 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />

          <div className="mt-1 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-700/80">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                title="준비 중입니다"
                aria-label="첨부"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <Plus size={20} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                title="준비 중입니다"
                aria-label="도구"
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <SlidersHorizontal size={18} strokeWidth={1.75} />
                <span>도구</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={isLoading}
                  aria-label="모델 선택"
                  className="h-9 appearance-none rounded-full border border-zinc-200 bg-zinc-50 py-0 pl-3 pr-8 text-xs font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:ring-zinc-600"
                >
                  {MODEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px]">
                  ▼
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="전송"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={1.75} />
                )}
              </button>

              <button
                type="button"
                onClick={startVoiceInput}
                disabled={isLoading}
                aria-label="음성 입력"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <Mic size={18} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </form>

      <p className="text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        Gemini는 AI이며 인물 등에 관한 정보 제공 시 실수를 할 수 있습니다.{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-400"
        >
          개인 정보 보호 및 Gemini
        </a>
        <span className="mx-1 text-zinc-300 dark:text-zinc-600">·</span>
        Enter로 전송, Shift+Enter로 줄바꿈
      </p>
    </div>
  );
}
