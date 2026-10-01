export interface ListingItem {
  id: string;
  image: string;
  // 목록 카드에서 넘겨 볼 사진들 [대표, ...] — 데이터에 저장하지 않고 서버가 응답 직전에 붙인다 (lib/gallery.ts withCardImages)
  images?: string[];
  location: string;
  // 예약 가능 기간 — 표시용 라벨이 아니라 "오늘로부터의 상대값"으로 저장한다.
  // 실제 날짜는 화면에 보일 때 오늘(KST) 기준으로 계산하므로 시간이 지나도 데이터가 낡지 않는다.
  // (숙소 전용, 체험/서비스는 미사용)
  startOffset?: number; // 오늘로부터 며칠 뒤 시작
  nights?: number; // 박 수 (종료일 = 시작일 + nights)
  price: number;
  rating: number;
  tag?: string;
  // 최대 숙박 인원 — 게스트 수 검색 필터 판정에 사용 (숙소 전용, 체험/서비스는 미사용)
  maxGuests?: number;
}
