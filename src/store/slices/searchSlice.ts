import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchParams } from "@/types";

interface SearchState extends SearchParams {
  isSearchOpen: boolean;
  activeField: "location" | "checkIn" | "checkOut" | "guests" | null;
}

const initialState: SearchState = {
  location: "",
  checkIn: null,
  checkOut: null,
  guests: 1,
  isSearchOpen: false,
  activeField: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
    setCheckIn(state, action: PayloadAction<string | null>) {
      state.checkIn = action.payload;
    },
    setCheckOut(state, action: PayloadAction<string | null>) {
      state.checkOut = action.payload;
    },
    setGuests(state, action: PayloadAction<number>) {
      state.guests = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.isSearchOpen = action.payload;
    },
    setActiveField(
      state,
      action: PayloadAction<SearchState["activeField"]>
    ) {
      state.activeField = action.payload;
    },
    resetSearch(state) {
      state.location = "";
      state.checkIn = null;
      state.checkOut = null;
      state.guests = 1;
      state.isSearchOpen = false;
      state.activeField = null;
    },
  },
});

export const {
  setLocation,
  setCheckIn,
  setCheckOut,
  setGuests,
  setSearchOpen,
  setActiveField,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
