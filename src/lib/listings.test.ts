import { describe, expect, test } from "vitest";
import type { ListingItem } from "@/data/types";
import { filterListings, paginate } from "./listings";

// 테스트 기준일 고정 — 가능 기간은 이 날짜 + 오프셋으로 계산된다
const TODAY = new Date(2026, 6, 8);

const ITEMS: ListingItem[] = [
  { id: "a", image: "", location: "부산 · 해운대", startOffset: 7, nights: 5, price: 100, rating: 4.9, maxGuests: 6 },
  { id: "b", image: "", location: "부산 · 광안리", startOffset: 10, nights: 5, price: 200, rating: 4.8, maxGuests: 2 },
  { id: "c", image: "", location: "서울 · 마포구", startOffset: 8, nights: 5, price: 300, rating: 4.7, maxGuests: 4 },
  { id: "d", image: "", location: "제주 · 애월", startOffset: 26, nights: 5, price: 400, rating: 4.6 }, // maxGuests 없음
  { id: "e", image: "", location: "제주 · 협재", price: 500, rating: 4.5, maxGuests: 2 }, // 가능 기간 없음
];
// a: 7/15~20, b: 7/18~23, c: 7/16~21, d: 8/3~8 (TODAY 기준)

describe("filterListings", () => {
  test("조건이 없으면 전체를 반환한다", () => {
    expect(filterListings(ITEMS, {}, TODAY)).toHaveLength(5);
  });

  test("location은 도시 접두어로 매칭한다", () => {
    const r = filterListings(ITEMS, { location: "부산" }, TODAY);
    expect(r.map((i) => i.id)).toEqual(["a", "b"]);
  });

  test("없는 도시는 빈 배열", () => {
    expect(filterListings(ITEMS, { location: "대전" }, TODAY)).toEqual([]);
  });

  test("날짜: 검색 기간이 가능 기간에 완전히 포함되는 항목만", () => {
    // 7/19~21은 b(7/18~23)와 c(7/16~21)에만 포함된다
    const r = filterListings(ITEMS, { checkin: "2026-07-19", checkout: "2026-07-21" }, TODAY);
    expect(r.map((i) => i.id)).toEqual(["b", "c"]);
  });

  test("날짜: 가능 기간 정보가 없는 항목은 날짜 검색 시 제외", () => {
    const r = filterListings(ITEMS, { checkin: "2026-07-15", checkout: "2026-07-20" }, TODAY);
    expect(r.map((i) => i.id)).toEqual(["a"]);
  });

  test("날짜: 달 넘김 — 가능 기간이 다음 달로 이어져도 판정한다", () => {
    // d는 8/3~8. 오늘을 7/20으로 옮기면 같은 오프셋이 8/15~20이 된다
    const r = filterListings(ITEMS, { checkin: "2026-08-16", checkout: "2026-08-19" }, new Date(2026, 6, 20));
    expect(r.map((i) => i.id)).toEqual(["d"]);
  });

  test("날짜: 해 넘김 — 12월 말 기준 오프셋이 다음 해로 이어진다", () => {
    // 오늘 12/25 → b: 1/4~9, c: 1/2~7
    const r = filterListings(ITEMS, { checkin: "2027-01-04", checkout: "2027-01-07" }, new Date(2026, 11, 25));
    expect(r.map((i) => i.id)).toEqual(["b", "c"]);
  });

  test("날짜: 오늘 기준이 바뀌면 같은 검색도 결과가 달라진다", () => {
    // 7/16~21: 오늘이 7/8이면 c(7/16~21)만, 하루 지난 7/9면 a(7/16~21)만 — c는 7/17~22로 밀려난다
    const search = { checkin: "2026-07-16", checkout: "2026-07-21" };
    expect(filterListings(ITEMS, search, TODAY).map((i) => i.id)).toEqual(["c"]);
    expect(filterListings(ITEMS, search, new Date(2026, 6, 9)).map((i) => i.id)).toEqual(["a"]);
  });

  test("게스트: maxGuests 이상 수용 가능한 항목만, 필드 없으면 제외", () => {
    const r = filterListings(ITEMS, { guests: 4 }, TODAY);
    expect(r.map((i) => i.id)).toEqual(["a", "c"]);
  });

  test("조건을 조합하면 모두 만족해야 한다", () => {
    const r = filterListings(
      ITEMS,
      { location: "부산", checkin: "2026-07-19", checkout: "2026-07-21", guests: 2 },
      TODAY,
    );
    expect(r.map((i) => i.id)).toEqual(["b"]);
  });

  test("잘못된 날짜 형식은 날짜 필터를 건너뛴다", () => {
    expect(filterListings(ITEMS, { checkin: "7월 19일", checkout: "2026-07-21" }, TODAY)).toHaveLength(5);
  });
});

describe("paginate", () => {
  const TEN = Array.from({ length: 10 }, (_, i) => i);

  test("페이지 단위로 자르고 hasMore를 계산한다", () => {
    const p1 = paginate(TEN, 1, 4);
    expect(p1.items).toEqual([0, 1, 2, 3]);
    expect(p1.total).toBe(10);
    expect(p1.hasMore).toBe(true);

    const p3 = paginate(TEN, 3, 4);
    expect(p3.items).toEqual([8, 9]);
    expect(p3.hasMore).toBe(false);
  });

  test("범위를 벗어난 페이지는 빈 배열 + hasMore false", () => {
    const p = paginate(TEN, 99, 4);
    expect(p.items).toEqual([]);
    expect(p.hasMore).toBe(false);
  });

  test("잘못된 page/limit은 안전한 값으로 보정한다", () => {
    expect(paginate(TEN, -1, 4).page).toBe(1);
    expect(paginate(TEN, 0, 0).limit).toBe(12);
    expect(paginate(TEN, 1, 9999).limit).toBe(50);
  });

  test("빈 배열도 동작한다", () => {
    const p = paginate([], 1, 12);
    expect(p.items).toEqual([]);
    expect(p.total).toBe(0);
    expect(p.hasMore).toBe(false);
  });
});
