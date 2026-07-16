export interface ListingItem {
  id: string;
  image: string;
  location: string;
  date?: string;
  price: number;
  rating: number;
  tag?: string;
  // 최대 숙박 인원 — 게스트 수 검색 필터 판정에 사용 (숙소 전용, 체험/서비스는 미사용)
  maxGuests?: number;
}
