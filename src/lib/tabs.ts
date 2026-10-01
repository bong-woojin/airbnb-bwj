// 헤더 탭(숙소/체험/서비스) ↔ URL 매핑. 탭도 검색 조건처럼 URL이 단일 진실 공급원이다:
// 홈은 /?tab=… 로 어떤 탭을 보여줄지 정하고, 검색은 탭에 맞는 목록 경로로 간다.
// 슬러그는 목록 페이지 경로(/rooms, /experiences, /services)와 같게 맞췄다.

export const TAB_SLUGS = ["rooms", "experiences", "services"] as const;
export type TabSlug = (typeof TAB_SLUGS)[number];

// ?tab= 값 → 탭 인덱스. 없거나 모르는 값이면 숙소(0).
export function parseTab(slug: string | string[] | undefined): number {
  const i = TAB_SLUGS.indexOf(slug as TabSlug);
  return i >= 0 ? i : 0;
}

// 탭 클릭 시 이동할 홈 URL
export function homeTabHref(tab: number): string {
  return `/?tab=${TAB_SLUGS[tab] ?? TAB_SLUGS[0]}`;
}

// 검색 버튼이 이동할 목록 경로
export function searchPathForTab(tab: number): string {
  return `/${TAB_SLUGS[tab] ?? TAB_SLUGS[0]}`;
}
