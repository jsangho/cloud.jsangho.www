/** 1월→11월 순 WWE PLE (slug는 `/ple/[slug]` 경로용) */
export const WWE_PLE_MONTHLY_ORDER = [
  { month: 1, slug: "royal-rumble", label: "Royal Rumble" },
  { month: 2, slug: "elimination-chamber", label: "Elimination Chamber" },
  { month: 3, slug: "stand-and-deliver", label: "Stand & Deliver" },
  { month: 4, slug: "wrestlemania", label: "WrestleMania" },
  { month: 5, slug: "backlash", label: "Backlash" },
  { month: 6, slug: "money-in-the-bank", label: "Money in the Bank" },
  { month: 7, slug: "king-queen-of-the-ring", label: "King & Queen of the Ring" },
  { month: 8, slug: "summerslam", label: "SummerSlam" },
  { month: 9, slug: "bash-in-berlin", label: "Bash in Berlin" },
  { month: 10, slug: "bad-blood", label: "Bad Blood" },
  { month: 11, slug: "survivor-series", label: "Survivor Series" },
] as const;

export type PleSlug = (typeof WWE_PLE_MONTHLY_ORDER)[number]["slug"];

export function getPleBySlug(slug: string) {
  return WWE_PLE_MONTHLY_ORDER.find((e) => e.slug === slug);
}
