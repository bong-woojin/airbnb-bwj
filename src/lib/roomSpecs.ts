// 숙소 규모 문구(부제목·소개 메타)를 최대 숙박 인원에서 만든다.
// 목업 데이터엔 인원(maxGuests)만 있어서, 고정 문구("최대9인")를 쓰면 예약카드 상한·서버 검증과 어긋난다.
// 침실/침대/욕실 수는 인원에서 추정한 값 — 2인당 침실·침대 1개, 5인 이상이면 욕실 2개.

// 예약 인원 상한: 숙소는 maxGuests, 인원 정보가 없는 체험/서비스는 소규모 진행 기준 9명.
// 유아는 인원에 포함하지 않는다 (예약카드 안내 문구·서버 검증과 같은 기준).
export const DEFAULT_MAX_GUESTS = 9;

export interface RoomSpecs {
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
}

export function roomSpecs(maxGuests: number): RoomSpecs {
  const max = Math.max(1, Math.floor(maxGuests));
  const bedrooms = Math.ceil(max / 2);
  return { maxGuests: max, bedrooms, beds: bedrooms, baths: max >= 5 ? 2 : 1 };
}

// 상세 페이지 제목 아래 부제목: "부산 · 해운대 · 침실3 · 욕실2 · 최대6인"
export function roomSubtitle(location: string, maxGuests: number): string {
  const s = roomSpecs(maxGuests);
  return `${location} · 침실${s.bedrooms} · 욕실${s.baths} · 최대${s.maxGuests}인`;
}

// 소개 섹션 메타: "최대 인원 6명 · 침실 3개 · 침대 3개 · 욕실 2개"
export function roomIntroMeta(maxGuests: number): string {
  const s = roomSpecs(maxGuests);
  return `최대 인원 ${s.maxGuests}명 · 침실 ${s.bedrooms}개 · 침대 ${s.beds}개 · 욕실 ${s.baths}개`;
}

// 예약카드 인원 계산: 성인 + 어린이 (유아·반려동물 제외)
export function countStayGuests(g: { adults: number; children: number }): number {
  return g.adults + g.children;
}
