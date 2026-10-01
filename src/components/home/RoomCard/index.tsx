"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./RoomCard.module.css";
import { useWishlist } from "@/hooks/useWishlist";
import { formatAvailabilityLabel } from "@/lib/dates";

interface RoomCardProps {
  id: string;
  image: string;
  location: string;
  startOffset?: number;
  nights?: number;
  price: number;
  rating: number;
  tag?: string;
  href: string;
  priority?: boolean;
  perPerson?: boolean;
}

export default function RoomCard({
  id,
  image,
  location,
  startOffset,
  nights,
  price,
  rating,
  tag,
  href,
  priority,
  perPerson,
}: RoomCardProps) {
  const { isWishlisted, toggle } = useWishlist(id);
  const [loaded, setLoaded] = useState(false);
  // 오늘(KST) 기준으로 계산 — 서버 렌더링과 hydration이 같은 날짜를 쓴다 (lib/dates.ts getToday)
  const date = formatAvailabilityLabel({ startOffset, nights });

  return (
    <Link href={href} className={styles.card}>
      <div className={`${styles.tag} ${loaded ? styles.tagVisible : ""}`}>
        {tag && <span className={styles.tag_name}>{tag}</span>}
        <button
          className={styles.remark}
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
      <div className={styles.imageWrap}>
        <div className={`${styles.skeleton} ${loaded ? styles.skeletonHidden : ""}`} />
        <Image
          src={image}
          alt={location}
          fill
          sizes="(max-width: 768px) 50vw, 220px"
          className={`${styles.image} ${loaded ? styles.imageLoaded : ""}`}
          onLoad={() => setLoaded(true)}
          loading={priority ? "eager" : "lazy"}
          preload={priority}
        />
      </div>
      <div className={`${styles.info} ${perPerson ? styles.infoTwoLines : ""}`}>
        <div className={`${styles.infoSkeleton} ${loaded ? styles.infoSkeletonHidden : ""}`}>
          <div className={`${styles.skeletonBar} ${styles.skeletonBarLong}`} />
          {!perPerson && <div className={`${styles.skeletonBar} ${styles.skeletonBarMedium}`} />}
          <div className={`${styles.skeletonBar} ${styles.skeletonBarShort}`} />
        </div>
        <div className={`${styles.infoContent} ${loaded ? styles.infoContentVisible : ""}`}>
          <div className={styles.location}>{location}</div>
          {!perPerson && date && <div className={styles.date}>{date}</div>}
          <div className={styles.bottom}>
            <span className={styles.price}>
              {perPerson ? `1인당 ₩${price.toLocaleString()} 부터` : `총액 ₩${price.toLocaleString()}`}
            </span>
            <span className={styles.rating}>
              {" "}
              · <span className={styles.star}>★</span>
              {rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
