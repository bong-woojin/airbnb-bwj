"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ItemDetail.module.css";
import { useWishlist } from "@/hooks/useWishlist";
import BookingCard from "./BookingCard";
import type { ListingItem } from "@/data/types";

interface ItemDetailProps {
  item: ListingItem;
  backHref: string;
  backLabel: string;
  categoryLabel: string;
  perPerson?: boolean;
  subtitle?: string;
}

const HOST_NAME = "우진";
const REVIEW_COUNT = 8;

const HIGHLIGHTS = [
  {
    text: "상위 5% 숙소",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M9 12.5 7 21l5-3 5 3-2-8.5" />
      </svg>
    ),
  },
  {
    text: "부산역 근처",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    text: "여행 가방 보관 가능",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M4 13h16" />
      </svg>
    ),
  },
  {
    text: "편의성이 뛰어난 체크인 절차",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="4" />
        <path d="M11 11l9 9M17 15l2 2M14 18l2 2" />
      </svg>
    ),
  },
  {
    text: "세탁기 및 건조기",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <circle cx="12" cy="13" r="5" />
        <circle cx="8" cy="6" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    text: "에어컨",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12" />
      </svg>
    ),
  },
];

const AMENITIES_PREVIEW = [
  { label: "해변으로 연결", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20c4-4 8-8 20-8"/><path d="M2 20c2-6 6-10 10-12"/><path d="M17 8l1-5 4 1-1 5"/></svg> },
  { label: "와이파이", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg> },
  { label: "세탁기", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><circle cx="7.5" cy="6.5" r="0.75" fill="currentColor" stroke="none"/><circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none"/></svg> },
  { label: "냉장고", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14"/><path d="M9 6v2"/><path d="M9 14v3"/></svg> },
  { label: "주방", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg> },
  { label: "TV", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8"/><path d="M12 18v2"/></svg> },
  { label: "에어컨", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="8" rx="2"/><path d="M7 16l-2 4"/><path d="M12 16v4"/><path d="M17 16l2 4"/><path d="M6 12v2"/><path d="M12 12v2"/><path d="M18 12v2"/></svg> },
  { label: "전자레인지", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><rect x="15" y="8" width="4" height="8" rx="1"/><circle cx="8" cy="12" r="3"/></svg> },
];

const AMENITIES_SECTIONS = [
  {
    title: "욕실",
    items: [
      { label: "샴푸", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2h6l1 4H8L9 2z"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11h4"/></svg>, unavailable: false },
      { label: "컨디셔너", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2h6l1 4H8L9 2z"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/></svg>, unavailable: false },
      { label: "보디클렌저", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 3h10l2 4H5L7 3z"/><path d="M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/><path d="M9 12h6"/></svg>, unavailable: false },
      { label: "온수", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v4M4.93 5.93l2.83 2.83M2 12h4M4.93 18.07l2.83-2.83M12 22v-4M19.07 18.07l-2.83-2.83M22 12h-4M19.07 5.93l-2.83 2.83"/><circle cx="12" cy="12" r="3"/></svg>, unavailable: false },
    ],
  },
  {
    title: "침실 및 세탁 시설",
    items: [
      { label: "세탁기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/></svg>, unavailable: false },
      { label: "필수용품", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8a1 1 0 0 0-1 1v3h10V4a1 1 0 0 0-1-1z"/></svg>, unavailable: false },
      { label: "옷걸이", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="none"/><path d="M12 4v4L3 18h18L12 8"/></svg>, unavailable: false },
      { label: "침구", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"/><path d="M2 9h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z"/><path d="M12 9v11"/></svg>, unavailable: false },
      { label: "암막 커튼", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v2H3z"/><path d="M5 5v16"/><path d="M12 5v16"/><path d="M19 5v16"/></svg>, unavailable: false },
      { label: "의류 보관 공간", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>, unavailable: false },
    ],
  },
  {
    title: "엔터테인먼트",
    items: [
      { label: "TV", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/></svg>, unavailable: false },
    ],
  },
  {
    title: "냉난방",
    items: [
      { label: "에어컨", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="8" rx="2"/><path d="M7 16l-2 4M12 16v4M17 16l2 4M6 12v2M12 12v2M18 12v2"/></svg>, unavailable: false },
      { label: "난방", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c0 4-4 4-4 8a4 4 0 0 0 8 0c0-4-4-4-4-8z"/><path d="M9 22h6"/><path d="M12 18v4"/></svg>, unavailable: false },
    ],
  },
  {
    title: "숙소 안전",
    items: [
      { label: "화재경보기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>, unavailable: false },
      { label: "일산화탄소 경보기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>, unavailable: false },
      { label: "소화기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3h3v2H8z"/><path d="M10 5v2a4 4 0 0 1 4 4v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9a4 4 0 0 1 4-4z"/><path d="M11 3h4a1 1 0 0 1 1 1v1"/></svg>, unavailable: false },
      { label: "구급상자", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 9v6M9 12h6"/></svg>, unavailable: false },
    ],
  },
  {
    title: "인터넷 및 업무 공간",
    items: [
      { label: "와이파이", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>, unavailable: false },
    ],
  },
  {
    title: "주방 및 식사 공간",
    items: [
      { label: "주방", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>, unavailable: false },
      { label: "냉장고", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14"/><path d="M9 6v2"/></svg>, unavailable: false },
      { label: "전자레인지", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><rect x="15" y="8" width="4" height="8" rx="1"/></svg>, unavailable: false },
      { label: "기본 조리도구", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 3v11a4 4 0 0 0 8 0V3"/><path d="M7 8h8"/></svg>, unavailable: false },
      { label: "식기류", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2v7c0 1.66 1.34 3 3 3h2v10h2V12h2c1.66 0 3-1.34 3-3V2h-2v5H9V2H7v5H5V2H3z"/><path d="M16 2v20h2V13h2c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-4z"/></svg>, unavailable: false },
      { label: "소형 냉장고", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 11h12"/><path d="M10 7v2"/></svg>, unavailable: false },
      { label: "냉동고", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 6v12M9 9l3-3 3 3M9 15l3 3 3-3"/></svg>, unavailable: false },
      { label: "가스레인지", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="10" r="2"/><circle cx="16" cy="10" r="2"/><path d="M8 16h8"/></svg>, unavailable: false },
      { label: "와인 잔", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2h8l2 8H6L8 2z"/><path d="M12 10v8"/><path d="M8 22h8"/><path d="M6 10a6 6 0 0 0 12 0"/></svg>, unavailable: false },
    ],
  },
  {
    title: "위치 특성",
    items: [
      { label: "해변으로 연결", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20c4-4 8-8 20-8"/><path d="M2 20c2-6 6-10 10-12"/></svg>, unavailable: false },
    ],
  },
  {
    title: "서비스",
    items: [
      { label: "셀프 체크인", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, unavailable: false },
      { label: "디지털 도어록", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/></svg>, unavailable: false },
    ],
  },
  {
    title: "숙소에 없는 시설",
    items: [
      { label: "숙소 건물 외부 보안 카메라", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>, unavailable: true },
      { label: "건조기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M7 6h2"/></svg>, unavailable: true },
    ],
  },
];

const SLEEP_PHOTOS = [
  {
    label: "침실 1",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  },
  {
    label: "침실 2",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  },
  {
    label: "침실 3",
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600",
  },
  {
    label: "거실",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  },
];

const DESCRIPTION_TEXT = `안녕하세요. 🌸부산역 근처 정성 가득한 숙소, 정스테이(Jung Stay)입니다.

우리 집은 2026년 6월에 정성껏 리모델링을 마친 30평 규모의 넓고 고풍스러운 숙소입니다. 한국적인 따뜻함과 아늑함을 가득 담아, 귀한 걸음 해주시는 손님들이 내 집처럼 편안하게 쉬어가실 수 있도록 공간 하나하나 신경 써서 준비했습니다.

최대 9명까지 머무르실 수 있어 대가족 여행, 동창회나 동호회 모임, 오랜 친구들과의 우정 여행 등 소중한 분들과 함께하는 부산 여행에 더없이 좋은 선택이 되실 겁니다. 넉넉하고 훈훈한 정으로 손님들을 맞이하겠습니다.

숙소
🏠 공간 소개 (The Space)

크기 및 인원: 약 30평(100㎡)의 넓은 복층 구조로, 최대 9인까지 여유롭게 머무실 수 있습니다.

구조: 침실 3개 (퀸사이즈 침대 총 4개) + 거실 + 주방 + 욕실 2개

위치: 부산역에서 걸어서 7분 거리라 약간 거리가 있지만 거리가 있는 만큼 조용한곳에 있어 정말 괜찮습니다. (김해공항에서는 차로 30분 거리이며, 숙소 도보 2분 거리에 24시간 편의점이 있어 늦은 밤에도 든든합니다.)

게스트 이용 가능 공간/시설
🛋️ 정성으로 가꾼 공간들

▪️ 거실 (Living Room)
다 함께 둘러앉아 도란도란 이야기꽃을 피울 수 있는 9인용 대형 원목 식탁을 두었습니다.
55인치 스마트 TV로 보고 싶으신 모든 OTT 영상을 자유롭게 즐기실 수 있습니다.

초고속 무료 Wi-Fi는 물론, 여행지에서도 옷매무새를 깔끔하게 유지하실 수 있도록 스팀다리미도 챙겨두었습니다.

▪️ 침실 (Bedrooms - 총 3개)
편안하고 깊은 숙면을 위해 방마다 널찍한 퀸사이즈 침대를 총 4개 나누어 배치했습니다.

매일매일 깨끗하게 세탁하고 보송하게 말린 호텔급 고급 침구류로 갈아 끼우니 안심하고 꿀잠 자러 오세요.

방마다 옷걸이와 화장대, 거울을 각각 구비해 두어, 인원이 많아도 바쁜 아침 시간에 서두르지 않고 여유롭게 외출 준비를 하실 수 있습니다.

▪️ 주방 (Kitchen)
대가족이 오셔도 부족함 없도록 넉넉한 식기 세트와 냉장고, 전자레인지, 가스레인지, 전기포트를 세심하게 채워두었습니다.

크기별 냄비와 후라이팬, 조리도구 일체가 준비되어 있습니다. (※ 단, 소금이나 후추 같은 조미료는 개인 위생을 위해 제공되지 않으니 필요하신 경우 개별 지참 부탁드립니다.)

⚠️ 주의해 주세요: 다음번에 머무실 손님들을 위해 연기나 기름, 냄새가 많이 베이는 음식(고기구이, 해산물 요리, 마라탕, 매운탕 등)의 조리는 삼가해 주시기를 정중히 부탁드립니다.

▪️ 욕실 (Bathrooms - 총 2개)

욕실이 2개라 인원이 많아도 화장실 때문에 기다리는 일 없도록 준비했고, 드라이기 2개와 고데기 1개를 준비해 두었습니다. 면봉, 화장솜, 머리끈까지 세심하게 챙겨두었으니 편하게 쓰세요.

수건은 1인당 2장씩 보송한 상태로 기본 제공됩니다. (※ 3박 이상 오래 머무시는 분들은 숙소 내 세탁기와 건조기로 언제든 편하게 셀프 세탁하실 수 있습니다.)

▪️ 세탁기&건조기 (Washer & Dryer)
게스트분들의 쾌적한 여행을 위해 신제품 세탁기와 건조기를 구비해뒀습니다. 머무시는 동안 내 집처럼 편안하게 사용하세요!

🧳 게스트를 위한 세심한 서비스
짐 보관 서비스: 체크인 전이나 체크아웃 하신 후에도 무거운 가방 없이 가볍고 즐겁게 부산을 구경하실 수 있도록, 짐을 무료로 안전하게 보관해 드립니다.(사전 예약 필수)

하우스키핑 서비스: 3박 이상 연박하시는 귀한 손님들께는 내 집처럼 더 쾌적하게 지내실 수 있도록 중간에 무료 하우스키핑을 진행해 드립니다. (사전 예약 필수)

기타 주의사항
🤝 머무시는 동안 꼭 지켜주세요 (주의사항)
서로를 배려하는 따뜻한 마음으로 아래 사항들을 꼭 확인해 주시길 부탁드립니다.

1. 복층 안내: 저희 숙소는 3층과 4층을 함께 쓰는 복층 구조입니다. 건물 내에 엘리베이터는 없지만, 계단 층계가 낮고 완만해서 큰 짐을 들고 오르내리시기에도 크게 힘들지 않으실 겁니다. 하지만 심신이 미약하신 어르신이나 아이들에게는 어려움이 있는 숙소일수도 있습니다. 😭

2. 이용 시간: 입실은 오후 3시부터, 퇴실은 오전 11시까지입니다. 다음 손님을 위한 깨끗한 청소 시간을 위해 시간을 꼭 지켜주세요.

3. 전 객실 절대 금연 🚭: 화장실을 포함한 숙소 내부 전체가 당연히 금연입니다. 흡연 시 경보기가 울리거나 과태료 10만 원과 특수 청소 비용이 청구될 수 있으니 꼭 숙소 건물 외부에서 흡연해 주시고, 담배꽁초도 깔끔하게 처리해 주세요.

4. 인원 확인: 예약하신 분들 외에 추가 인원이나 외부 방문객이 들어오시는 것은 엄격히 금지됩니다. (안전과 인원 확인을 위해 건물 입구 및 외부에 CCTV가 가동 중입니다. 허가되지 않은 인원 적발 시 인당 5만 원의 추가 요금이 부과됩니다.)

5. 소음 주의: 아랫집에 태어난지 얼마되지않은 사랑스러운 천사가 살고있습니다. 늦은 밤인 오후 10시 이후에는 고성방가를 자제해 주시고 서로 조금씩만 조용히 배려해 주세요.

6. 반려동물 동반 불가: 안타깝게도 안내견을 제외한 모든 반려동물은 동반이 어렵습니다.

7. 물품 소중히 다루기: 가구나 숙소 비품을 소중히 사용해 주세요. 심한 오염(침구·소파의 혈흔이나 염색약 등)이나 파손, 분실이 생길 경우 실제 구매 비용 기준으로 청구될 수 있습니다. 퇴실하실 때는 가벼운 쓰레기 정리와 설거지를 부탁드립니다.

8. 현장 사진 안내: 저희 집은 정기적으로 계절에 어울리는 소품(액자 등)과 가구 배치로 인테리어를 조금씩 새로이 단장하고 있습니다. 때문에 시기에 따라 사진과 실제 느낌이 살짝 다를 수 있습니다. 편의시설이나 제공 물품은 변함없이 알차게 준비되어 있으니 편안한 마음으로 찾아주세요. 🙏🏼


**지자체에서 허가받은 합법숙소입니다**
**본 숙소는 미스터멘션 특례를 적용받아 내국인 공유 숙박 합법 업체로 등록되어 운영되고 있습니다**

등록 세부 정보
발급 지역: 부산광역시, 중구
허가 유형: 외국인관광도시민박업
허가번호: 2026000009`;

export default function ItemDetail({
  item,
  backHref,
  backLabel,
  categoryLabel,
  perPerson,
  subtitle,
}: ItemDetailProps) {
  const { isWishlisted, toggle } = useWishlist(item.id);
  const pageTitle = subtitle ?? `${item.location} · ${categoryLabel}`;
  const [showDescModal, setShowDescModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [sleepPage, setSleepPage] = useState(0);
  const sleepPageCount = Math.ceil(SLEEP_PHOTOS.length / 2);
  const visibleSleepPhotos = SLEEP_PHOTOS.slice(
    sleepPage * 2,
    sleepPage * 2 + 2,
  );
  const cityLabel = item.location.split("·")[0].trim();
  const mapQuery = item.location.replace(/·/g, " ").replace(/\s+/g, " ").trim();

  return (
    <div className={styles.wrapper}>
      <Link href={backHref} className={styles.back}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          aria-hidden="true"
          focusable="false"
          style={{
            display: "block",
            fill: "none",
            height: "12px",
            width: "12px",
            stroke: "currentcolor",
            strokeWidth: 4,
            overflow: "visible",
            transform: "scaleX(-1)",
          }}
        >
          <path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" />
        </svg>
        {backLabel}
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <div className={styles.headerActions}>
          <button type="button" className={styles.actionBtn}>
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{
                display: "block",
                fill: "none",
                height: "16px",
                width: "16px",
                stroke: "currentcolor",
                strokeWidth: 3,
                overflow: "visible",
              }}
            >
              <path d="M16 2v20M16 2l6 6M16 2l-6 6M6 20v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
            </svg>
            공유하기
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={toggle}
            aria-label={isWishlisted ? "찜 목록에서 삭제" : "찜하기"}
          >
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{
                display: "block",
                fill: isWishlisted ? "#FF385C" : "none",
                height: "16px",
                width: "16px",
                stroke: isWishlisted ? "#FF385C" : "currentcolor",
                strokeWidth: 2,
                overflow: "visible",
              }}
            >
              <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
            </svg>
            저장
          </button>
        </div>
      </div>

      <div className={styles.gallery}>
        <div className={styles.galleryMain}>
          <Image
            src={item.image}
            alt={item.location}
            fill
            sizes="(max-width: 743px) 100vw, 450px"
            className={styles.image}
            priority
          />
        </div>
        <div className={styles.gallerySide}>
          {[0, 1, 2, 3].map((i) => (
            <div className={styles.gallerySideItem} key={i}>
              <Image
                src={item.image}
                alt={item.location}
                fill
                sizes="(max-width: 743px) 50vw, 225px"
                className={styles.image}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.lowerRow}>
        <div className={styles.lowerMain}>
          {categoryLabel === "숙소" && (
            <>
              <h2 className={styles.introTitle}>
                {HOST_NAME} 님이 호스팅하는 숙소 전체
              </h2>
              <p className={styles.introMeta}>
                최대 인원 9명 · 침실 3개 · 침대 4개 · 욕실 2개
              </p>

              <div className={styles.favoriteCard}>
                <div className={styles.favoriteInfo}>
                  <div className={styles.favoriteTitleRow}>
                    <div>
                      <svg
                        viewBox="0 0 20 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        height="36"
                      >
                        <g clip-path="url(#clip0_5880_37773)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M15.4895 25.417L14.8276 24.4547L16.5303 23.6492L17.1923 24.6116L16.3409 25.0143L17.1923 24.6116C18.6638 26.751 17.9509 29.3868 15.5999 30.4989C14.8548 30.8513 14.0005 31.0196 13.1221 30.987L12.8044 30.9752L12.7297 29.2305L13.0474 29.2423C13.5744 29.2618 14.0871 29.1608 14.5341 28.9494C15.9447 28.2821 16.3725 26.7007 15.4895 25.417Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.32441 10.235C10.0819 8.96204 10.9247 7.4878 10.853 5.81232C10.7813 4.13685 9.80929 2.59524 7.93708 1.18749C6.17964 2.46049 5.33678 3.93473 5.40851 5.6102C5.48024 7.28568 6.45221 8.82729 8.32441 10.235Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.19425 0.489275C7.55718 0.226387 8.10753 0.246818 8.49416 0.537533C10.5385 2.07473 11.7071 3.84975 11.7923 5.84026C11.8775 7.83076 10.8574 9.52453 8.93841 10.9146C8.57548 11.1775 8.02513 11.157 7.6385 10.8663C5.59415 9.32914 4.4256 7.55411 4.34039 5.56361C4.25517 3.57311 5.27521 1.87933 7.19425 0.489275ZM7.92362 2.3684C6.77985 3.38355 6.29788 4.47199 6.3478 5.63813C6.39772 6.80428 6.97457 7.93203 8.20904 9.03547C9.35281 8.02032 9.83478 6.93187 9.78486 5.76573C9.73493 4.59959 9.15809 3.47184 7.92362 2.3684Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M15.6806 24.0529C14.1314 22.353 12.4326 21.4688 10.5842 21.4001C8.73575 21.3315 7.10737 22.0923 5.69905 23.6824C7.24822 25.3823 8.94702 26.2666 10.7955 26.3352C12.6439 26.4038 14.2723 25.6431 15.6806 24.0529Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.90529 24.1787C4.60807 23.8526 4.58911 23.4097 4.8593 23.1046C6.38985 21.3765 8.27538 20.4331 10.521 20.5164C12.7666 20.5998 14.7391 21.6864 16.4227 23.5339C16.7199 23.86 16.7389 24.303 16.4687 24.608C14.9381 26.3361 13.0526 27.2795 10.807 27.1962C8.56134 27.1128 6.5889 26.0262 4.90529 24.1787ZM6.98781 23.7198C8.22307 24.8808 9.46778 25.4045 10.7323 25.4515C11.9968 25.4984 13.2005 25.0656 14.3402 23.9928C13.1049 22.8318 11.8602 22.3081 10.5957 22.2611C9.3312 22.2142 8.12744 22.6471 6.98781 23.7198Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.6766 20.7043C10.2137 18.5957 9.16392 17.0928 7.52727 16.1956C5.89062 15.2984 3.99442 15.1864 1.83867 15.8596C2.30157 17.9683 3.35135 19.4712 4.988 20.3684C6.62465 21.2656 8.52085 21.3775 10.6766 20.7043Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0.791956 15.9443C0.703053 15.5393 0.94431 15.1569 1.37329 15.023C3.7337 14.2859 5.9714 14.3695 7.95247 15.4554C9.92449 16.5364 11.1013 18.3139 11.6022 20.5956C11.6911 21.0006 11.4499 21.3829 11.0209 21.5169C8.66048 22.254 6.42277 22.1704 4.4417 21.0844C2.46969 20.0034 1.29285 18.226 0.791956 15.9443ZM2.95349 16.4656C3.43375 17.9951 4.27991 19.007 5.41321 19.6282C6.5306 20.2407 7.84423 20.4286 9.44069 20.0743C8.96043 18.5448 8.11427 17.5329 6.98097 16.9116C5.86358 16.2991 4.54995 16.1113 2.95349 16.4656Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.90911 15.6267C8.65652 13.6743 8.53705 11.9555 7.55072 10.4702C6.56438 8.98484 4.90844 8.03014 2.58291 7.60605C1.8355 9.55846 1.95497 11.2773 2.9413 12.7626C3.92764 14.2479 5.58357 15.2026 7.90911 15.6267Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.66037 7.28295C1.80927 6.89397 2.26578 6.67525 2.74598 6.76282C5.29848 7.22831 7.26368 8.31371 8.44396 10.0911C9.61955 11.8614 9.70866 13.854 8.89805 15.9715C8.74915 16.3605 8.29264 16.5792 7.81244 16.4916C5.25994 16.0261 3.29474 14.9407 2.11446 13.1634C0.938866 11.393 0.849755 9.40048 1.66037 7.28295ZM3.3385 8.6613C2.94038 10.1267 3.14588 11.3465 3.83454 12.3835C4.51397 13.4067 5.60091 14.1584 7.21992 14.5931C7.61804 13.1278 7.41254 11.9079 6.72388 10.8709C6.04445 9.84774 4.95751 9.09607 3.3385 8.6613Z"
                            fill="#222222"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_5880_37773">
                            <rect
                              width="18.8235"
                              height="32"
                              fill="white"
                              transform="translate(0.453125 0.000488281)"
                            ></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className={styles.favoriteTitle}>
                      게스트
                      <br /> 선호
                    </span>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 32"
                        fill="none"
                        height="36"
                      >
                        <g clip-path="url(#clip0_5880_37786)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.06516 25.417L4.72713 24.4547L3.02437 23.6492L2.3624 24.6116L3.21378 25.0143L2.3624 24.6116C0.890857 26.751 1.60381 29.3868 3.95483 30.4989C4.69986 30.8513 5.55423 31.0196 6.43257 30.987L6.75025 30.9752L6.82494 29.2305L6.50726 29.2423C5.98026 29.2618 5.46764 29.1608 5.02062 28.9494C3.61001 28.2821 3.18223 26.7007 4.06516 25.417Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.2303 10.235C9.47283 8.96204 8.62998 7.4878 8.70171 5.81232C8.77344 4.13685 9.7454 2.59524 11.6176 1.18749C13.375 2.46049 14.2179 3.93473 14.1462 5.6102C14.0744 7.28568 13.1025 8.82729 11.2303 10.235Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12.3604 0.489275C11.9975 0.226387 11.4472 0.246818 11.0605 0.537533C9.01618 2.07473 7.84763 3.84975 7.76242 5.84026C7.6772 7.83076 8.69724 9.52453 10.6163 10.9146C10.9792 11.1775 11.5296 11.157 11.9162 10.8663C13.9605 9.32914 15.1291 7.55411 15.2143 5.56361C15.2995 3.57311 14.2795 1.87933 12.3604 0.489275ZM11.6311 2.3684C12.7748 3.38355 13.2568 4.47199 13.2069 5.63813C13.157 6.80428 12.5801 7.93203 11.3456 9.03547C10.2019 8.02032 9.71991 6.93187 9.76983 5.76573C9.81975 4.59959 10.3966 3.47184 11.6311 2.3684Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.87411 24.0529C5.42328 22.353 7.12208 21.4688 8.97051 21.4001C10.8189 21.3315 12.4473 22.0923 13.8556 23.6824C12.3065 25.3823 10.6077 26.2666 8.75924 26.3352C6.9108 26.4038 5.28243 25.6431 3.87411 24.0529Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M14.6494 24.1787C14.9466 23.8526 14.9656 23.4097 14.6954 23.1046C13.1648 21.3765 11.2793 20.4331 9.03368 20.5164C6.78805 20.5998 4.81561 21.6864 3.13199 23.5339C2.83478 23.86 2.81582 24.303 3.08601 24.608C4.61655 26.3361 6.50208 27.2795 8.74771 27.1962C10.9933 27.1128 12.9658 26.0262 14.6494 24.1787ZM12.5669 23.7198C11.3316 24.8808 10.0869 25.4045 8.82241 25.4515C7.55791 25.4984 6.35415 25.0656 5.21452 23.9928C6.44977 22.8318 7.69449 22.3081 8.95899 22.2611C10.2235 22.2142 11.4272 22.6471 12.5669 23.7198Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.87809 20.7043C9.34099 18.5957 10.3908 17.0928 12.0274 16.1956C13.6641 15.2984 15.5603 15.1864 17.716 15.8596C17.2531 17.9683 16.2033 19.4712 14.5667 20.3684C12.93 21.2656 11.0338 21.3775 8.87809 20.7043Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M18.7627 15.9443C18.8516 15.5393 18.6104 15.1569 18.1814 15.023C15.821 14.2859 13.5833 14.3695 11.6022 15.4554C9.6302 16.5364 8.45336 18.3139 7.95247 20.5956C7.86356 21.0006 8.10482 21.3829 8.5338 21.5169C10.8942 22.254 13.1319 22.1704 15.113 21.0844C17.085 20.0034 18.2618 18.226 18.7627 15.9443ZM16.6012 16.4656C16.1209 17.9951 15.2748 19.007 14.1415 19.6282C13.0241 20.2407 11.7105 20.4286 10.114 20.0743C10.5943 18.5448 11.4404 17.5329 12.5737 16.9116C13.6911 16.2991 15.0047 16.1113 16.6012 16.4656Z"
                            fill="#222222"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.6456 15.6267C10.8982 13.6743 11.0176 11.9555 12.004 10.4702C12.9903 8.98484 14.6462 8.03014 16.9718 7.60605C17.7192 9.55846 17.5997 11.2773 16.6134 12.7626C15.6271 14.2479 13.9711 15.2026 11.6456 15.6267Z"
                            fill="#F7F7F7"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M17.8943 7.28295C17.7454 6.89397 17.2889 6.67525 16.8087 6.76282C14.2562 7.22831 12.291 8.31371 11.1107 10.0911C9.93513 11.8614 9.84602 13.854 10.6566 15.9715C10.8055 16.3605 11.262 16.5792 11.7422 16.4916C14.2947 16.0261 16.26 14.9407 17.4402 13.1634C18.6158 11.393 18.7049 9.40048 17.8943 7.28295ZM16.2162 8.6613C16.6143 10.1267 16.4088 11.3465 15.7201 12.3835C15.0407 13.4067 13.9538 14.1584 12.3348 14.5931C11.9366 13.1278 12.1421 11.9079 12.8308 10.8709C13.5102 9.84774 14.5972 9.09607 16.2162 8.6613Z"
                            fill="#222222"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_5880_37786">
                            <rect
                              width="18.8235"
                              height="32"
                              fill="white"
                              transform="matrix(-1 0 0 1 19.1016 0.000488281)"
                            ></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <p className={styles.favoriteDesc}>
                    에어비앤비 게스트에게 가장 사랑받는 숙소
                  </p>
                </div>
                <div className={styles.favoriteStats}>
                  <div className={styles.favoriteStat}>
                    <span className={styles.favoriteNum}>5.0</span>
                    <span className={styles.favoriteStars}>★★★★★</span>
                  </div>
                  <div className={styles.favoriteDividerV} />
                  <div className={styles.favoriteStat}>
                    <span className={styles.favoriteNum}>{REVIEW_COUNT}개</span>
                    <span className={styles.favoriteSub}>후기</span>
                  </div>
                </div>
              </div>

              <ul className={styles.highlights}>
                {HIGHLIGHTS.map((h) => (
                  <li key={h.text}>
                    <span className={styles.highlightIcon}>{h.icon}</span>
                    {h.text}
                  </li>
                ))}
              </ul>

              <hr className={styles.divider} />

              <div className={styles.hostRow}>
                <p className={styles.hostName}>호스트 : {HOST_NAME} 님</p>
                <p className={styles.hostSub}>신규 호스트</p>
              </div>

              <hr className={styles.divider} />

              <p className={styles.descriptionText}>{DESCRIPTION_TEXT}</p>
              <button
                type="button"
                className={styles.moreBtn}
                onClick={() => setShowDescModal(true)}
              >
                더 보기
              </button>

              <hr className={styles.divider} />

              <div className={styles.sleepSection}>
                <h3 className={styles.sleepTitle}>숙박 장소</h3>
                <div className={styles.sleepGrid}>
                  {visibleSleepPhotos.map((photo) => (
                    <div className={styles.sleepItem} key={photo.label}>
                      <Image
                        src={photo.image}
                        alt={photo.label}
                        fill
                        sizes="280px"
                        className={styles.image}
                      />
                      <span className={styles.sleepLabel}>{photo.label}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.sleepControls}>
                  <span className={styles.sleepPageLabel}>
                    {sleepPage + 1}/{sleepPageCount}
                  </span>
                  <button
                    type="button"
                    className={styles.sleepArrowBtn}
                    onClick={() => setSleepPage((p) => Math.max(0, p - 1))}
                    disabled={sleepPage === 0}
                    aria-label="이전 사진"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      focusable="false"
                      style={{
                        display: "block",
                        fill: "none",
                        height: "12px",
                        width: "12px",
                        stroke: "currentcolor",
                        strokeWidth: 4,
                        overflow: "visible",
                        transform: "scaleX(-1)",
                      }}
                    >
                      <path
                        fill="none"
                        d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={styles.sleepArrowBtn}
                    onClick={() =>
                      setSleepPage((p) => Math.min(sleepPageCount - 1, p + 1))
                    }
                    disabled={sleepPage >= sleepPageCount - 1}
                    aria-label="다음 사진"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      focusable="false"
                      style={{
                        display: "block",
                        fill: "none",
                        height: "12px",
                        width: "12px",
                        stroke: "currentcolor",
                        strokeWidth: 4,
                        overflow: "visible",
                      }}
                    >
                      <path
                        fill="none"
                        d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.lowerSide}>
          {categoryLabel === "숙소" && (
            <BookingCard price={item.price} dateRangeLabel={item.date} />
          )}
        </div>
      </div>

      {categoryLabel === "숙소" && (
        <div className={styles.locationSection}>
          <h2 className={styles.locationTitle}>위치</h2>
          <p className={styles.locationSubtitle}>{cityLabel}, 한국</p>
          <div className={styles.mapWrap}>
            <iframe
              className={styles.mapFrame}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="지도"
            />
          </div>
        </div>
      )}

      {categoryLabel === "숙소" && (
        <div className={styles.amenitiesSection}>
          <h2 className={styles.amenitiesTitle}>숙소 편의시설</h2>
          <ul className={styles.amenitiesGrid}>
            {AMENITIES_PREVIEW.map((a) => (
              <li key={a.label} className={styles.amenityItem}>
                <span className={styles.amenityIcon}>{a.icon}</span>
                {a.label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={styles.moreBtn}
            onClick={() => setShowAmenitiesModal(true)}
          >
            편의시설 30개 모두 보기
          </button>
        </div>
      )}

      {categoryLabel === "숙소" && (
        <div className={styles.knowSection}>
          <h2 className={styles.knowTitle}>알아두어야 할 사항</h2>
          <ul className={styles.knowList}>
            <li className={styles.knowItem}>
              <span className={styles.knowIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </span>
              <strong className={styles.knowSubtitle}>환불 정책</strong>
              <p className={styles.knowDesc}>10월 18일 전까지 무료 취소가 가능합니다. 10월 23일 체크인 전에 취소하면 부분 환불을 받으실 수 있습니다. 자세한 내용은 호스트의 환불 정책 전문을 참고하세요.</p>
            </li>
            <li className={styles.knowItem}>
              <span className={styles.knowIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              <strong className={styles.knowSubtitle}>숙소 이용규칙</strong>
              <p className={styles.knowDesc}>체크인 가능 시간 : 오후 4:00 이후<br/>체크아웃 시간: 오전 11:00 전까지<br/>게스트 정원 8명</p>
            </li>
            <li className={styles.knowItem}>
              <span className={styles.knowIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>
              </span>
              <strong className={styles.knowSubtitle}>안전 및 공간</strong>
              <p className={styles.knowDesc}>일산화탄소 경보기<br/>화재경보기<br/>소음이 발생할 수 있음</p>
            </li>
          </ul>
        </div>
      )}

      {showAmenitiesModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAmenitiesModal(false)}
        >
          <div
            className={styles.modalPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowAmenitiesModal(false)}
                aria-label="닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "14px", width: "14px", stroke: "currentcolor", strokeWidth: 3.5, overflow: "visible" }}>
                  <path d="m6 6 20 20M26 6 6 26" />
                </svg>
              </button>
              <span className={styles.modalTitle}>숙소 편의시설</span>
            </div>
            <div className={styles.modalBody}>
              {AMENITIES_SECTIONS.map((section, si) => (
                <div key={section.title}>
                  {si > 0 && <hr className={styles.divider} />}
                  <h3 className={styles.amenitiesModalSubtitle}>{section.title}</h3>
                  <ul className={styles.amenitiesModalList}>
                    {section.items.map((item) => (
                      <li key={item.label} className={`${styles.amenitiesModalItem} ${item.unavailable ? styles.amenitiesModalItemUnavailable : ""}`}>
                        <span className={styles.amenityIcon}>{item.icon}</span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDescModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDescModal(false)}
        >
          <div
            className={styles.modalPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowDescModal(false)}
                aria-label="닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  focusable="false"
                  style={{
                    display: "block",
                    fill: "none",
                    height: "14px",
                    width: "14px",
                    stroke: "currentcolor",
                    strokeWidth: 3.5,
                    overflow: "visible",
                  }}
                >
                  <path d="m6 6 20 20M26 6 6 26" />
                </svg>
              </button>
              <span className={styles.modalTitle}>숙소 설명</span>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>{DESCRIPTION_TEXT}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
