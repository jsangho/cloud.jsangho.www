import { TitanicCsvUpload } from "@/components/titanic-csv-upload";

export default function TitanicDataCollectionPage() {
  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          1. 데이터 수집
        </h1>
        <p className="mb-8 text-sm text-zinc-600">
          캐글에서 받은{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            Titanic-Dataset.csv
          </code>
          를 업로드하세요. Neon DB에 적재하기 전 단계입니다.
        </p>
        <TitanicCsvUpload />
      </div>
    </main>
  );
}
