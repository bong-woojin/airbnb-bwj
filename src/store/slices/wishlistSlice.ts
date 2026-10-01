import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 위시리스트(찜하기) 상태만 관리하는 슬라이스.
// 저장/복원은 providers.tsx에서 localStorage와 동기화한다.
interface WishlistState {
  wishlistedIds: string[];
}

const initialState: WishlistState = {
  wishlistedIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
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
  },
});

export const { toggleWishlist, setWishlistedIds } = wishlistSlice.actions;

export default wishlistSlice.reducer;
