import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ detail: "파일이 없습니다." }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const count = Math.max(0, lines.length - 1);

  return NextResponse.json({ count });
}
