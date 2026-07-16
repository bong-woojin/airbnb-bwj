import { describe, expect, test } from "vitest";
import { parseReservationRequest } from "./reservation";

const VALID = { itemId: "1", checkin: "2026-07-19", checkout: "2026-07-21", guests: 2 };

describe("parseReservationRequest", () => {
  test("정상 요청을 통과시킨다", () => {
    const r = parseReservationRequest(VALID);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual(VALID);
  });

  test("체험/서비스처럼 체크인과 체크아웃이 같은 하루도 허용한다", () => {
    const r = parseReservationRequest({ ...VALID, checkout: VALID.checkin });
    expect(r.ok).toBe(true);
  });

  test("객체가 아닌 본문을 거부한다", () => {
    expect(parseReservationRequest(null).ok).toBe(false);
    expect(parseReservationRequest("문자열").ok).toBe(false);
    expect(parseReservationRequest(undefined).ok).toBe(false);
  });

  test("itemId가 없거나 빈 문자열이면 거부한다", () => {
    expect(parseReservationRequest({ ...VALID, itemId: undefined }).ok).toBe(false);
    expect(parseReservationRequest({ ...VALID, itemId: "  " }).ok).toBe(false);
  });

  test("잘못된 날짜 형식을 거부한다", () => {
    expect(parseReservationRequest({ ...VALID, checkin: "2026/07/19" }).ok).toBe(false);
    expect(parseReservationRequest({ ...VALID, checkout: "7월 21일" }).ok).toBe(false);
    expect(parseReservationRequest({ ...VALID, checkin: undefined }).ok).toBe(false);
  });

  test("체크아웃이 체크인보다 빠르면 거부한다", () => {
    const r = parseReservationRequest({ ...VALID, checkin: "2026-07-21", checkout: "2026-07-19" });
    expect(r.ok).toBe(false);
  });

  test("게스트 수가 1 미만이거나 정수가 아니면 거부한다", () => {
    expect(parseReservationRequest({ ...VALID, guests: 0 }).ok).toBe(false);
    expect(parseReservationRequest({ ...VALID, guests: 1.5 }).ok).toBe(false);
    expect(parseReservationRequest({ ...VALID, guests: "2" }).ok).toBe(false);
  });

  test("itemId 앞뒤 공백은 정리해서 반환한다", () => {
    const r = parseReservationRequest({ ...VALID, itemId: " 1 " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.itemId).toBe("1");
  });
});
