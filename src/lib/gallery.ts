// 상세 갤러리(5칸)에 쓸 사진 고르기. 목업 데이터는 항목당 사진이 1장뿐이라
// 대표 사진 + 같은 카테고리 사진 풀에서 나머지를 뽑는다.
// 결정적(deterministic)이어야 한다 — 새로고침할 때마다 사진이 바뀌면 안 되고,
// 서버가 고른 값이 그대로 클라이언트로 넘어가므로 Math.random을 쓰지 않는다.

export const GALLERY_SIZE = 5;

// 문자열 → 0 이상 정수 (id별로 시작 위치를 다르게 하기 위한 간단한 해시)
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h;
}

// [대표 사진, 그 외 사진 4장]. 풀에서 대표 사진·중복을 빼고 id로 정한 위치부터 순서대로 뽑는다.
// 풀이 모자라면(사진이 5장 미만) 있는 만큼만 돌려준다 — 같은 사진을 반복하지 않는다.
export function pickGalleryImages(main: string, pool: string[], seed: string, count = GALLERY_SIZE): string[] {
  const others = [...new Set(pool)].filter((src) => src !== main);
  if (others.length === 0) return [main];
  const start = hash(seed) % others.length;
  const picked = Array.from({ length: Math.min(count - 1, others.length) }, (_, i) => others[(start + i) % others.length]);
  return [main, ...picked];
}

// 목록 카드용: 각 항목에 상세 갤러리와 같은 사진 묶음을 붙인다 (카드에서 넘겨 본 사진 = 상세에서 보는 사진)
export function withCardImages<T extends { id: string; image: string }>(items: T[], pool: string[]): (T & { images: string[] })[] {
  return items.map((item) => ({ ...item, images: pickGalleryImages(item.image, pool, item.id) }));
}
