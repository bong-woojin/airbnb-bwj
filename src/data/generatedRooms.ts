import type { ListingItem } from "./types";

// 손으로 만든 24개 외의 숙소를 규칙으로 대량 생성한다 (무한 스크롤/검색 데모용 볼륨 확보).
//
// 반드시 결정적(deterministic)이어야 한다: 이 모듈은 서버(목록 페이지, API)와
// 클라이언트(홈)가 각각 import해서 실행하므로, Math.random을 쓰면 서버가 렌더링한
// HTML과 브라우저가 그린 결과가 달라져 hydration mismatch가 발생한다.

const CITY_NEIGHBORHOODS: Record<string, string[]> = {
  부산: ["서면", "전포동", "민락동", "송정", "다대포", "연산동", "온천장", "청사포", "가덕도", "범일동"],
  서울: ["종로", "잠실", "여의도", "성북동", "서촌", "문래동", "한남동", "망원동", "익선동", "삼청동"],
  제주: ["표선", "협재", "김녕", "월정리", "곽지", "세화", "대정", "조천", "화순", "사계리"],
};

const CITIES = Object.keys(CITY_NEIGHBORHOODS);

// 인덱스 기반 의사 난수 [0, 1). 정수/비트 연산만 사용 — 결과가 모든 JS 엔진에서 동일하다.
// (Math.sin 같은 초월함수는 엔진마다 마지막 비트가 다를 수 있어 피한다)
function pseudo(seed: number): number {
  let x = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 0x100000000;
}

export function generateRooms(count: number, imagePool: string[]): ListingItem[] {
  return Array.from({ length: count }, (_, i) => {
    const city = CITIES[i % CITIES.length];
    const neighborhoods = CITY_NEIGHBORHOODS[city];
    const neighborhood = neighborhoods[Math.floor(pseudo(i * 7 + 1) * neighborhoods.length)];

    // 예약 가능 기간: 오늘로부터 0~90일 뒤 시작, 4~6박. 오늘과 무관한 순수 숫자라
    // 서버·클라이언트가 언제 실행해도 같은 값을 만든다 (실제 날짜는 표시 시점에 계산).
    const startOffset = Math.floor(pseudo(i * 7 + 2) * 91);
    const nights = 4 + Math.floor(pseudo(i * 7 + 3) * 3);

    const price = Math.round((250_000 + pseudo(i * 7 + 4) * 1_550_000) / 10_000) * 10_000;
    const rating = Math.round((4.5 + pseudo(i * 7 + 5) * 0.48) * 100) / 100;

    return {
      id: `gr${i + 1}`,
      image: imagePool[Math.floor(pseudo(i * 7 + 6) * imagePool.length)],
      location: `${city} · ${neighborhood}`,
      startOffset,
      nights,
      price,
      rating,
      tag: pseudo(i * 7 + 7) < 0.3 ? "게스트 선호" : undefined,
      maxGuests: 2 + Math.floor(pseudo(i * 7 + 8) * 7),
    };
  });
}
