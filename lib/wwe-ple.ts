/** 2026 WWE PLE. month가 null이면 일정 미확정(「미정」). */
export const WWE_PLE_YEAR = 2026 as const;

export const WWE_PLE_MONTHLY_ORDER = [
  {
    month: 1,
    year: WWE_PLE_YEAR,
    slug: "royal-rumble",
    label: "Royal Rumble",
    description: "1.31 리야드 — WrestleMania 42 출전권",
  },
  {
    month: 2,
    year: WWE_PLE_YEAR,
    slug: "elimination-chamber",
    label: "Elimination Chamber",
    description: "2.28 시카고 — 챔버 우승자의 Mania 각",
  },
  {
    month: 4,
    year: WWE_PLE_YEAR,
    slug: "stand-and-deliver",
    label: "Stand & Deliver",
    description: "4.4 — NXT 플래그십 PLE",
  },
  {
    month: 4,
    year: WWE_PLE_YEAR,
    slug: "wrestlemania",
    label: "WrestleMania 42",
    description: "4.18–19 라스베이거스 — 시즌 최대 이벤트",
  },
  {
    month: 5,
    year: WWE_PLE_YEAR,
    slug: "backlash",
    label: "Backlash",
    description: "5.9 탬파 — WrestleMania 42 여파",
  },
  {
    month: 5,
    year: WWE_PLE_YEAR,
    slug: "clash-in-italy",
    label: "Clash in Italy",
    description: "5.31 토리노 — 국제 PLE",
  },
  {
    month: 6,
    year: WWE_PLE_YEAR,
    slug: "night-of-champions",
    label: "Night of Champions",
    description: "6.27 리야드 — 챔피언십 중심 PLE",
  },
  {
    month: 8,
    year: WWE_PLE_YEAR,
    slug: "summerslam",
    label: "SummerSlam",
    description: "8.1–2 미니애폴리스 — 2 Nights",
  },
  {
    month: 9,
    year: WWE_PLE_YEAR,
    slug: "money-in-the-bank",
    label: "Money in the Bank",
    description: "9.6 뉴올리언스 — MITB 래더",
  },
  {
    month: null,
    year: WWE_PLE_YEAR,
    slug: "king-queen-of-the-ring",
    label: "King & Queen of the Ring",
    description: "일정 미확정 — 토너먼트 PLE",
  },
  {
    month: null,
    year: WWE_PLE_YEAR,
    slug: "bad-blood",
    label: "Bad Blood",
    description: "일정 미확정 — Hell in a Cell 중심",
  },
  {
    month: null,
    year: WWE_PLE_YEAR,
    slug: "survivor-series",
    label: "Survivor Series",
    description: "일정 미확정 — 팀 대항 시즌 피날레",
  },
] as const;

export type PleSlug = (typeof WWE_PLE_MONTHLY_ORDER)[number]["slug"];

export function formatPleMonth(month: number | null): string {
  return month === null ? "미정" : `${month}월`;
}

export function getPleBySlug(slug: string) {
  return WWE_PLE_MONTHLY_ORDER.find((e) => e.slug === slug);
}
