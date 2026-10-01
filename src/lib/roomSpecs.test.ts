import { describe, expect, test } from "vitest";
import { countStayGuests, roomIntroMeta, roomSpecs, roomSubtitle } from "./roomSpecs";

describe("roomSpecs", () => {
  test("2인당 침실·침대 1개, 5인 이상이면 욕실 2개", () => {
    expect(roomSpecs(2)).toEqual({ maxGuests: 2, bedrooms: 1, beds: 1, baths: 1 });
    expect(roomSpecs(3)).toEqual({ maxGuests: 3, bedrooms: 2, beds: 2, baths: 1 });
    expect(roomSpecs(6)).toEqual({ maxGuests: 6, bedrooms: 3, beds: 3, baths: 2 });
    expect(roomSpecs(8)).toEqual({ maxGuests: 8, bedrooms: 4, beds: 4, baths: 2 });
  });

  test("비정상 값은 최소 1인으로", () => {
    expect(roomSpecs(0).maxGuests).toBe(1);
    expect(roomSpecs(2.7).maxGuests).toBe(2);
  });
});

describe("문구", () => {
  test("부제목과 소개 메타가 같은 최대 인원을 말한다", () => {
    expect(roomSubtitle("부산 · 남포동", 2)).toBe("부산 · 남포동 · 침실1 · 욕실1 · 최대2인");
    expect(roomIntroMeta(2)).toBe("최대 인원 2명 · 침실 1개 · 침대 1개 · 욕실 1개");
  });
});

describe("countStayGuests", () => {
  test("성인 + 어린이만 센다 (유아·반려동물 제외)", () => {
    expect(countStayGuests({ adults: 2, children: 1 })).toBe(3);
  });
});
