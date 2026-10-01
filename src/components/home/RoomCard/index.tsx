"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./RoomCard.module.css";
import { useWishlist } from "@/hooks/useWishlist";
import { formatAvailabilityLabel } from "@/lib/dates";

interface RoomCardProps {
  id: string;
  image: string;
  // 목록 카드의 사진 넘기기용 사진들 [대표, ...] — 없으면 대표 사진 한 장 (홈 카드)
  images?: string[];
  location: string;
  startOffset?: number;
  nights?: number;
  price: number;
  rating: number;
  tag?: string;
  href: string;
  priority?: boolean;
  perPerson?: boolean;
  // "home": 홈 캐러셀 카드(정사각형에 가까운 사진, 사진 1장)
  // "list": 검색 결과 카드(4:3 사진 + 점·화살표로 넘기기, 평점은 첫 줄 오른쪽 — 실제 에어비앤비 목록 카드)
  variant?: "home" | "list";
}

export default function RoomCard({
  id,
  image,
  images,
  location,
  startOffset,
  nights,
  price,
  rating,
  tag,
  href,
  priority,
  perPerson,
  variant = "home",
}: RoomCardProps) {
  const { isWishlisted, toggle } = useWishlist(id);
  const [loaded, setLoaded] = useState(false);
  // 오늘(KST) 기준으로 계산 — 서버 렌더링과 hydration이 같은 날짜를 쓴다 (lib/dates.ts getToday)
  const date = formatAvailabilityLabel({ startOffset, nights });
  const isList = variant === "list";
  const photos = isList && images && images.length > 0 ? images : [image];
  const [slide, setSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const priceText = perPerson ? `1인당 ₩${price.toLocaleString()} 부터` : `총액 ₩${price.toLocaleString()}`;

  // 화살표: 트랙을 한 장 너비만큼 스크롤 (모바일은 손가락 스와이프 — 같은 스크롤 스냅 트랙)
  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  return (
    // 찜 버튼·사진 화살표는 Link(<a>) 바깥 형제로 두고 position으로 이미지 위에 겹친다 —
    // <a> 안에 <button>을 넣는 건 interactive content 중첩이라 HTML 스펙 위반.
    <div className={`${styles.cardWrap} ${isList ? styles.cardList : ""}`}>
      <Link href={href} className={styles.card}>
        <div className={`${styles.tag} ${loaded ? styles.tagVisible : ""}`}>
          {tag && <span className={styles.tag_name}>{tag}</span>}
        </div>
        <div className={styles.imageWrap}>
          <div className={`${styles.skeleton} ${loaded ? styles.skeletonHidden : ""}`} />
          <div
            className={styles.track}
            ref={trackRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              setSlide(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {photos.map((src, i) => (
              <div className={styles.slide} key={src}>
                <Image
                  src={src}
                  alt={i === 0 ? location : `${location} 사진 ${i + 1}`}
                  fill
                  sizes={isList ? "(max-width: 743px) 100vw, 320px" : "(max-width: 768px) 50vw, 220px"}
                  className={`${styles.image} ${loaded ? styles.imageLoaded : ""}`}
                  onLoad={i === 0 ? () => setLoaded(true) : undefined}
                  preload={priority && i === 0}
                />
              </div>
            ))}
          </div>
          {photos.length > 1 && (
            <span className={styles.dots} aria-hidden="true">
              {photos.map((src, i) => (
                <span key={src} className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`} />
              ))}
            </span>
          )}
        </div>
        <div className={`${styles.info} ${perPerson ? styles.infoTwoLines : ""}`}>
          <div className={`${styles.infoSkeleton} ${loaded ? styles.infoSkeletonHidden : ""}`}>
            <div className={`${styles.skeletonBar} ${styles.skeletonBarLong}`} />
            {!perPerson && <div className={`${styles.skeletonBar} ${styles.skeletonBarMedium}`} />}
            <div className={`${styles.skeletonBar} ${styles.skeletonBarShort}`} />
          </div>
          <div className={`${styles.infoContent} ${loaded ? styles.infoContentVisible : ""}`}>
            {isList ? (
              <>
                <div className={styles.titleRow}>
                  <span className={styles.location}>{location}</span>
                  <span className={styles.ratingRight}>★ {rating}</span>
                </div>
                {!perPerson && date && <div className={styles.date}>{date}</div>}
                <div className={styles.priceList}>{priceText}</div>
              </>
            ) : (
              <>
                <div className={styles.location}>{location}</div>
                {!perPerson && date && <div className={styles.date}>{date}</div>}
                <div className={styles.bottom}>
                  <span className={styles.price}>{priceText}</span>
                  <span className={styles.rating}>
                    {" "}
                    · <span className={styles.star}>★</span>
                    {rating}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
      {photos.length > 1 && (
        // 사진 영역과 같은 크기의 겹침 레이어 — 화살표를 사진 세로 가운데에 둔다
        <div className={styles.navLayer}>
          {slide > 0 && (
            <button type="button" className={`${styles.navBtn} ${styles.navPrev}`} onClick={() => goTo(slide - 1)} aria-label={`이전 사진: ${location}`}>
              <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                <path d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4" />
              </svg>
            </button>
          )}
          {slide < photos.length - 1 && (
            <button type="button" className={`${styles.navBtn} ${styles.navNext}`} onClick={() => goTo(slide + 1)} aria-label={`다음 사진: ${location}`}>
              <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                <path d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" />
              </svg>
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        className={`${styles.remark} ${loaded ? styles.tagVisible : ""}`}
        onClick={toggle}
        aria-label={isWishlisted ? "찜 목록에서 삭제" : "찜하기"}
      >
        <span>
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            style={{
              display: "block",
              fill: isWishlisted ? "#FF385C" : "rgba(0, 0, 0, 0.5)",
              height: "24px",
              width: "24px",
              stroke: "#fff",
              strokeWidth: 2,
              overflow: "visible",
            }}
          >
            <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
          </svg>
        </span>
      </button>
    </div>
  );
}
