import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { toggleWishlist } from "@/store/slices/roomsSlice";

// 찜하기 기능 관련 로직을 담당하는 커스텀 훅
export function useWishlist(roomId: string) {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector((state) =>
    state.rooms.wishlistedIds.includes(roomId)
  );

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(toggleWishlist(roomId));
    },
    [dispatch, roomId]
  );

  return { isWishlisted, toggle };
}
