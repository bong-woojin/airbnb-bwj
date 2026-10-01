"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setWishlistedIds } from "@/store/slices/wishlistSlice";

const WISHLIST_STORAGE_KEY = "wishlistedIds";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        store.dispatch(setWishlistedIds(JSON.parse(saved)));
      }
    } catch {
      // localStorage 접근 불가 또는 저장된 값이 손상된 경우 초기 상태(빈 배열) 유지
    }

    let prevWishlistedIds = store.getState().wishlist.wishlistedIds;
    const unsubscribe = store.subscribe(() => {
      const wishlistedIds = store.getState().wishlist.wishlistedIds;
      if (wishlistedIds !== prevWishlistedIds) {
        prevWishlistedIds = wishlistedIds;
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistedIds));
      }
    });

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
