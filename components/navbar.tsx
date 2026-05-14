"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Database, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NavTabLink({
  href,
  active,
  children,
  icon,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const onHome = pathname === "/";
  const isQa = onHome && view !== "data";
  const isData = onHome && view === "data";
  const isKayfabe = pathname === "/kayfabe";
  const isTitanicHome = pathname === "/titanic-home";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="text-center sm:text-left">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Titanic QA Assistant
            </h1>
          </Link>
          <p className="mt-0.5 text-sm text-muted-foreground">
            타이타닉 데이터 기반 질의응답
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <NavTabLink href="/?view=qa" active={isQa} icon={<MessageCircle size={16} />}>
            QA 채팅
          </NavTabLink>
          <NavTabLink href="/?view=data" active={isData} icon={<Database size={16} />}>
            샘플 데이터
          </NavTabLink>

          <Button variant="outline" size="sm" asChild>
            <Link
              href="/kayfabe"
              className="font-medium"
              aria-current={isKayfabe ? "page" : undefined}
            >
              [케이페이브]
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link
              href="/titanic-home"
              className="font-medium"
              aria-current={isTitanicHome ? "page" : undefined}
            >
              [타이타닉]
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            로그인
          </Button>
        </div>
      </div>
    </header>
  );
}
