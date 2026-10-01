"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./PhotoTour.module.css";
import { useModalBehavior } from "@/hooks/useModalBehavior";

interface PhotoTourProps {
  images: string[];
  alt: string;
  onClose: () => void;
}

// "사진 모두 보기" — 실제 에어비앤비처럼 전체 화면에서 사진을 세로로 훑어본다.
// 배치: 한 장 크게 → 두 장 나란히 → 한 장 크게 … (3장 단위 반복)
// Escape 닫기 / 배경 스크롤 잠금 / 포커스 트랩은 다른 모달과 같은 useModalBehavior.
export default function PhotoTour({ images, alt, onClose }: PhotoTourProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalBehavior(panelRef, onClose);

  return (
    <div className={styles.overlay} ref={panelRef} role="dialog" aria-modal="true" aria-label="사진 모두 보기">
      <div className={styles.top}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="사진 닫기">
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4" />
          </svg>
        </button>
        <span className={styles.count}>사진 {images.length}장</span>
      </div>
      <div className={styles.grid}>
        {images.map((src, i) => (
          <div key={src} className={`${styles.photo} ${i % 3 === 0 ? styles.photoWide : ""}`}>
            <Image
              src={src}
              alt={`${alt} 사진 ${i + 1}`}
              fill
              sizes={i % 3 === 0 ? "(max-width: 743px) 100vw, 744px" : "(max-width: 743px) 50vw, 372px"}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
