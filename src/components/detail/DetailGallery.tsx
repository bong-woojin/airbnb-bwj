"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import styles from "./ItemDetail.module.css";
import PhotoTour from "./PhotoTour";

interface DetailGalleryProps {
  // [대표 사진, 나머지...] — lib/gallery.ts pickGalleryImages가 고른 서로 다른 사진들
  images: string[];
  alt: string;
  // 모바일 캐러셀 위에 겹칠 버튼들(뒤로가기·공유·찜) — 모바일에선 헤더가 없어서 사진 위에 둔다
  mobileOverlay?: ReactNode;
}

// 상단 이미지 갤러리.
// - 데스크톱: 왼쪽 큰 사진 1장 + 오른쪽 2x2 작은 사진. 사진이 5장보다 적으면 순환해 칸을 채운다.
// - 모바일(743px 이하): 화면 폭 전체를 쓰는 가로 스와이프 캐러셀 + "1 / 5" 표시 (실제 에어비앤비 모바일 웹).
// 두 레이아웃을 형제로 렌더링하고 CSS로 하나만 보인다 — 모바일 캐러셀은 상세 본문(flex column)의 맨 위로 올라간다.
export default function DetailGallery({ images, alt, mobileOverlay }: DetailGalleryProps) {
  const [main, ...rest] = images;
  const side = [0, 1, 2, 3].map((i) => (rest.length > 0 ? rest[i % rest.length] : main));
  const [slide, setSlide] = useState(0);
  // "사진 모두 보기" 전체 화면 — PC는 갤러리 버튼·사진 클릭, 모바일은 사진 탭·"1 / 5" 표시로 연다
  const [tourOpen, setTourOpen] = useState(false);
  const openTour = () => setTourOpen(true);

  return (
    <>
      {/* id="photos": PC 스크롤 탭의 "사진" 바로가기 대상 + 탭 줄 표시 시점(이 영역을 지나면) */}
      <div className={styles.gallery} id="photos">
        <div className={styles.galleryMain} onClick={openTour}>
          <Image src={main} alt={alt} fill sizes="(max-width: 743px) 100vw, 450px" className={styles.image} priority />
        </div>
        <div className={styles.gallerySide}>
          {side.map((src, i) => (
            <div className={styles.gallerySideItem} key={i} onClick={openTour}>
              <Image
                src={src}
                alt={`${alt} 사진 ${i + 2}`}
                fill
                sizes="(max-width: 743px) 50vw, 225px"
                className={styles.image}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        <button type="button" className={styles.showAllPhotos} onClick={openTour}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
          </svg>
          사진 모두 보기
        </button>
      </div>

      <div className={styles.mobileGallery}>
        <div
          className={styles.mobileTrack}
          onClick={openTour}
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((src, i) => (
            <div className={styles.mobileSlide} key={src}>
              <Image src={src} alt={i === 0 ? alt : `${alt} 사진 ${i + 1}`} fill sizes="100vw" className={styles.image} />
            </div>
          ))}
        </div>
        <button type="button" className={styles.mobileCounter} onClick={openTour} aria-label={`사진 ${images.length}장 모두 보기`}>
          {slide + 1} / {images.length}
        </button>
        {mobileOverlay}
      </div>

      {tourOpen && <PhotoTour images={images} alt={alt} onClose={() => setTourOpen(false)} />}
    </>
  );
}
