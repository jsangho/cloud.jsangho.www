"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlePickerDialog } from "@/components/ple-picker-dialog";
import { WeatherWidget } from "@/components/weather-widget";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

function navLinkClass(active: boolean) {
  return cn(
    "border-stone-600/70 bg-stone-800/45 text-stone-200 shadow-none hover:bg-stone-700/65 hover:text-stone-50 hover:border-stone-500 focus-visible:ring-stone-500/40",
    active &&
      "border-stone-400 bg-stone-600 text-stone-50 hover:bg-stone-600 hover:border-stone-400 hover:text-stone-50"
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        navLinkClass(active)
      )}
      {...(active ? { "aria-current": "page" as const } : {})}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const router = useRouter();
  const { user, logout, isReady } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPle = mounted && (pathname === "/ple" || pathname.startsWith("/ple/"));
  const isResults = mounted && pathname === "/results";
  const isRankings = mounted && pathname === "/rankings";
  const isTitanicHome = mounted && pathname === "/titanic-home";
  const isLogin = mounted && pathname === "/login";
  const isMyInfo = mounted && pathname === "/my-info";
  const showAuth = mounted && isReady;

  function handleLogout() {
    logout();
    router.push("/");
  }

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
          <PlePickerDialog triggerClassName={navLinkClass(isPle)} />
          <NavLink href="/results" active={isResults}>
            결과
          </NavLink>
          <NavLink href="/rankings" active={isRankings}>
            순위표
          </NavLink>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <WeatherWidget />
          <NavLink href="/titanic-home" active={isTitanicHome}>
            [타이타닉]
          </NavLink>
          {!showAuth ? (
            <div
              className="h-8 w-[7.5rem] animate-pulse rounded-md border border-stone-700/50 bg-stone-800/60"
              aria-hidden
            />
          ) : user ? (
            <>
              <NavLink href="/my-info" active={isMyInfo}>
                내 정보
              </NavLink>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={navLinkClass(false)}
                onClick={handleLogout}
              >
                로그아웃
              </Button>
              <span className="px-1 text-sm font-semibold text-stone-100">
                {user.nickname}
              </span>
            </>
          ) : (
            <NavLink href="/login" active={isLogin}>
              로그인
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
