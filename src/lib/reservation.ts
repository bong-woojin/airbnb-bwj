// 예약 요청 본문 검증 — Route Handler(app/api/reservations)가 사용하는 순수 로직.
// HTTP와 분리해두어 Vitest로 경계 케이스를 직접 검증한다.

import { parseYMD } from "./dates";

export interface ReservationRequest {
  itemId: string;
  checkin: string; // "YYYY-MM-DD"
  checkout: string; // "YYYY-MM-DD" (체험/서비스는 checkin과 동일한 하루)
  guests: number;
}

export type ParseResult = { ok: true; data: ReservationRequest } | { ok: false; error: string };

export function parseReservationRequest(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "요청 본문이 올바르지 않습니다." };
  }
  const { itemId, checkin, checkout, guests } = body as Record<string, unknown>;

  if (typeof itemId !== "string" || itemId.trim() === "") {
    return { ok: false, error: "상품 정보가 없습니다." };
  }

  const start = typeof checkin === "string" ? parseYMD(checkin) : null;
  const end = typeof checkout === "string" ? parseYMD(checkout) : null;
  if (!start || !end) {
    return { ok: false, error: "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)" };
  }
  if (end < start) {
    return { ok: false, error: "체크아웃 날짜는 체크인 날짜보다 빠를 수 없습니다." };
  }

  if (typeof guests !== "number" || !Number.isInteger(guests) || guests < 1) {
    return { ok: false, error: "게스트 수는 1명 이상이어야 합니다." };
  }

  return {
    ok: true,
    data: { itemId: itemId.trim(), checkin: checkin as string, checkout: checkout as string, guests },
  };
}
