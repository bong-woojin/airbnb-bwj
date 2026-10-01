// 목록 필터링·페이지네이션 — 서버 컴포넌트(목록 페이지)와 /api/listings가 공유하는 순수 로직.
// 같은 검색 조건이면 어느 경로로 접근해도 같은 결과가 나오도록 한 곳에 모아둔다.

import type { ListingItem } from "@/data/types";
import { getAvailabilityRange, getToday, isStayWithinRange, parseYMD } from "./dates";

export interface ListingFilter {
  // 도시명 ("부산") — 카드의 location("부산 · 해운대")이 이 값으로 시작하는 항목만
  location?: string;
  checkin?: string; // "YYYY-MM-DD"
  checkout?: string;
  guests?: number;
}

export function filterListings(items: ListingItem[], filter: ListingFilter, today: Date = getToday()): ListingItem[] {
  let result = items;

  if (filter.location) {
    const location = filter.location;
    result = result.filter((item) => item.location.startsWith(location));
  }

  // 날짜: 검색한 체크인~체크아웃이 항목의 가능 기간(오늘 + 오프셋) 안에 완전히 포함되어야 노출.
  // 가능 기간 정보가 없는 항목은 날짜 검색 시 제외한다.
  const searchStart = parseYMD(filter.checkin);
  const searchEnd = parseYMD(filter.checkout);
  if (searchStart && searchEnd) {
    result = result.filter((item) => {
      const range = getAvailabilityRange(item, today);
      return range !== null && isStayWithinRange(searchStart, searchEnd, range);
    });
  }

  // 게스트: 최대 숙박 인원이 검색 인원 이상이어야 노출
  const guests = filter.guests ?? 0;
  if (guests > 0) {
    result = result.filter((item) => item.maxGuests != null && guests <= item.maxGuests);
  }

  return result;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const DEFAULT_PAGE_LIMIT = 12;
export const MAX_PAGE_LIMIT = 50;

export function paginate<T>(items: T[], page: number, limit: number): Paginated<T> {
  // 잘못된 값은 안전한 범위로 보정 (음수 페이지, 과도한 limit 등)
  const safeLimit = Math.min(Math.max(Math.floor(limit) || DEFAULT_PAGE_LIMIT, 1), MAX_PAGE_LIMIT);
  const safePage = Math.max(Math.floor(page) || 1, 1);
  const start = (safePage - 1) * safeLimit;

  return {
    items: items.slice(start, start + safeLimit),
    page: safePage,
    limit: safeLimit,
    total: items.length,
    hasMore: start + safeLimit < items.length,
  };
}
