import Link from "next/link";
import { notFound } from "next/navigation";
import { getPleBySlug, WWE_PLE_MONTHLY_ORDER } from "@/lib/wwe-ple";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return WWE_PLE_MONTHLY_ORDER.map((e) => ({ slug: e.slug }));
}

export default async function PleEventPage({ params }: Props) {
  const { slug } = await params;
  const ple = getPleBySlug(slug);
  if (!ple) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-200/70 to-zinc-300/50 px-4 py-12 text-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 dark:text-zinc-100">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{ple.month}월 PLE</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{ple.label}</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          이 이벤트 전용 페이지입니다. 예측·카드·결과 등은 추후 연결할 수 있어요.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
