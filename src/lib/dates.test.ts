import { describe, expect, test } from "vitest";
import {
  addDays,
  formatAvailabilityLabel,
  formatRangeLabel,
  formatYMD,
  getAvailabilityRange,
  getToday,
  isStayWithinRange,
  parseYMD,
} from "./dates";

// 테스트 기준일 고정: 2026년 7월 8일
const TODAY = new Date(2026, 6, 8);

describe("getToday (KST 자정 기준 정규화)", () => {
  // 실행 환경의 타임존과 무관하게 같은 결과가 나와야 서버/클라이언트가 일치한다.
  test("UTC 기준 전날 15:00 이후는 KST로 다음날이다", () => {
    expect(getToday(new Date("2026-09-30T15:30:00Z"))).toEqual(new Date(2026, 9, 1));
  });

  test("KST 23:59까지는 같은 날이다", () => {
    expect(getToday(new Date("2026-10-01T14:59:59Z"))).toEqual(new Date(2026, 9, 1));
    expect(getToday(new Date("2026-10-01T15:00:00Z"))).toEqual(new Date(2026, 9, 2));
  });

  test("해 넘김: UTC 12/31 15:00 = KST 1/1", () => {
    expect(getToday(new Date("2026-12-31T15:00:00Z"))).toEqual(new Date(2027, 0, 1));
  });

  test("시각 정보 없이 자정 Date를 반환한다", () => {
    const d = getToday(new Date("2026-10-01T03:21:00Z"));
    expect([d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()]).toEqual([0, 0, 0, 0]);
  });
});

describe("getAvailabilityRange (오프셋 → Date)", () => {
  test("오늘 + startOffset부터 nights박", () => {
    const r = getAvailabilityRange({ startOffset: 7, nights: 5 }, TODAY);
    expect(r).toEqual({ start: new Date(2026, 6, 15), end: new Date(2026, 6, 20) });
  });

  test("오프셋 0이면 오늘 시작", () => {
    const r = getAvailabilityRange({ startOffset: 0, nights: 4 }, TODAY);
    expect(r!.start).toEqual(TODAY);
    expect(r!.end).toEqual(new Date(2026, 6, 12));
  });

  test("달 넘김: 기간이 다음 달로 이어진다", () => {
    const r = getAvailabilityRange({ startOffset: 20, nights: 5 }, TODAY);
    expect(r).toEqual({ start: new Date(2026, 6, 28), end: new Date(2026, 7, 2) });
  });

  test("해 넘김: 12월 말 시작 → 다음 해 1월 종료", () => {
    const r = getAvailabilityRange({ startOffset: 2, nights: 5 }, new Date(2026, 11, 28));
    expect(r).toEqual({ start: new Date(2026, 11, 30), end: new Date(2027, 0, 4) });
  });

  test("시작 자체가 다음 해로 넘어가는 큰 오프셋", () => {
    const r = getAvailabilityRange({ startOffset: 90, nights: 6 }, new Date(2026, 9, 1));
    expect(r).toEqual({ start: new Date(2026, 11, 30), end: new Date(2027, 0, 5) });
  });

  test("기간 정보가 없으면 null", () => {
    expect(getAvailabilityRange({}, TODAY)).toBeNull();
    expect(getAvailabilityRange({ startOffset: 3 }, TODAY)).toBeNull();
    expect(getAvailabilityRange({ nights: 3 }, TODAY)).toBeNull();
  });
});

describe("formatAvailabilityLabel (오프셋 → 카드 라벨)", () => {
  test("같은 달", () => {
    expect(formatAvailabilityLabel({ startOffset: 7, nights: 5 }, TODAY)).toBe("7월 15일~20일");
  });

  test("달 넘김", () => {
    expect(formatAvailabilityLabel({ startOffset: 20, nights: 5 }, TODAY)).toBe("7월 28일~8월 2일");
  });

  test("해 넘김", () => {
    expect(formatAvailabilityLabel({ startOffset: 2, nights: 5 }, new Date(2026, 11, 28))).toBe("12월 30일~1월 4일");
  });

  test("기준일이 바뀌면 같은 오프셋도 다른 날짜가 된다 (데이터가 낡지 않음)", () => {
    expect(formatAvailabilityLabel({ startOffset: 7, nights: 5 }, new Date(2026, 9, 1))).toBe("10월 8일~13일");
  });

  test("기간 정보가 없으면 undefined", () => {
    expect(formatAvailabilityLabel({}, TODAY)).toBeUndefined();
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

describe("addDays", () => {
  test("일 단위 더하기/빼기", () => {
    expect(addDays(new Date(2026, 6, 16), 1)).toEqual(new Date(2026, 6, 17));
    expect(addDays(new Date(2026, 6, 16), -5)).toEqual(new Date(2026, 6, 11));
  });

  test("달/연도 경계를 넘어간다", () => {
    expect(addDays(new Date(2026, 6, 31), 1)).toEqual(new Date(2026, 7, 1));
    expect(addDays(new Date(2026, 0, 2), -5)).toEqual(new Date(2025, 11, 28));
  });
});

describe("formatRangeLabel", () => {
  test("같은 달이면 '7월 15일~20일' 형식", () => {
    expect(formatRangeLabel(new Date(2026, 6, 15), new Date(2026, 6, 20))).toBe("7월 15일~20일");
  });

  test("달이 다르면 '7월 29일~8월 3일' 형식", () => {
    expect(formatRangeLabel(new Date(2026, 6, 29), new Date(2026, 7, 3))).toBe("7월 29일~8월 3일");
  });

  test("해가 다르면 달이 바뀌는 형식으로 표시한다", () => {
    expect(formatRangeLabel(new Date(2026, 11, 29), new Date(2027, 0, 3))).toBe("12월 29일~1월 3일");
  });
});
