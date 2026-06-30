import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/manager/juso/contacts`,
    { cache: "no-store" },
  );
  if (!res.ok) return NextResponse.json([], { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}
