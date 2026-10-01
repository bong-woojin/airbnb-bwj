import { describe, expect, test } from "vitest";
import type { ListingItem } from "@/data/types";
import { buildDetailMeta, formatPrice, ogImageUrl, regionOf, toMetadata } from "./listingMeta";

const TODAY = new Date(2026, 9, 1);

const ROOM: ListingItem = {
  id: "1",
  image: "https://images.unsplash.com/photo-1?w=400",
  location: "부산 · 해운대",
  startOffset: 7,
  nights: 5,
  price: 1750000,
  rating: 4.92,
  maxGuests: 6,
};

const SERVICE: ListingItem = {
  id: "sb1",
  image: "https://images.unsplash.com/photo-2?w=400",
  location: "부산 해운대 스냅 촬영",
  price: 120000,
  rating: 4.9,
};

describe("buildDetailMeta", () => {
  test("숙소: 이름·지역·가격이 title에, 지역·날짜·가격·평점·인원이 description에", () => {
    const m = buildDetailMeta({ item: ROOM, kind: "rooms", name: "해운대 오션뷰", today: TODAY });
    expect(m.title).toBe("해운대 오션뷰 · 부산 · 해운대 · 총액 ₩1,750,000");
    expect(m.description).toBe("부산 · 해운대 · 10월 8일~13일 · 총액 ₩1,750,000 · ★ 4.92 · 최대 6인. Airbnb Clone에서 예약하세요.");
  });

  test("숙소: 이름이 없으면 '<지역>의 숙소'", () => {
    expect(buildDetailMeta({ item: ROOM, kind: "rooms", today: TODAY }).title).toBe("부산 · 해운대의 숙소 · 총액 ₩1,750,000");
  });

  test("서비스: 상품명 + 추정 도시 + 1인당 가격", () => {
    const m = buildDetailMeta({ item: SERVICE, kind: "services" });
    expect(m.title).toBe("부산 해운대 스냅 촬영 · 부산 · 1인당 ₩120,000부터");
    expect(m.description).toContain("부산 서비스 · 1인당 ₩120,000부터 · ★ 4.9");
  });

  test("체험: 지역은 가평", () => {
    expect(regionOf({ ...SERVICE, location: "자라섬 카약" }, "experiences")).toBe("가평");
  });
});

describe("formatPrice", () => {
  test("숙소는 총액, 체험/서비스는 1인당", () => {
    expect(formatPrice(ROOM, "rooms")).toBe("총액 ₩1,750,000");
    expect(formatPrice(SERVICE, "experiences")).toBe("1인당 ₩120,000부터");
  });
});

describe("ogImageUrl", () => {
  test("unsplash 썸네일은 1200px로 키운다", () => {
    expect(ogImageUrl("https://images.unsplash.com/photo-1?w=400")).toBe("https://images.unsplash.com/photo-1?w=1200");
  });

  test("다른 호스트·잘못된 URL은 그대로", () => {
    expect(ogImageUrl("https://picsum.photos/400")).toBe("https://picsum.photos/400");
    expect(ogImageUrl("not a url")).toBe("not a url");
  });
});

describe("toMetadata", () => {
  test("title/description이 Open Graph에도 그대로 들어간다", () => {
    const m = toMetadata("T", "D", "https://images.unsplash.com/p?w=400", "alt");
    expect(m).toMatchObject({
      title: "T",
      description: "D",
      openGraph: {
        title: "T",
        description: "D",
        siteName: "Airbnb Clone",
        locale: "ko_KR",
        images: [{ url: "https://images.unsplash.com/p?w=1200", alt: "alt" }],
      },
    });
  });

  test("이미지가 없으면 og:image를 넣지 않는다 (빈 검색 결과)", () => {
    expect((toMetadata("T", "D").openGraph as { images?: unknown }).images).toBeUndefined();
  });
});
