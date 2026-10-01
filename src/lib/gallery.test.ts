import { describe, expect, test } from "vitest";
import { pickGalleryImages } from "./gallery";

const POOL = ["a", "b", "c", "d", "e", "f", "g", "h"];

describe("pickGalleryImages", () => {
  test("대표 사진이 첫 칸, 총 5장, 중복 없음", () => {
    const r = pickGalleryImages("c", POOL, "room-1");
    expect(r).toHaveLength(5);
    expect(r[0]).toBe("c");
    expect(new Set(r).size).toBe(5);
  });

  test("같은 id면 항상 같은 결과 (결정적)", () => {
    expect(pickGalleryImages("c", POOL, "room-1")).toEqual(pickGalleryImages("c", POOL, "room-1"));
  });

  test("id가 다르면 고르는 사진도 달라진다", () => {
    const results = new Set(["1", "2", "3", "4", "5"].map((id) => pickGalleryImages("a", POOL, id).join()));
    expect(results.size).toBeGreaterThan(1);
  });

  test("풀의 중복 항목·대표 사진은 다시 뽑지 않는다", () => {
    const r = pickGalleryImages("a", ["a", "a", "b", "b", "c"], "x");
    expect(r[0]).toBe("a");
    expect(r.slice(1).sort()).toEqual(["b", "c"]);
  });

  test("풀이 모자라면 있는 만큼만 (반복 없음)", () => {
    expect(pickGalleryImages("a", ["a"], "x")).toEqual(["a"]);
    expect(pickGalleryImages("a", [], "x")).toEqual(["a"]);
  });
});
