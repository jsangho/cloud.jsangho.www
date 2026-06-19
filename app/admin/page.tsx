"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Users, TrendingUp, TrendingDown, Download, ChevronDown,
  Mail, Phone, ArrowUpRight, LayoutDashboard, Briefcase,
  Package, Code, Coins, MessageSquare, Calendar, Inbox,
  FolderOpen, User,
} from "lucide-react";

// ── 데이터 ────────────────────────────────────────────────────────────────────

const revenueData = [
  { m: "3월", v: 18000 }, { m: "4월", v: 22000 }, { m: "5월", v: 19500 },
  { m: "6월", v: 25000 }, { m: "7월", v: 32209 }, { m: "8월", v: 27000 },
  { m: "9월", v: 30500 }, { m: "10월", v: 35000 }, { m: "11월", v: 31000 },
  { m: "12월", v: 38000 }, { m: "1월", v: 36000 }, { m: "2월", v: 40000 },
  { m: "3월", v: 42000 },
];

const leadsSalesData = [
  { d: "월", v: 30 }, { d: "화", v: 45 }, { d: "수", v: 38 },
  { d: "목", v: 60 }, { d: "금", v: 48 }, { d: "토", v: 35 }, { d: "일", v: 42 },
];

const retentionData = [
  { m: "1월", sme: 35, startup: 55, ent: 25 },
  { m: "2월", sme: 50, startup: 68, ent: 40 },
  { m: "3월", sme: 45, startup: 62, ent: 52 },
  { m: "4월", sme: 60, startup: 78, ent: 38 },
  { m: "5월", sme: 68, startup: 72, ent: 62 },
  { m: "6월", sme: 62, startup: 82, ent: 68 },
  { m: "7월", sme: 78, startup: 88, ent: 72 },
];

const membersBarData = [
  { v: 30 }, { v: 50 }, { v: 40 }, { v: 65 }, { v: 55 },
  { v: 70 }, { v: 60 }, { v: 80 }, { v: 75 },
];

const workTimeData = [
  { h: "0시", v: 3 }, { h: "3시", v: 2 }, { h: "6시", v: 4 },
  { h: "9시", v: 7 }, { h: "12시", v: 6 }, { h: "15시", v: 8 },
  { h: "18시", v: 5 }, { h: "21시", v: 3 },
];

const NAV_TABS = [
  { label: "대시보드",   icon: LayoutDashboard, dropdown: false },
  { label: "CRM",       icon: Briefcase,       dropdown: true  },
  { label: "물류",      icon: Package,         dropdown: true  },
  { label: "SaaS",      icon: Code,            dropdown: true  },
  { label: "크립토",    icon: Coins,           dropdown: true  },
  { label: "채팅",      icon: MessageSquare,   dropdown: false },
  { label: "캘린더",    icon: Calendar,        dropdown: false },
  { label: "이메일",    icon: Inbox,           dropdown: true  },
  { label: "파일 관리", icon: FolderOpen,      dropdown: true  },
  { label: "프로필",    icon: User,            dropdown: false },
];

const CAL_WEEKS = [
  [null, null, null, 1,  2,  3,  4 ],
  [5,   6,    7,    8,  9,  10, 11 ],
  [12,  13,   14,   15, 16, 17, 18 ],
  [19,  20,   21,   22, 23, 24, 25 ],
  [26,  27,   28,   29, 30, null, null],
];

const CAL_EVENTS = [
  { time: "오전 9:00 · 10:00",  title: "주간 팀 미팅",         badge: "구글 미트", avatars: 4 },
  { time: "오전 10:20 · 10:40", title: "여유 시간",             badge: null,        avatars: 0 },
  { time: "오전 10:45 · 11:45", title: "게이미피케이션 데모",   badge: "슬랙",      avatars: 3 },
];

const TEAM_ACTIVITY = [
  { icon: "calendar", label: "미팅 예정",   sub: "3건", time: "14:00" },
  { icon: "mail",     label: "이메일 발송", sub: "24건", time: "09:30" },
  { icon: "phone",    label: "통화 완료",   sub: "12건", time: "11:10" },
];

const TT = {
  contentStyle: {
    background: "#0f0f11",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    fontSize: 11,
    color: "#e7e5e4",
    padding: "6px 10px",
  },
  itemStyle: { color: "#e7e5e4" },
  labelStyle: { color: "#78716c" },
};

// ── 공통 카드 ─────────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-stone-700/50 bg-stone-950/70 ${className}`}>
      {children}
    </div>
  );
}

// ── 캘린더 ───────────────────────────────────────────────────────────────────

function CalendarCard() {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-100">캘린더</h3>
        <button className="flex items-center gap-1 rounded-lg border border-stone-600/70 bg-stone-800/45 px-2.5 py-1 text-xs text-stone-200 transition-colors hover:bg-stone-700/65">
          6월 <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="mb-0.5 grid grid-cols-7 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="py-1 text-[10px] font-medium text-stone-500">{d}</div>
        ))}
      </div>

      <div className="space-y-0.5">
        {CAL_WEEKS.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => (
              <div
                key={di}
                className={`flex h-7 items-center justify-center rounded-full text-[11px] font-medium
                  ${day === 8
                    ? "bg-red-600 text-white"
                    : day
                    ? "cursor-pointer text-stone-300 hover:bg-stone-800/60"
                    : ""}`}
              >
                {day ?? ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3 border-t border-stone-700/50 pt-4">
        {CAL_EVENTS.map((ev, i) => (
          <div key={i}>
            <p className="mb-0.5 text-[10px] text-stone-500">{ev.time}</p>
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-stone-100">{ev.title}</p>
              {ev.badge && (
                <span className="shrink-0 rounded border border-stone-600/50 bg-stone-800 px-1.5 py-0.5 text-[9px] text-stone-300">
                  {ev.badge}
                </span>
              )}
            </div>
            {ev.avatars > 0 && (
              <div className="mt-1.5 flex gap-1">
                {Array.from({ length: Math.min(ev.avatars, 3) }).map((_, ai) => (
                  <div key={ai} className="flex h-5 w-5 items-center justify-center rounded-full bg-red-700/80 text-[9px] font-bold text-white">
                    A
                  </div>
                ))}
                {ev.avatars > 3 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-700 text-[9px] text-stone-300">
                    +{ev.avatars - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <p className="text-[10px] text-stone-700">오후 12시 일정 없음</p>
      </div>
    </Card>
  );
}

// ── 통계 카드 ─────────────────────────────────────────────────────────────────

function TotalMembersCard() {
  return (
    <div className="rounded-xl border border-red-900/50 bg-gradient-to-br from-red-950 via-stone-950 to-stone-950 p-4 shadow-lg shadow-red-950/40">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-300">
          <Users className="h-3.5 w-3.5" /> 전체 멤버
        </div>
        <span className="flex items-center gap-0.5 rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-300">
          <ArrowUpRight className="h-3 w-3" /> 12%
        </span>
      </div>
      <p className="mb-0.5 text-3xl font-bold tracking-tight text-stone-50">2,521</p>
      <p className="mb-3 text-[10px] text-stone-400">2024년 6월 29일 기준</p>
      <ResponsiveContainer width="100%" height={36}>
        <BarChart data={membersBarData} barSize={5} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="v" fill="rgba(239,68,68,0.5)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-5">
        <div>
          <p className="text-[10px] text-stone-400">활성</p>
          <p className="text-sm font-bold text-stone-50">1,802</p>
        </div>
        <div>
          <p className="text-[10px] text-stone-400">이번 주 신규</p>
          <p className="text-sm font-bold text-amber-400">+186</p>
        </div>
      </div>
    </div>
  );
}

function AvgTimeCard() {
  return (
    <Card className="p-4">
      <p className="mb-1 text-[11px] text-stone-400">평균 근무 시간</p>
      <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <p className="text-2xl font-bold text-stone-50">6:39:32</p>
        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-red-400">
          <TrendingDown className="h-3 w-3" /> 1.2%
        </span>
        <span className="text-[10px] text-stone-500">전일 대비</span>
      </div>
      <ResponsiveContainer width="100%" height={64}>
        <LineChart data={workTimeData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Tooltip {...TT} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

function LeadsSalesCard() {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-stone-100">영업별 리드</p>
        <button className="flex items-center gap-1 rounded border border-stone-600/70 bg-stone-800/45 px-2 py-0.5 text-[10px] text-stone-300 transition-colors hover:bg-stone-700/65">
          이번 주 <ChevronDown className="h-2.5 w-2.5" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={leadsSalesData} barSize={10} margin={{ top: 0, right: 0, bottom: 0, left: -28 }}>
          <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#78716c" }} axisLine={false} tickLine={false} />
          <Bar dataKey="v" fill="#dc2626" radius={[3, 3, 0, 0]} />
          <Tooltip {...TT} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ── 매출 차트 ─────────────────────────────────────────────────────────────────

function RevenueCard() {
  const [period, setPeriod] = useState("전체");
  return (
    <Card className="p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-stone-100">매출</p>
          <p className="text-xl font-bold text-stone-50">$32,209</p>
          <span className="flex items-center gap-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            <TrendingUp className="h-3 w-3" /> +22%
          </span>
        </div>
        <div className="flex gap-0.5">
          {["1일", "1주", "1달", "6달", "1년", "전체"].map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                period === t
                  ? "bg-red-600 text-white"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#dc2626" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="m" tick={{ fontSize: 9, fill: "#78716c" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "#78716c" }} axisLine={false} tickLine={false}
            tickFormatter={(v: number) => `${v / 1000}k`} />
          <Tooltip {...TT} formatter={(v: number) => [`$${v.toLocaleString()}`, "매출"]} />
          <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#revGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ── 하단 카드 ─────────────────────────────────────────────────────────────────

function LeadsManagementCard() {
  const [tab, setTab] = useState("상태");
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-stone-100">리드 관리</h3>
      <div className="mb-4 flex gap-1">
        {["상태", "소스", "자격"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              tab === t
                ? "bg-red-600 text-white"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: "미처리",  count: "114", color: "text-stone-100"  },
          { label: "진행 중", count: "62",  color: "text-amber-400"  },
          { label: "실패",    count: "47",  color: "text-red-400"    },
          { label: "성공",    count: "38",  color: "text-emerald-400"},
        ].map(({ label, count, color }) => (
          <div key={label} className="rounded-lg border border-stone-700/50 bg-stone-900/50 p-3">
            <p className="mb-1 text-[10px] text-stone-500">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{count}</p>
            <p className="text-[10px] text-stone-600">건</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RetentionRateCard() {
  const [tab, setTab] = useState("중소기업");
  return (
    <Card className="p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-100">유지율</h3>
          <p className="text-[10px] font-medium text-amber-400">95% +12% 전월 대비</p>
        </div>
        <div className="flex gap-1">
          {["중소기업", "스타트업", "대기업"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                tab === t
                  ? "bg-red-600 text-white"
                  : "border border-stone-600/70 text-stone-400 hover:border-stone-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={retentionData} barSize={5} barGap={2} margin={{ top: 0, right: 0, bottom: 0, left: -28 }}>
          <XAxis dataKey="m" tick={{ fontSize: 9, fill: "#78716c" }} axisLine={false} tickLine={false} />
          <Tooltip {...TT} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="sme"     fill="#ef4444" radius={[2, 2, 0, 0]} />
          <Bar dataKey="startup" fill="#f59e0b" radius={[2, 2, 0, 0]} />
          <Bar dataKey="ent"     fill="#78716c" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function TeamActivityCard() {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-100">팀 활동</h3>
        <button className="rounded border border-stone-600/70 bg-stone-800/45 px-2 py-0.5 text-[10px] text-stone-300 transition-colors hover:bg-stone-700/65">
          오늘
        </button>
      </div>
      <div className="space-y-4">
        {TEAM_ACTIVITY.map((item, i) => {
          const config =
            item.icon === "calendar" ? { Icon: Calendar, cls: "text-red-400 bg-red-500/10"     } :
            item.icon === "mail"     ? { Icon: Mail,     cls: "text-amber-400 bg-amber-500/10" } :
                                       { Icon: Phone,    cls: "text-stone-300 bg-stone-700/40" };
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.cls}`}>
                <config.Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-stone-100">{item.label}</p>
                <p className="text-[10px] text-stone-500">{item.sub}</p>
              </div>
              <span className="shrink-0 text-[10px] font-medium text-stone-500">{item.time}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── 페이지 ────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("대시보드");

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-stone-100">

      {/* 서브 내비게이션 */}
      <div className="border-b border-white/10 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex gap-0.5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_TABS.map(({ label, icon: Icon, dropdown }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === label
                    ? "border border-stone-400 bg-stone-600 text-stone-50"
                    : "border border-transparent text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
                {dropdown && <ChevronDown className="h-2.5 w-2.5 opacity-60" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">

        {/* 페이지 헤더 */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 sm:mb-5">
          <div>
            <h1 className="text-base font-bold text-stone-50 sm:text-lg">CRM 대시보드</h1>
            <p className="text-[11px] text-stone-400">팀의 성장 현황을 확인하세요</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-stone-600/70 bg-stone-800/45 px-2.5 py-1.5 text-[11px] text-stone-200 transition-colors hover:bg-stone-700/65">
              이번 주 <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-red-700/50 bg-red-900/30 px-2.5 py-1.5 text-[11px] font-medium text-red-300 transition-colors hover:bg-red-900/50">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">데이터 내보내기</span>
            </button>
          </div>
        </div>

        {/* 2열 레이아웃: 모바일 스택, lg에서 사이드바 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr] lg:gap-5">

          {/* 캘린더 — 모바일: 하단(order-2), lg: 좌측 사이드바(lg:order-1) */}
          <div className="order-2 lg:order-1">
            <CalendarCard />
          </div>

          {/* 우측: 통계 + 매출 */}
          <div className="order-1 lg:order-2 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <TotalMembersCard />
              <AvgTimeCard />
              <LeadsSalesCard />
            </div>
            <RevenueCard />
          </div>
        </div>

        {/* 하단 3열 */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-3">
          <LeadsManagementCard />
          <RetentionRateCard />
          <TeamActivityCard />
        </div>
      </main>
    </div>
  );
}
