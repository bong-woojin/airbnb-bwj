import { describe, expect, test } from "vitest";
import {
  formatRangeLabel,
  formatYMD,
  isStayWithinRange,
  parseCardDateRange,
  parseYMD,
} from "./dates";

// 테스트 기준일 고정: 2026년 7월 8일 (연도 롤오버 판정이 결정적이도록)
const TODAY = new Date(2026, 6, 8);

describe("parseCardDateRange", () => {
  test("같은 달 형식('7월 15일~20일')을 파싱한다", () => {
    const r = parseCardDateRange("7월 15일~20일", TODAY);
    expect(r).not.toBeNull();
    expect(r!.start).toEqual(new Date(2026, 6, 15));
    expect(r!.end).toEqual(new Date(2026, 6, 20));
  });

  test("달이 넘어가는 형식('7월 28일~8월 2일')을 파싱한다", () => {
    const r = parseCardDateRange("7월 28일~8월 2일", TODAY);
    expect(r!.start).toEqual(new Date(2026, 6, 28));
    expect(r!.end).toEqual(new Date(2026, 7, 2));
  });

  test("기간이 완전히 지났으면 내년으로 해석한다", () => {
    const r = parseCardDateRange("3월 1일~5일", TODAY);
    expect(r!.start.getFullYear()).toBe(2027);
    expect(r!.end.getFullYear()).toBe(2027);
  });

  test("시작일은 지났지만 종료일이 남았으면 올해로 해석한다", () => {
    // 오늘이 7/8, 기간 7/1~7/10 → 아직 진행 중이므로 2026년
    const r = parseCardDateRange("7월 1일~10일", TODAY);
    expect(r!.start.getFullYear()).toBe(2026);
    expect(r!.end).toEqual(new Date(2026, 6, 10));
  });

  test("빈 값/형식이 다른 문자열은 null을 반환한다", () => {
    expect(parseCardDateRange(undefined, TODAY)).toBeNull();
    expect(parseCardDateRange("", TODAY)).toBeNull();
    expect(parseCardDateRange("오후 5:30", TODAY)).toBeNull();
    expect(parseCardDateRange("날짜 미정", TODAY)).toBeNull();
  });
});

describe("isStayWithinRange", () => {
  const range = { start: new Date(2026, 6, 15), end: new Date(2026, 6, 20) };

  test("기간 안에 완전히 포함되면 true", () => {
    expect(isStayWithinRange(new Date(2026, 6, 16), new Date(2026, 6, 19), range)).toBe(true);
  });

  test("경계와 정확히 일치해도 true", () => {
    expect(isStayWithinRange(new Date(2026, 6, 15), new Date(2026, 6, 20), range)).toBe(true);
  });

  test("체크아웃이 하루라도 벗어나면 false", () => {
    expect(isStayWithinRange(new Date(2026, 6, 16), new Date(2026, 6, 21), range)).toBe(false);
  });

  test("체크인이 하루라도 앞서면 false", () => {
    expect(isStayWithinRange(new Date(2026, 6, 14), new Date(2026, 6, 19), range)).toBe(false);
  });
});

describe("formatYMD / parseYMD", () => {
  test("Date → 'YYYY-MM-DD' 문자열로 변환한다 (0 채움 포함)", () => {
    expect(formatYMD(new Date(2026, 6, 8))).toBe("2026-07-08");
    expect(formatYMD(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  test("문자열 → Date 왕복 변환이 일치한다", () => {
    const d = new Date(2026, 7, 3);
    expect(parseYMD(formatYMD(d))).toEqual(d);
  });

  test("잘못된 형식은 null을 반환한다", () => {
    expect(parseYMD(undefined)).toBeNull();
    expect(parseYMD("2026/07/08")).toBeNull();
    expect(parseYMD("abc")).toBeNull();
  });
});

describe("formatRangeLabel", () => {
  test("같은 달이면 '7월 15일~20일' 형식", () => {
    expect(formatRangeLabel(new Date(2026, 6, 15), new Date(2026, 6, 20))).toBe("7월 15일~20일");
  });

  test("달이 다르면 '7월 29일~8월 3일' 형식", () => {
    expect(formatRangeLabel(new Date(2026, 6, 29), new Date(2026, 7, 3))).toBe("7월 29일~8월 3일");
  });
});
