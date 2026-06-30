import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  initBooking,
  setBookingDates,
  setBookingGuests,
  clearBooking,
} from "@/store/slices/bookingSlice";

// 예약 날짜 선택, 인원 설정, 총 금액 계산을 담당하는 커스텀 훅
export function useBooking(roomId: string, pricePerNight: number) {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking);

  const initialize = useCallback(() => {
    dispatch(initBooking({ roomId, pricePerNight }));
  }, [dispatch, roomId, pricePerNight]);

  const updateDates = useCallback(
    (checkIn: string | null, checkOut: string | null) => {
      dispatch(setBookingDates({ checkIn, checkOut, pricePerNight }));
    },
    [dispatch, pricePerNight]
  );

  const updateGuests = useCallback(
    (count: number) => {
      dispatch(setBookingGuests(count));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearBooking());
  }, [dispatch]);

  const nights =
    booking.checkIn && booking.checkOut
      ? Math.ceil(
          (new Date(booking.checkOut).getTime() -
            new Date(booking.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const serviceFee = Math.round(booking.totalPrice * 0.14);
  const grandTotal = booking.totalPrice + serviceFee;

  return {
    ...booking,
    nights,
    serviceFee,
    grandTotal,
    initialize,
    updateDates,
    updateGuests,
    clear,
  };
}
