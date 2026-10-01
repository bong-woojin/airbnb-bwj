// 검색바 검색 조건의 타입·초기값·상태 전이 — SearchBar(index.tsx)가 이 값들을 소유하고
// 팝업들은 value/onChange만 받는 controlled 컴포넌트다. 순수 함수라 Vitest로 검증한다.

import type { Guests } from "@/components/common/GuestCounter";

// ── 여행지 ────────────────────────────────────────────────

// title은 검색 필터(location 접두어 매칭)와 그대로 비교되므로 도시명을 정확히 유지한다.
// 목록에는 실제 데이터가 있는 도시만 둔다 — 눌렀는데 0건이 나오는 선택지는 고장처럼 보인다.
// tabs: 그 도시에 결과가 있는 탭(0 숙소 / 1 체험 / 2 서비스). 서비스 데이터는 서울·부산뿐이라 제주는 제외.
// 체험 목록은 여행지 조건을 쓰지 않아(전부 가평) 어느 도시를 골라도 0건이 되지 않는다.
// (데이터에 도시를 추가하면 여기도 함께 추가할 것: src/data/rooms.ts, src/data/services.ts servicesByLocation)
export const DESTINATIONS = [
  { icon: "🌇", title: "서울", desc: "전통과 트렌드가 공존하는 도시 여행", tabs: [0, 1, 2] },
  { icon: "🌊", title: "부산", desc: "해운대와 광안리, 바다의 도시", tabs: [0, 1, 2] },
  { icon: "🏝️", title: "제주", desc: "자연이 살아있는 힐링 섬 여행", tabs: [0, 1] },
];

export type Destination = (typeof DESTINATIONS)[number];

// 자동완성: 현재 탭에 결과가 있는 도시 중, 입력값이 도시명이나 설명에 포함된 것만. 빈 입력이면 전체(추천 목록).
export function filterDestinations(query: string, tab = 0): Destination[] {
  const available = DESTINATIONS.filter((d) => d.tabs.includes(tab));
  const q = query.trim();
  if (!q) return available;
  return available.filter((d) => d.title.includes(q) || d.desc.includes(q));
}

// 검색에 쓸 여행지: 목록에서 고른 도시가 우선, 없으면 직접 입력한 텍스트
export function resolveSearchLocation(selected: string, query: string): string {
  return selected || query.trim();
}

// ── 날짜 ─────────────────────────────────────────────────

export type DateTab = "specific" | "flexible";
export type FlexDuration = "weekend" | "week" | "month" | null;

// 사용자가 "고른 값"만 담는다. 보고 있는 달·hover 같은 보기 상태는 CalendarPopup 로컬.
export interface DateSelection {
  tab: DateTab;
  start: Date | null;
  end: Date | null;
  flexibility: number; // ±N일 (0이면 정확한 날짜)
  flexDuration: FlexDuration;
  flexMonths: number[]; // 유연한 일정에서 고른 달 (FLEX_MONTHS 인덱스)
}

export const EMPTY_DATE_SELECTION: DateSelection = {
  tab: "specific",
  start: null,
  end: null,
  flexibility: 0,
  flexDuration: null,
  flexMonths: [],
};

function formatDate(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// 검색바 "날짜" 칸에 표시할 문구. 선택이 없으면 null (→ placeholder "날짜 추가")
export function formatDateSelectionLabel(sel: DateSelection): string | null {
  if (!sel.start) return null;
  const suffix = sel.flexibility > 0 ? ` ±${sel.flexibility}` : "";
  return sel.end
    ? `${formatDate(sel.start)} ~ ${formatDate(sel.end)}${suffix}`
    : `${formatDate(sel.start)}${suffix}`;
}

// 달력 날짜 클릭 → 다음 선택 상태.
// 비어 있거나 이미 기간이 완성됐으면 새 체크인, 체크인만 있으면 체크아웃(앞 날짜면 순서 교체).
export function selectDay(sel: DateSelection, d: Date): DateSelection {
  if (!sel.start || sel.end) return { ...sel, start: d, end: null };
  if (d < sel.start) return { ...sel, start: d, end: sel.start };
  if (d > sel.start) return { ...sel, end: d };
  return sel; // 체크인과 같은 날 클릭은 무시
}

// ── 게스트 ────────────────────────────────────────────────

export const EMPTY_GUESTS: Guests = { adults: 0, children: 0, infants: 0, pets: 0 };

export function countGuests(g: Guests): number {
  return g.adults + g.children + g.infants + g.pets;
}
