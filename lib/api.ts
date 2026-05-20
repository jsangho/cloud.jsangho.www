export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

/** Neon cold start·원격 DB를 고려한 요청 타임아웃 */
export const requestTimeoutMs = 20000;

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
