"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const requestTimeoutMs = 5000;

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    if (isSignup) {
      const nickname = String(formData.get("nickname") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

      if (!nickname || !email || !password || !passwordConfirm) {
        alert("회원가입 입력란을 모두 작성해 주세요.");
        return;
      }

      if (password !== passwordConfirm) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      const signupMessage = `회원가입 입력값\n\n닉네임: ${nickname}\n이메일: ${email}\n비밀번호: ${password}\n비밀번호 확인: ${passwordConfirm}`;

      setIsSubmitting(true);
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, requestTimeoutMs);

      try {
        const response = await fetch(`${apiBaseUrl}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            nickname,
            email,
            password,
            passwordConfirm,
          }),
        });

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        alert(signupMessage);
      } catch (error) {
        alert(
          error instanceof DOMException && error.name === "AbortError"
            ? `${signupMessage}\n\n서버 응답이 ${requestTimeoutMs / 1000}초 이상 걸려 요청을 중단했습니다. 백엔드가 켜져 있는지 확인해 주세요.`
            : error instanceof Error
            ? `${signupMessage}\n\n서버 전송 실패: ${error.message}`
            : `${signupMessage}\n\n서버 전송에 실패했습니다.`
        );
      } finally {
        window.clearTimeout(timeoutId);
        setIsSubmitting(false);
      }
      return;
    }

    alert("로그인 입력이 완료되었습니다.");
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

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
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
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-2xl border border-stone-500/40 bg-stone-200 text-sm font-bold text-stone-950 shadow-lg shadow-black/20 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
            >
              {isSubmitting ? "전송 중..." : isSignup ? "회원가입" : "로그인"}
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
