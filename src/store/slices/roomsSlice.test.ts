import { describe, expect, test } from "vitest";
import reducer, { setWishlistedIds, toggleWishlist } from "./roomsSlice";

const empty = { wishlistedIds: [] };

describe("roomsSlice - 위시리스트", () => {
  test("toggleWishlist: 없는 id는 추가된다", () => {
    const state = reducer(empty, toggleWishlist("1"));
    expect(state.wishlistedIds).toEqual(["1"]);
  });

  test("toggleWishlist: 이미 있는 id는 제거된다", () => {
    const added = reducer(empty, toggleWishlist("1"));
    const removed = reducer(added, toggleWishlist("1"));
    expect(removed.wishlistedIds).toEqual([]);
  });

  test("toggleWishlist: 다른 id에는 영향을 주지 않는다", () => {
    let state = reducer(empty, toggleWishlist("1"));
    state = reducer(state, toggleWishlist("2"));
    state = reducer(state, toggleWishlist("1"));
    expect(state.wishlistedIds).toEqual(["2"]);
  });

  test("setWishlistedIds: localStorage 복원용 일괄 설정", () => {
    const state = reducer(empty, setWishlistedIds(["3", "j8"]));
    expect(state.wishlistedIds).toEqual(["3", "j8"]);
  });
});
