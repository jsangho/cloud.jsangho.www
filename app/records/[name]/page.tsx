import Link from "next/link";
import { notFound } from "next/navigation";
import { CompetitorRecordView } from "@/components/records/competitor-record-view";
import { fetchCompetitorProfile } from "@/lib/records-api";
import { fetchCompetitorTitleHistory } from "@/lib/title-history-api";

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const [profile, titleHistory] = await Promise.all([
    fetchCompetitorProfile(decoded),
    fetchCompetitorTitleHistory(decoded),
  ]);
  if (!profile) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-5">
        <Link
          href="/records"
          className="text-sm font-semibold text-stone-300 hover:text-stone-50"
        >
          ← 선수 목록
        </Link>
      </header>

      <CompetitorRecordView
        profile={profile}
        titleHistory={titleHistory?.acquisitions ?? []}
      />
    </main>
  );
}
