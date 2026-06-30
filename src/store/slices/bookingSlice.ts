import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingState } from "@/types";

const initialState: BookingState = {
  roomId: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  totalPrice: 0,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    initBooking(state, action: PayloadAction<{ roomId: string; pricePerNight: number }>) {
      state.roomId = action.payload.roomId;
    },
    setBookingDates(
      state,
      action: PayloadAction<{ checkIn: string | null; checkOut: string | null; pricePerNight: number }>
    ) {
      const { checkIn, checkOut, pricePerNight } = action.payload;
      state.checkIn = checkIn;
      state.checkOut = checkOut;
      if (checkIn && checkOut) {
        const nights = Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        state.totalPrice = nights > 0 ? nights * pricePerNight : 0;
      } else {
        state.totalPrice = 0;
      }
    },
    setBookingGuests(state, action: PayloadAction<number>) {
      state.guests = action.payload;
    },
    clearBooking() {
      return initialState;
    },
  },
});

export const { initBooking, setBookingDates, setBookingGuests, clearBooking } =
  bookingSlice.actions;

export default bookingSlice.reducer;
