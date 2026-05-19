/** 1월→11월 순 WWE PLE (slug는 `/ple/[slug]` 경로용) */
export const WWE_PLE_MONTHLY_ORDER = [
  {
    month: 1,
    slug: "royal-rumble",
    label: "Royal Rumble",
    description: "30인 룰렛 매치로 WrestleMania 출전권을 가르는 시즌 오프닝",
  },
  {
    month: 2,
    slug: "elimination-chamber",
    label: "Elimination Chamber",
    description: "철장 안 6인 엘리미네이션 챔버로 챔피언을 결정",
  },
  {
    month: 3,
    slug: "stand-and-deliver",
    label: "Stand & Deliver",
    description: "NXT의 플래그십 PLE, 차세대 스타들의 무대",
  },
  {
    month: 4,
    slug: "wrestlemania",
    label: "WrestleMania",
    description: "WWE 최대의 쇼, 한 해의 클라이맥스",
  },
  {
    month: 5,
    slug: "backlash",
    label: "Backlash",
    description: "WrestleMania 직후 스토리가 이어지는 첫 메이저 PPV",
  },
  {
    month: 6,
    slug: "money-in-the-bank",
    label: "Money in the Bank",
    description: "서류가방 래더 매치로 언제든 타이틀 도전권 획득",
  },
  {
    month: 7,
    slug: "king-queen-of-the-ring",
    label: "King & Queen of the Ring",
    description: "싱글 토너먼트로 왕·여왕을 가리는 중세 테마 PLE",
  },
  {
    month: 8,
    slug: "summerslam",
    label: "SummerSlam",
    description: "여름 최대 PLE, 빅 매치와 라이벌의 절정",
  },
  {
    month: 9,
    slug: "bash-in-berlin",
    label: "Bash in Berlin",
    description: "독일 베를린에서 열리는 국제 스펙터클 이벤트",
  },
  {
    month: 10,
    slug: "bad-blood",
    label: "Bad Blood",
    description: "헬 인 어 셀 중심의 격렬한 페우드 클리맥스",
  },
  {
    month: 11,
    slug: "survivor-series",
    label: "Survivor Series",
    description: "브랜드·팀 대항 서바이버 시리즈로 시즌을 마무리",
  },
] as const;

export type PleSlug = (typeof WWE_PLE_MONTHLY_ORDER)[number]["slug"];

export function getPleBySlug(slug: string) {
  return WWE_PLE_MONTHLY_ORDER.find((e) => e.slug === slug);
}
