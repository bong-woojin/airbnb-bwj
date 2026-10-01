// 상세/목록 페이지의 <title>·description·Open Graph를 만드는 순수 함수.
// 페이지(generateMetadata)와 화면(ItemDetail)이 같은 이름·지역 규칙을 쓰도록 여기 모아둔다.

import type { Metadata } from "next";
import type { ListingItem } from "@/data/types";
import { formatAvailabilityLabel } from "./dates";

export const SITE_NAME = "Airbnb Clone";

export type ListingKind = "rooms" | "experiences" | "services";

export const KIND_LABEL: Record<ListingKind, string> = {
  rooms: "숙소",
  experiences: "체험",
  services: "서비스",
};

// 체험/서비스는 location이 도시명이 아니라 상품명이라, 제목에서 도시를 추정한다
export function guessCity(title: string): string {
  if (title.includes("부산")) return "부산";
  if (title.includes("제주")) return "제주";
  if (title.includes("서울")) return "서울";
  return "서울";
}

// 숙소 지역은 location("부산 · 해운대") 그대로, 체험은 전부 가평, 서비스는 상품명에서 추정
export function regionOf(item: ListingItem, kind: ListingKind): string {
  if (kind === "rooms") return item.location;
  if (kind === "experiences") return "가평";
  return guessCity(item.location);
}

export function formatPrice(item: ListingItem, kind: ListingKind): string {
  const won = `₩${item.price.toLocaleString("ko-KR")}`;
  return kind === "rooms" ? `총액 ${won}` : `1인당 ${won}부터`;
}

// OG 이미지는 공유 미리보기에서 크게 보이므로(권장 1200px), unsplash 썸네일(w=400)은 큰 사이즈로 바꿔 쓴다
export function ogImageUrl(src: string): string {
  try {
    const url = new URL(src);
    if (url.hostname === "images.unsplash.com") url.searchParams.set("w", "1200");
    return url.toString();
  } catch {
    return src;
  }
}

interface DetailMetaInput {
  item: ListingItem;
  kind: ListingKind;
  // 숙소 이름 — 숙소 데이터엔 이름 필드가 없어 상세 오버라이드의 부제목 첫 토막("해운대 오션뷰")을 쓴다
  name?: string;
  today?: Date;
}

export function buildDetailMeta({ item, kind, name, today }: DetailMetaInput): { title: string; description: string } {
  const region = regionOf(item, kind);
  const price = formatPrice(item, kind);

  if (kind === "rooms") {
    const title = `${name ? `${name} · ${region}` : `${region}의 숙소`} · ${price}`;
    const parts = [
      region,
      formatAvailabilityLabel(item, today),
      `${price}`,
      `★ ${item.rating}`,
      item.maxGuests ? `최대 ${item.maxGuests}인` : undefined,
    ].filter(Boolean);
    return { title, description: `${parts.join(" · ")}. ${SITE_NAME}에서 예약하세요.` };
  }

  // 체험/서비스는 location이 상품명이다
  const title = `${item.location} · ${region} · ${price}`;
  const parts = [`${region} ${KIND_LABEL[kind]}`, price, `★ ${item.rating}`, item.tag].filter(Boolean);
  return { title, description: `${parts.join(" · ")}. ${SITE_NAME}에서 예약하세요.` };
}

// title/description + Open Graph를 한 번에. openGraph는 부모(layout)와 얕게 병합되므로
// 공통 필드(siteName, locale)도 여기서 매번 채운다.
export function toMetadata(title: string, description: string, image?: string, imageAlt?: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: image ? [{ url: ogImageUrl(image), alt: imageAlt ?? title }] : undefined,
    },
  };
}
