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
import DetailSectionNav from "./DetailSectionNav";
import { EXPERIENCE_DESCRIPTION, SERVICE_DESCRIPTION } from "./content";
import { ChevronIcon, ShareIcon, HeartIcon } from "./icons";
import type { ListingItem } from "@/data/types";
import { guessCity } from "@/lib/listingMeta";
import { roomIntroMeta } from "@/lib/roomSpecs";

interface ItemDetailProps {
  item: ListingItem;
  backHref: string;
  backLabel: string;
  categoryLabel: string;
  perPerson?: boolean;
  subtitle?: string;
  // 목록에서 이어받은 검색 컨텍스트("YYYY-MM-DD", 게스트 수) — 예약카드 초기값
  searchCheckin?: string;
  searchCheckout?: string;
  searchGuests?: number;
  // 갤러리 5칸 사진 [대표, ...] — 데이터 풀은 서버(page.tsx)에서 골라 넘긴다 (클라이언트에서 @/data import 금지)
  galleryImages?: string[];
}

export default function ItemDetail({
  item,
  backHref,
  backLabel,
  categoryLabel,
  perPerson,
  subtitle,
  searchCheckin,
  searchCheckout,
  searchGuests,
  galleryImages,
}: ItemDetailProps) {
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

      <DetailGallery
        images={galleryImages ?? [item.image]}
        alt={item.location}
        mobileOverlay={
          <div className={styles.mobileActions}>
            <Link href={backHref} className={styles.mobileActionBtn} aria-label={backLabel}>
              <ChevronIcon flip />
            </Link>
            <div className={styles.mobileActionsRight}>
              <button type="button" className={styles.mobileActionBtn} onClick={handleShare} aria-label={copied ? "링크 복사됨" : "공유하기"}>
                <ShareIcon />
              </button>
              <button
                type="button"
                className={styles.mobileActionBtn}
                onClick={toggle}
                aria-label={isWishlisted ? "찜 목록에서 삭제" : "찜하기"}
              >
                <HeartIcon filled={isWishlisted} />
              </button>
            </div>
            {copied && <span className={styles.mobileToast} role="status">링크 복사됨!</span>}
          </div>
        }
      />

      <div className={styles.lowerRow}>
        <div className={styles.lowerMain}>
          {isRoom ? (
            <>
              <IntroSection
                hostName={override?.hostName}
                hostSub={override?.hostSub}
                // 규모 문구는 최대 인원(maxGuests)에서 만든다 — 예약카드 상한·서버 검증과 같은 숫자
                introMeta={override?.introMeta ?? (item.maxGuests ? roomIntroMeta(item.maxGuests) : undefined)}
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
            itemId={item.id}
            price={item.price}
            availability={isRoom ? item : undefined}
            perPerson={perPerson}
            initialCheckin={searchCheckin}
            initialCheckout={searchCheckout}
            initialGuests={searchGuests}
            maxGuests={item.maxGuests}
            rating={item.rating}
          />
        </div>
      </div>

      <div id="location" className={styles.anchor}>
        <LocationSection
          location={item.location}
          cityLabel={cityLabel}
          mapQuery={cityLabel}
        />
      </div>

      {isRoom && (
        <>
          <div id="amenities" className={styles.anchor}>
            <AmenitiesSection />
          </div>
          <div id="rules" className={styles.anchor}>
            <KnowSection />
          </div>
        </>
      )}

      {/* PC 스크롤 탭 — 사진 영역을 지나면 헤더 자리에 나타난다 (모바일은 숨김) */}
      <DetailSectionNav
        sections={[
          { id: "photos", label: "사진" },
          { id: "location", label: "위치" },
          ...(isRoom
            ? [
                { id: "amenities", label: "편의시설" },
                { id: "rules", label: "이용 규칙" },
              ]
            : []),
        ]}
        priceText={perPerson ? `1인당 ₩${item.price.toLocaleString()}` : `총액 ₩${item.price.toLocaleString()}`}
        rating={item.rating}
      />
    </div>
  );
}
