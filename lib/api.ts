export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const requestTimeoutMs = 5000;

type ApiErrorBody = {
  detail?: string | { msg?: string }[];
  message?: string;
};

export function parseApiError(
  data: ApiErrorBody | null,
  status: number
): string {
  const detail = data?.detail;
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg ?? "").filter(Boolean).join("\n");
  }
  return data?.message ?? `서버 오류: ${status}`;
}
