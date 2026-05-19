"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function MyInfoPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center text-stone-400">
        불러오는 중...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-3xl border border-stone-700/70 bg-stone-950/58 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          KayFabe
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-50">
          내 정보
        </h1>
        <dl className="mt-8 space-y-4 text-sm">
          <InfoRow label="닉네임" value={user.nickname} />
          <InfoRow label="이메일" value={user.email} />
          <InfoRow label="역할" value={user.role} />
        </dl>
        <div className="mt-8">
          <Button variant="outline" asChild className="w-full border-stone-600/70">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-700/80 bg-stone-900/70 px-4 py-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-1 font-medium text-stone-100">{value}</dd>
    </div>
  );
}
