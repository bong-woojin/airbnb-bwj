import { useState, useCallback } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { applyFilters } from "@/store/slices/roomsSlice";

// 숙소 필터링(가격, 방 유형, 편의시설) 상태와 적용 로직을 담당하는 훅
export function useFilter() {
  const dispatch = useAppDispatch();
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [roomType, setRoomType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = useCallback((amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  }, []);

  const apply = useCallback(() => {
    dispatch(
      applyFilters({
        priceMin,
        priceMax,
        roomType,
        amenities: selectedAmenities,
      })
    );
  }, [dispatch, priceMin, priceMax, roomType, selectedAmenities]);

  const reset = useCallback(() => {
    setPriceMin(0);
    setPriceMax(1000000);
    setRoomType("");
    setSelectedAmenities([]);
    dispatch(applyFilters({ priceMin: 0, priceMax: 1000000, roomType: "", amenities: [] }));
  }, [dispatch]);

  return {
    priceMin,
    priceMax,
    roomType,
    selectedAmenities,
    setPriceMin,
    setPriceMax,
    setRoomType,
    toggleAmenity,
    apply,
    reset,
  };
}
