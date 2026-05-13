"use client";

import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from "react";
import { Send, RefreshCw, Loader2, Database, MessageCircle, LogIn } from "lucide-react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

interface Message {
  role: "user" | "assistant";
  text: string;
  ts: string;
  confidence?: number;
  sources?: string[];
}

interface SampleDataItem {
  [key: string]: string | number | boolean | null;
}

export default function TitanicQaApp() {
  const [currentView, setCurrentView] = useState<"qa" | "data">("qa");

  const handleLogin = () => {
    // 로그인 로직 구현 예정
    console.log("로그인 버튼 클릭");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-zinc-700 dark:text-zinc-300" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Titanic QA
            </span>
          </div>
          <button
            onClick={handleLogin}
            aria-label="로그인"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <LogIn size={16} />
            로그인
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Titanic QA Assistant
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            타이타닉 데이터 기반 질의응답
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setCurrentView("qa")}
            aria-label="QA 채팅 보기"
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              currentView === "qa"
                ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
            }`}
          >
            <MessageCircle size={16} />
            QA 채팅
          </button>
          <button
            onClick={() => setCurrentView("data")}
            aria-label="샘플 데이터 보기"
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              currentView === "data"
                ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
            }`}
          >
            <Database size={16} />
            샘플 데이터
          </button>
        </nav>

        {/* Views */}
        {currentView === "qa" ? <TitanicQAPage /> : <TitanicSampleDataPage />}
      </div>
    </main>
  );
}

function TitanicQAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendQuestion = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: question.trim(),
      ts: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setErrorMessage(null);
    setLastQuestion(question.trim());

    try {
      const response = await fetch(`${apiBaseUrl}/titanic/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data: { answer: string; confidence: number; sources: string[] } =
        await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        text: data.answer,
        ts: new Date().toISOString(),
        confidence: data.confidence,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLastQuestion(null);
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
    sendQuestion(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(input);
    }
  };

  const handleRetry = () => {
    if (lastQuestion) {
      setErrorMessage(null);
      sendQuestion(lastQuestion);
    }
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[400px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-400 dark:text-zinc-500 py-12">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p>질문을 입력하여 대화를 시작하세요</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
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

              {msg.role === "assistant" && msg.confidence !== undefined && (
                <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
                  <p>
                    신뢰도:{" "}
                    <span className="font-medium">
                      {(msg.confidence * 100).toFixed(1)}%
                    </span>
                  </p>
                  {msg.sources && msg.sources.length > 0 && (
                    <p className="mt-1">
                      출처: {msg.sources.join(", ")}
                    </p>
                  )}
                </div>
              )}

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

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400 mb-2">
            {errorMessage}
          </p>
          <button
            onClick={handleRetry}
            aria-label="재시도"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-red-300 dark:border-red-700 bg-white dark:bg-zinc-900 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <RefreshCw size={14} />
            재시도
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="question-input" className="sr-only">
            질문 입력
          </label>
          <textarea
            ref={textareaRef}
            id="question-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 25세 남성 3등석 생존 가능성은?"
            maxLength={500}
            rows={2}
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:border-transparent disabled:opacity-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="질문 전송"
          className="self-end h-[52px] w-[52px] flex items-center justify-center border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>

      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 text-center">
        Enter로 전송, Shift+Enter로 줄바꿈
      </p>
    </div>
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
      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-zinc-400" />
        </div>
      )}

      {/* Error */}
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

      {/* Data Cards */}
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
