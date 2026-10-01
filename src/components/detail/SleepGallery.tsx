"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ItemDetail.module.css";
import { SLEEP_PHOTOS } from "./content";
import { ChevronIcon } from "./icons";

// "숙박 장소" 사진 갤러리: 2장씩 페이지 넘김
export default function SleepGallery() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(SLEEP_PHOTOS.length / 2);
  const visiblePhotos = SLEEP_PHOTOS.slice(page * 2, page * 2 + 2);

  return (
    <div className={styles.sleepSection}>
      {/* 실제 사이트처럼 페이지 표시·화살표는 제목 줄 오른쪽, 사진 이름은 사진 아래 */}
      <div className={styles.sleepHeader}>
        <h3 className={styles.sleepTitle}>숙박 장소</h3>
        <div className={styles.sleepControls}>
          <span className={styles.sleepPageLabel}>
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            className={styles.sleepArrowBtn}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="이전 사진"
          >
            <ChevronIcon flip />
          </button>
          <button
            type="button"
            className={styles.sleepArrowBtn}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            aria-label="다음 사진"
          >
            <ChevronIcon />
          </button>
        </div>
      </div>
      <div className={styles.sleepGrid}>
        {visiblePhotos.map((photo) => (
          <figure className={styles.sleepCard} key={photo.label}>
            <div className={styles.sleepItem}>
              <Image src={photo.image} alt={photo.label} fill sizes="280px" className={styles.image} />
            </div>
            <figcaption className={styles.sleepLabel}>{photo.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
