import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  setLocation,
  setCheckIn,
  setCheckOut,
  setGuests,
  setActiveField,
  setSearchOpen,
  resetSearch,
} from "@/store/slices/searchSlice";
import { setFilteredBySearch } from "@/store/slices/roomsSlice";

// 검색 관련 상태와 액션을 한 곳에서 관리하는 커스텀 훅
export function useSearch() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useAppSelector((state) => state.search);

  const updateLocation = useCallback(
    (value: string) => {
      dispatch(setLocation(value));
    },
    [dispatch]
  );

  const updateCheckIn = useCallback(
    (date: string | null) => {
      dispatch(setCheckIn(date));
    },
    [dispatch]
  );

  const updateCheckOut = useCallback(
    (date: string | null) => {
      dispatch(setCheckOut(date));
    },
    [dispatch]
  );

  const updateGuests = useCallback(
    (count: number) => {
      dispatch(setGuests(count));
    },
    [dispatch]
  );

  const openSearch = useCallback(() => {
    dispatch(setSearchOpen(true));
  }, [dispatch]);

  const closeSearch = useCallback(() => {
    dispatch(setSearchOpen(false));
    dispatch(setActiveField(null));
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    dispatch(setFilteredBySearch(search.location));
    dispatch(setSearchOpen(false));
    const params = new URLSearchParams();
    if (search.location) params.set("location", search.location);
    if (search.checkIn) params.set("checkIn", search.checkIn);
    if (search.checkOut) params.set("checkOut", search.checkOut);
    if (search.guests > 1) params.set("guests", String(search.guests));
    router.push(`/rooms?${params.toString()}`);
  }, [dispatch, router, search]);

  const handleReset = useCallback(() => {
    dispatch(resetSearch());
  }, [dispatch]);

  const focusField = useCallback(
    (field: "location" | "checkIn" | "checkOut" | "guests" | null) => {
      dispatch(setActiveField(field));
    },
    [dispatch]
  );

  return {
    ...search,
    updateLocation,
    updateCheckIn,
    updateCheckOut,
    updateGuests,
    openSearch,
    closeSearch,
    handleSearch,
    handleReset,
    focusField,
  };
}
