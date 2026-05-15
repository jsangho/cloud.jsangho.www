"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WeatherWidget } from "@/components/weather-widget";
import { cn } from "@/lib/utils";

function navLinkClass(active: boolean) {
  return cn(
    "border-stone-600/70 bg-stone-800/45 text-stone-200 shadow-none hover:bg-stone-700/65 hover:text-stone-50 hover:border-stone-500 focus-visible:ring-stone-500/40",
    active &&
      "border-stone-400 bg-stone-600 text-stone-50 hover:bg-stone-600 hover:border-stone-400 hover:text-stone-50"
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isPle = pathname === "/ple";
  const isResults = pathname === "/results";
  const isRankings = pathname === "/rankings";
  const isTitanicHome = pathname === "/titanic-home";

  const loginBtnClass =
    "border-stone-600/70 bg-stone-800/45 text-stone-200 shadow-none hover:bg-stone-700/65 hover:text-stone-50 hover:border-stone-500 focus-visible:ring-stone-500/40";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-700/45 bg-stone-900/82 backdrop-blur-md supports-[backdrop-filter]:bg-stone-900/68">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-y-0">
        <div className="text-center sm:text-left">
          <Link href="/" className="block transition-colors hover:opacity-90">
            <h1 className="text-xl font-bold tracking-tight text-stone-50">
              KayFabe
            </h1>
          </Link>
          <p className="mt-1 text-sm text-stone-400 tracking-wide">
            WWE PLE 예측 게임
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-center">
          <Button variant="outline" size="sm" asChild className={navLinkClass(isPle)}>
            <Link href="/ple" aria-current={isPle ? "page" : undefined}>
              PLE
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className={navLinkClass(isResults)}>
            <Link href="/results" aria-current={isResults ? "page" : undefined}>
              결과
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className={navLinkClass(isRankings)}>
            <Link href="/rankings" aria-current={isRankings ? "page" : undefined}>
              순위표
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <WeatherWidget />
          <Button variant="outline" size="sm" asChild className={navLinkClass(isTitanicHome)}>
            <Link href="/titanic-home" aria-current={isTitanicHome ? "page" : undefined}>
              [타이타닉]
            </Link>
          </Button>
          <Button variant="outline" size="sm" className={loginBtnClass}>
            로그인
          </Button>
        </div>
      </div>
    </header>
  );
}
