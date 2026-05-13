"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">Titanic QA</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            로그인
          </Button>
        </div>
      </nav>
    </header>
  );
}
