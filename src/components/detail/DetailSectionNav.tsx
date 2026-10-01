"use client";

import { useEffect, useState } from "react";
import styles from "./DetailSectionNav.module.css";

interface DetailSectionNavProps {
  sections: { id: string; label: string }[];
  priceText: string;
  rating: number;
}

// PC 상세 스크롤 탭 — 실제 에어비앤비처럼 사진 영역을 지나 스크롤하면 헤더 자리에
// "사진 · 위치 · 편의시설 …" 탭 줄이 나타난다. 예약카드까지 화면 밖으로 지나가면
// 오른쪽에 가격·평점·예약하기 버튼도 함께 보여준다 (누르면 예약카드로 이동).
// 모바일(743px 이하)은 갤러리 위 버튼·하단 예약 바가 이 역할을 하므로 CSS로 숨긴다.
export default function DetailSectionNav({ sections, priceText, rating }: DetailSectionNavProps) {
  const [visible, setVisible] = useState(false);
  const [showReserve, setShowReserve] = useState(false);

  useEffect(() => {
    const photos = document.getElementById("photos");
    const booking = document.getElementById("booking");
    // 요소가 화면 위로 완전히 지나갔는지(아래에 있어서 안 보이는 것과 구분) — 헤더 높이(80px)만큼 여유
    const passedTop = (entry: IntersectionObserverEntry) =>
      !entry.isIntersecting && entry.boundingClientRect.top < 80;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === photos) setVisible(passedTop(entry));
          if (entry.target === booking) setShowReserve(passedTop(entry));
        }
      },
      { rootMargin: "-80px 0px 0px 0px" },
    );
    if (photos) observer.observe(photos);
    if (booking) observer.observe(booking);
    return () => observer.disconnect();
  }, []);

  // 탭 줄이 보이는 동안 원래 헤더는 위로 숨긴다 (실제 사이트: 헤더 자리를 탭 줄이 대신한다).
  // 헤더는 다른 컴포넌트라 body 데이터 속성으로 알린다 — Header.module.css가 이 속성을 본다.
  useEffect(() => {
    if (visible) document.body.dataset.sectionNav = "on";
    else delete document.body.dataset.sectionNav;
    return () => {
      delete document.body.dataset.sectionNav;
    };
  }, [visible]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: id === "booking" ? "center" : "start" });
  }

  return (
    <div className={`${styles.bar} ${visible ? styles.barVisible : ""}`} inert={!visible} aria-label="상세 섹션 바로가기">
      <div className={styles.inner}>
        <nav className={styles.links}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(s.id);
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>
        {showReserve && (
          <div className={styles.reserve}>
            <div className={styles.reserveInfo}>
              <span className={styles.reservePrice}>{priceText}</span>
              <span className={styles.reserveRating}>★ {rating}</span>
            </div>
            <button type="button" className={styles.reserveBtn} onClick={() => scrollTo("booking")}>
              예약하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
