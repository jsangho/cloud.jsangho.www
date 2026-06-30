import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth-options";
import { NextRequest, NextResponse } from "next/server";

type PeopleResult = {
  person: {
    names?: { displayName: string }[];
    emailAddresses?: { value: string }[];
  };
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as Record<string, unknown> | null)?.accessToken as string | undefined;

  if (!accessToken) {
    return NextResponse.json([], { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q) return NextResponse.json([]);

  const res = await fetch(
    `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(q)}&readMask=names,emailAddresses&pageSize=5`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return NextResponse.json([]);

  const data = await res.json();
  const results = ((data.results ?? []) as PeopleResult[])
    .map((r) => ({
      name: r.person.names?.[0]?.displayName ?? "",
      email: r.person.emailAddresses?.[0]?.value ?? "",
    }))
    .filter((r) => r.email);

  return NextResponse.json(results);
}
