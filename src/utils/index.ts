// 숫자를 한국 원화 형식으로 변환 (예: 280000 → "280,000원")
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

// 날짜 문자열을 "2024년 12월 25일" 형식으로 변환
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 두 날짜 사이의 박 수 계산
export function calcNights(checkIn: string, checkOut: string): number {
  return Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

// 별점을 소수점 2자리로 표시 (예: 4.9 → "4.90")
export function formatRating(rating: number): string {
  return rating.toFixed(2);
}

// 숫자 축약 (예: 1200 → "1.2k")
export function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}
