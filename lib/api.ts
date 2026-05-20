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

/** REACT_RULES §4: 사용자 UI에는 API 원문·입력 echo를 노출하지 않음 */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function getRequestTimeoutMessage(): string {
  return `서버 응답이 ${requestTimeoutMs / 1000}초 이상 걸려 요청을 중단했습니다. 백엔드가 켜져 있는지 확인해 주세요.`;
}
