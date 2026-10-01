"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileTabBar.module.css";
import { useAppSelector } from "@/hooks/useAppDispatch";

// 모바일(743px 이하) 하단 고정 탭바 — 실제 에어비앤비 모바일 웹처럼 아래로 스크롤하면 숨고, 위로 올리면 다시 나온다.
// 로그인은 이 프로젝트 범위 밖이라 동작하는 두 탭(검색·위시리스트)만 둔다.
export default function MobileTabBar() {
  const pathname = usePathname();
  const wishlistCount = useAppSelector((state) => state.wishlist.wishlistedIds.length);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // 작은 흔들림(관성 스크롤 끝의 미세 이동)에는 반응하지 않도록 여유를 둔다
      if (y > lastY.current + 8 && y > 80) setHidden(true);
      else if (y < lastY.current - 8 || y <= 80) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onWishlist = pathname === "/wishlists";

  return (
    <nav className={`${styles.bar} ${hidden ? styles.barHidden : ""}`} aria-label="하단 메뉴">
      <Link href="/" className={`${styles.item} ${!onWishlist ? styles.itemActive : ""}`} aria-current={!onWishlist ? "page" : undefined}>
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={styles.iconFill}>
          <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.33 0 6.36-1.26 8.65-3.32l8.84 8.84 1.41-1.41-8.84-8.84C25.26 19.36 26 16.33 26 13c0-7.18-5.82-13-13-13zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z" />
        </svg>
        <span>검색</span>
      </Link>
      <Link href="/wishlists" className={`${styles.item} ${onWishlist ? styles.itemActive : ""}`} aria-current={onWishlist ? "page" : undefined}>
        <span className={styles.iconWrap}>
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={styles.iconStroke}>
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z" />
          </svg>
          {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
        </span>
        <span>위시리스트</span>
      </Link>
    </nav>
  );
}
