"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./ItemDetail.module.css";
import { useWishlist } from "@/hooks/useWishlist";
import { ROOM_OVERRIDES } from "./roomContent";
import BookingCard from "./BookingCard";
import DetailGallery from "./DetailGallery";
import IntroSection from "./IntroSection";
import DescriptionSection from "./DescriptionSection";
import SleepGallery from "./SleepGallery";
import AmenitiesSection from "./AmenitiesSection";
import KnowSection from "./KnowSection";
import LocationSection from "./LocationSection";
import { EXPERIENCE_DESCRIPTION, SERVICE_DESCRIPTION } from "./content";
import { ChevronIcon, ShareIcon, HeartIcon } from "./icons";
import type { ListingItem } from "@/data/types";

interface ItemDetailProps {
  item: ListingItem;
  backHref: string;
  backLabel: string;
  categoryLabel: string;
  perPerson?: boolean;
  subtitle?: string;
}

// 체험/서비스는 location이 도시명이 아니라 상품명이라, 제목에서 도시를 추정한다
function guessCity(title: string): string {
  if (title.includes("부산")) return "부산";
  if (title.includes("제주")) return "제주";
  if (title.includes("서울")) return "서울";
  return "서울";
}

export default function ItemDetail({ item, backHref, backLabel, categoryLabel, perPerson, subtitle }: ItemDetailProps) {
  const { isWishlisted, toggle } = useWishlist(item.id);
  const pageTitle = subtitle ?? `${item.location} · ${categoryLabel}`;
  const isRoom = categoryLabel === "숙소";
  // 체험은 전부 가평권 상품, 서비스는 상품명에서 도시 추정
  const cityLabel = isRoom ? undefined : categoryLabel === "체험" ? "가평" : guessCity(item.location);
  // 숙소별 차별화 콘텐츠 (등록된 숙소만, 나머지는 기본 콘텐츠)
  const override = isRoom ? ROOM_OVERRIDES[item.id] : undefined;

  // 공유하기: 현재 페이지 링크를 클립보드에 복사
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근 불가 환경(비보안 컨텍스트 등)에서는 조용히 무시
    }
  }

  return (
    <div className={styles.wrapper}>
      <Link href={backHref} className={styles.back}>
        <ChevronIcon flip />
        {backLabel}
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <div className={styles.headerActions}>
          <button type="button" className={styles.actionBtn} onClick={handleShare}>
            <ShareIcon />
            {copied ? "링크 복사됨!" : "공유하기"}
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={toggle}
            aria-label={isWishlisted ? "찜 목록에서 삭제" : "찜하기"}
          >
            <HeartIcon filled={isWishlisted} />
            저장
          </button>
        </div>
      </div>

      <DetailGallery image={item.image} alt={item.location} />

      <div className={styles.lowerRow}>
        <div className={styles.lowerMain}>
          {isRoom ? (
            <>
              <IntroSection
                hostName={override?.hostName}
                hostSub={override?.hostSub}
                introMeta={override?.introMeta}
              />
              <hr className={styles.divider} />
              <DescriptionSection text={override?.description} />
              <hr className={styles.divider} />
              <SleepGallery />
            </>
          ) : (
            <>
              <IntroSection categoryLabel={categoryLabel} />
              <hr className={styles.divider} />
              <DescriptionSection
                text={categoryLabel === "체험" ? EXPERIENCE_DESCRIPTION : SERVICE_DESCRIPTION}
                modalTitle={`${categoryLabel} 설명`}
              />
            </>
          )}
        </div>
        <div className={styles.lowerSide}>
          <BookingCard
            price={item.price}
            dateRangeLabel={isRoom ? item.date : undefined}
            perPerson={perPerson}
          />
        </div>
      </div>

      <LocationSection
        location={item.location}
        cityLabel={cityLabel}
        mapQuery={cityLabel}
      />

      {isRoom && (
        <>
          <AmenitiesSection />
          <KnowSection />
        </>
      )}
    </div>
  );
}
