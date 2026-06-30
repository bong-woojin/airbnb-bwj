import { configureStore } from "@reduxjs/toolkit";
import roomsReducer from "./slices/roomsSlice";
import searchReducer from "./slices/searchSlice";
import bookingReducer from "./slices/bookingSlice";

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    search: searchReducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
