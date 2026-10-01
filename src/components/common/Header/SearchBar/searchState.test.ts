import { describe, expect, test } from "vitest";
import {
  DESTINATIONS,
  EMPTY_DATE_SELECTION,
  countGuests,
  filterDestinations,
  formatDateSelectionLabel,
  resolveSearchLocation,
  selectDay,
} from "./searchState";

const d = (m: number, day: number) => new Date(2026, m - 1, day);

describe("filterDestinations (여행지 자동완성)", () => {
  test("빈 입력/공백이면 전체 추천 목록", () => {
    expect(filterDestinations("")).toEqual(DESTINATIONS);
    expect(filterDestinations("   ")).toEqual(DESTINATIONS);
  });

  test("도시명 부분 일치", () => {
    expect(filterDestinations("부").map((x) => x.title)).toEqual(["부산"]);
    expect(filterDestinations(" 제주 ").map((x) => x.title)).toEqual(["제주"]);
  });

  test("설명으로도 찾는다", () => {
    expect(filterDestinations("바다").map((x) => x.title)).toEqual(["부산"]);
  });

  test("일치하는 게 없으면 빈 배열 (데이터 없는 도시는 목록에 없다)", () => {
    expect(filterDestinations("뉴욕")).toEqual([]);
    expect(filterDestinations("강릉")).toEqual([]);
  });

  test("탭별로 결과가 있는 도시만 — 서비스 탭에는 제주가 없다", () => {
    expect(filterDestinations("", 0).map((x) => x.title)).toEqual(["서울", "부산", "제주"]);
    expect(filterDestinations("", 2).map((x) => x.title)).toEqual(["서울", "부산"]);
    expect(filterDestinations("제주", 2)).toEqual([]);
  });
});

describe("resolveSearchLocation", () => {
  test("목록에서 고른 도시가 입력 텍스트보다 우선", () => {
    expect(resolveSearchLocation("부산", "부")).toBe("부산");
  });

  test("고른 도시가 없으면 입력 텍스트(앞뒤 공백 제거)로 검색", () => {
    expect(resolveSearchLocation("", "  서울 ")).toBe("서울");
    expect(resolveSearchLocation("", "")).toBe("");
  });
});

describe("selectDay (달력 클릭 → 다음 선택)", () => {
  test("비어 있으면 체크인", () => {
    expect(selectDay(EMPTY_DATE_SELECTION, d(10, 8))).toMatchObject({ start: d(10, 8), end: null });
  });

  test("체크인 뒤 날짜는 체크아웃", () => {
    const s = selectDay(selectDay(EMPTY_DATE_SELECTION, d(10, 8)), d(10, 11));
    expect(s).toMatchObject({ start: d(10, 8), end: d(10, 11) });
  });

  test("체크인 앞 날짜를 고르면 순서를 바꾼다", () => {
    const s = selectDay(selectDay(EMPTY_DATE_SELECTION, d(10, 8)), d(10, 5));
    expect(s).toMatchObject({ start: d(10, 5), end: d(10, 8) });
  });

  test("기간이 완성된 뒤 클릭하면 새 체크인부터 다시", () => {
    const full = { ...EMPTY_DATE_SELECTION, start: d(10, 8), end: d(10, 11) };
    expect(selectDay(full, d(10, 20))).toMatchObject({ start: d(10, 20), end: null });
  });

  test("체크인과 같은 날 클릭은 그대로", () => {
    const s = selectDay(EMPTY_DATE_SELECTION, d(10, 8));
    expect(selectDay(s, d(10, 8))).toBe(s);
  });

  test("날짜 외의 선택(±일, 유연한 일정)은 보존한다", () => {
    const s = { ...EMPTY_DATE_SELECTION, flexibility: 3, flexMonths: [1, 2] };
    expect(selectDay(s, d(10, 8))).toMatchObject({ flexibility: 3, flexMonths: [1, 2] });
  });
});

describe("formatDateSelectionLabel", () => {
  test("선택이 없으면 null", () => {
    expect(formatDateSelectionLabel(EMPTY_DATE_SELECTION)).toBeNull();
  });

  test("체크인만 / 기간 / ±일", () => {
    const s = { ...EMPTY_DATE_SELECTION, start: d(10, 8) };
    expect(formatDateSelectionLabel(s)).toBe("10월 8일");
    expect(formatDateSelectionLabel({ ...s, end: d(10, 11) })).toBe("10월 8일 ~ 10월 11일");
    expect(formatDateSelectionLabel({ ...s, end: d(10, 11), flexibility: 2 })).toBe("10월 8일 ~ 10월 11일 ±2");
  });
});

describe("countGuests", () => {
  test("모든 유형을 합산", () => {
    expect(countGuests({ adults: 2, children: 1, infants: 1, pets: 1 })).toBe(5);
  });
});
