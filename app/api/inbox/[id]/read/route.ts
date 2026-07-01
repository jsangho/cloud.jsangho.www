import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/manager/inbox/${params.id}/read`,
    { method: "PATCH" },
  );
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
