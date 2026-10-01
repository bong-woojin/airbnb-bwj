import { describe, expect, test } from "vitest";
import { homeTabHref, parseTab, searchPathForTab } from "./tabs";

describe("parseTab", () => {
  test("슬러그 → 탭 인덱스", () => {
    expect(parseTab("rooms")).toBe(0);
    expect(parseTab("experiences")).toBe(1);
    expect(parseTab("services")).toBe(2);
  });

  test("없거나 모르는 값은 숙소 탭", () => {
    expect(parseTab(undefined)).toBe(0);
    expect(parseTab("")).toBe(0);
    expect(parseTab("EXPERIENCES")).toBe(0);
    expect(parseTab(["experiences", "services"])).toBe(0); // ?tab=a&tab=b
  });
});

describe("homeTabHref / searchPathForTab", () => {
  test("탭 인덱스 → 홈 URL", () => {
    expect(homeTabHref(0)).toBe("/?tab=rooms");
    expect(homeTabHref(1)).toBe("/?tab=experiences");
    expect(homeTabHref(2)).toBe("/?tab=services");
  });

  test("탭 인덱스 → 검색 목록 경로", () => {
    expect(searchPathForTab(0)).toBe("/rooms");
    expect(searchPathForTab(1)).toBe("/experiences");
    expect(searchPathForTab(2)).toBe("/services");
  });

  test("범위 밖 인덱스는 숙소로", () => {
    expect(homeTabHref(9)).toBe("/?tab=rooms");
    expect(searchPathForTab(-1)).toBe("/rooms");
  });

  test("왕복 변환이 일치한다", () => {
    for (const i of [0, 1, 2]) {
      expect(parseTab(new URLSearchParams(homeTabHref(i).slice(2)).get("tab") ?? undefined)).toBe(i);
    }
  });
});
