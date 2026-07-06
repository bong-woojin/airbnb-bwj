import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from "@/types";
import { rooms as initialRooms } from "@/data/mockData";

interface RoomsState {
  rooms: Room[];
  filteredRooms: Room[];
  selectedRoom: Room | null;
  activeCategory: string;
  loading: boolean;
  wishlistedIds: string[];
}

const initialState: RoomsState = {
  rooms: initialRooms,
  filteredRooms: initialRooms,
  selectedRoom: null,
  activeCategory: "all",
  loading: false,
  wishlistedIds: [],
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setActiveCategory(state, action: PayloadAction<string>) {
      state.activeCategory = action.payload;
      if (action.payload === "all") {
        state.filteredRooms = state.rooms;
      } else {
        state.filteredRooms = state.rooms.filter(
          (room) => room.categoryId === action.payload
        );
      }
    },
    setSelectedRoom(state, action: PayloadAction<Room | null>) {
      state.selectedRoom = action.payload;
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const roomId = action.payload;
      const idx = state.wishlistedIds.indexOf(roomId);
      if (idx === -1) {
        state.wishlistedIds.push(roomId);
      } else {
        state.wishlistedIds.splice(idx, 1);
      }
    },
    setWishlistedIds(state, action: PayloadAction<string[]>) {
      state.wishlistedIds = action.payload;
    },
    applyFilters(
      state,
      action: PayloadAction<{
        priceMin: number;
        priceMax: number;
        roomType: string;
        amenities: string[];
      }>
    ) {
      const { priceMin, priceMax, roomType, amenities } = action.payload;
      let base = state.activeCategory === "all"
        ? state.rooms
        : state.rooms.filter((r) => r.categoryId === state.activeCategory);

      state.filteredRooms = base.filter((room) => {
        const priceOk = room.price >= priceMin && room.price <= priceMax;
        const typeOk = !roomType || room.type === roomType;
        const amenityOk =
          amenities.length === 0 ||
          amenities.every((a) => room.amenities.includes(a));
        return priceOk && typeOk && amenityOk;
      });
    },
    setFilteredBySearch(state, action: PayloadAction<string>) {
      const query = action.payload.toLowerCase();
      state.filteredRooms = state.rooms.filter(
        (room) =>
          room.location.city.toLowerCase().includes(query) ||
          room.location.country.toLowerCase().includes(query) ||
          room.title.toLowerCase().includes(query)
      );
    },
  },
});

export const {
  setActiveCategory,
  setSelectedRoom,
  toggleWishlist,
  setWishlistedIds,
  applyFilters,
  setFilteredBySearch,
} = roomsSlice.actions;

export default roomsSlice.reducer;
