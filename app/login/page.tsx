"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const isSignup = mode === "signup";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="relative min-h-[calc(100dvh-5.5rem)] overflow-hidden bg-stone-900 text-stone-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_130%_85%_at_50%_-35%,rgba(168,162,158,0.2),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_100%,rgba(120,113,108,0.14),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_100%_0%,rgba(87,83,78,0.12),transparent_52%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[repeating-linear-gradient(118deg,#fafaf9_0px,#fafaf9_1px,transparent_1px,transparent_24px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950/30 via-stone-900/40 to-stone-950/85"
      />

      <section className="relative z-10 flex min-h-[calc(100dvh-5.5rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[460px] rounded-3xl border border-stone-700/70 bg-stone-950/58 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              KayFabe
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-50">
              {isSignup ? "회원가입" : "로그인"}
            </h1>
            <p className="mt-2 text-sm text-stone-400">
              {isSignup
                ? "계정을 만들고 WWE PLE 예측에 참여하세요."
                : "계정으로 접속해 예측 기록을 이어가세요."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-300">
                  닉네임
                </span>
                <span className="flex items-center gap-3 rounded-2xl border border-stone-700/80 bg-stone-900/70 px-4 py-3 text-stone-300 transition-colors focus-within:border-stone-400 focus-within:bg-stone-900">
                  <UserRound className="size-5 text-stone-500" />
                  <input
                    type="text"
                    name="nickname"
                    autoComplete="nickname"
                    placeholder="KayFabe 닉네임"
                    className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-600 outline-none"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-300">
                이메일
              </span>
              <span className="flex items-center gap-3 rounded-2xl border border-stone-700/80 bg-stone-900/70 px-4 py-3 text-stone-300 transition-colors focus-within:border-stone-400 focus-within:bg-stone-900">
                <Mail className="size-5 text-stone-500" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-600 outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-300">
                비밀번호
              </span>
              <span className="flex items-center gap-3 rounded-2xl border border-stone-700/80 bg-stone-900/70 px-4 py-3 text-stone-300 transition-colors focus-within:border-stone-400 focus-within:bg-stone-900">
                <LockKeyhole className="size-5 text-stone-500" />
                <input
                  type="password"
                  name="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder="비밀번호"
                  className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-600 outline-none"
                />
              </span>
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-300">
                  비밀번호 확인
                </span>
                <span className="flex items-center gap-3 rounded-2xl border border-stone-700/80 bg-stone-900/70 px-4 py-3 text-stone-300 transition-colors focus-within:border-stone-400 focus-within:bg-stone-900">
                  <LockKeyhole className="size-5 text-stone-500" />
                  <input
                    type="password"
                    name="passwordConfirm"
                    autoComplete="new-password"
                    placeholder="비밀번호 확인"
                    className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-600 outline-none"
                  />
                </span>
              </label>
            )}

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-2xl border border-stone-500/40 bg-stone-200 text-sm font-bold text-stone-950 shadow-lg shadow-black/20 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
            >
              {isSignup ? "회원가입" : "로그인"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="rounded-full border border-stone-700/80 bg-stone-900/55 px-3 py-1.5 text-xs font-medium text-stone-400 transition-colors hover:border-stone-500 hover:bg-stone-800/80 hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60"
            >
              {isSignup ? "로그인으로 돌아가기" : "회원가입"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
