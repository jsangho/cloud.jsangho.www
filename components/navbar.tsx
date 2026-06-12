"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogIn, Trophy } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { KayfabeLogo } from "@/components/kayfabe-logo";
import { PlePickerDialog } from "@/components/ple-picker-dialog";
import { WeatherWidget } from "@/components/weather-widget";
import { WweTicker } from "@/components/wwe-ticker";
import { authDisplayName, useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

function navLinkClass(active: boolean, champion = false) {
  return cn(
    champion
      ? "btn-champion"
      : "border-stone-600/70 bg-stone-800/45 text-stone-200 shadow-none hover:bg-stone-700/65 hover:text-stone-50 hover:border-stone-500 focus-visible:ring-stone-500/40",
    !champion &&
      active &&
      "border-stone-400 bg-stone-600 text-stone-50 hover:bg-stone-600 hover:border-stone-400 hover:text-stone-50",
    champion &&
      active &&
      "border-amber-400/80 !text-amber-50"
  );
}

function NavLink({
  href,
  active,
  champion = false,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  champion?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "gap-1.5",
        navLinkClass(active, champion)
      )}
      {...(active ? { "aria-current": "page" as const } : {})}
    >
      {icon}
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
  const isRecords = mounted && (pathname === "/records" || pathname.startsWith("/records/"));
  const isChampionship =
    mounted &&
    (pathname === "/championship" || pathname.startsWith("/championship/"));
  const isLesson =
    mounted && (pathname === "/lesson" || pathname.startsWith("/lesson/"));
  const isLogin = mounted && pathname === "/login";
  const isMyInfo = mounted && pathname === "/my-info";
  const showAuth = mounted && isReady;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full min-w-0 border-b border-white/10 bg-[#0a0a0c]/85 backdrop-blur-[12px] supports-[backdrop-filter]:bg-[#0a0a0c]/70">
      <div className="mx-auto grid w-full max-w-5xl min-w-0 grid-cols-1 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-y-0">
        <div className="flex justify-center sm:justify-start">
          <KayfabeLogo />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-center">
          <PlePickerDialog triggerClassName={navLinkClass(isPle)} />
          <NavLink href="/results" active={isResults}>
            결과
          </NavLink>
          <NavLink
            href="/rankings"
            active={isRankings}
            champion
            icon={<Trophy className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />}
          >
            순위표
          </NavLink>
          <NavLink href="/records" active={isRecords}>
            기록
          </NavLink>
          <NavLink href="/championship" active={isChampionship}>
            챔피언십
          </NavLink>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <WeatherWidget />
          <NavLink href="/lesson" active={isLesson}>
            Lesson
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
              <span
                className="max-w-[8rem] truncate px-1 text-sm font-semibold text-stone-100"
                title={authDisplayName(user)}
              >
                {authDisplayName(user)}
              </span>
            </>
          ) : (
            <NavLink
              href="/login"
              active={isLogin}
              champion
              icon={<LogIn className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />}
            >
              로그인
            </NavLink>
          )}
        </div>
      </div>
      <WweTicker />
    </header>
  );
}
