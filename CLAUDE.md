# 프론트엔드 행동 지침 (보조)

> **메인 규칙:** [`www/.cursorrules`](.cursorrules)를 먼저 Read한다.  
> 본 문서는 Karpathy 원칙의 **프론트 적용 보조**다. 충돌 시 `.cursorrules`가 우선한다.  
**스택:** Next.js (App Router) · React · TypeScript · Tailwind CSS · Radix UI

---

## 1. 구현 전 사고 — 프론트 적용

- 새 fetch 전 → [`lib/api.ts`](lib/api.ts), `lib/*-api.ts`, [`sangho/.cursorrules`](../sangho/.cursorrules) prefix 확인
- 같은 도메인 UI 패턴 먼저 Read (예: PLE 컴포넌트)
- `NEXT_PUBLIC_*` · `"use client"` 여부는 기존 페이지와 맞춤

---

## 2. 단순성 · 3. 정밀한 수정 · 4. 목표 중심 실행

상세는 [루트 `.cursorrules`](../.cursorrules) §2–4 및 [`www/.cursorrules`](.cursorrules) §2–5를 따른다.

| 작업 | 검증 |
|------|------|
| API 연동 | 브라우저 Network 200 |
| UI 변경 | 대상 라우트에서 동작 확인 |
| 빌드 | `pnpm build` |

- useState 객체 압축 → [`agent.md`](../agent.md) (사용자 명시 요청 시만)

---

## 관련 메인 규칙

| 영역 | `.cursorrules` |
|------|----------------|
| 루트 | [`.cursorrules`](../.cursorrules) |
| 백엔드 API | [`sangho/.cursorrules`](../sangho/.cursorrules) |
| Titanic | [`sangho/apps/titanic/_docs/.cursorrules`](../sangho/apps/titanic/_docs/.cursorrules) |
