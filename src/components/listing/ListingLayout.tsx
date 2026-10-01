"use client";

import { useState, type ReactNode } from "react";
import styles from "./ListingResults.module.css";

interface ListingLayoutProps {
  list: ReactNode;
  map: ReactNode;
}

// 목록 + 지도 레이아웃. 넓은 화면은 좌우 반반, 949px 이하는 지도가 숨고
// 하단 가운데 "지도 표시 / 목록 표시" 버튼으로 전환한다 (실제 에어비앤비 모바일 웹과 같은 방식).
// 목록·지도 내용은 서버 컴포넌트(ListingResults)가 만들어 넘기고, 여기선 전환 상태만 갖는다.
export default function ListingLayout({ list, map }: ListingLayoutProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className={`${styles.results} ${showMap ? styles.mapMode : ""}`}>
      <div className={styles.left}>{list}</div>
      <div className={styles.right}>{map}</div>
      <button type="button" className={styles.mapToggle} onClick={() => setShowMap((v) => !v)}>
        {showMap ? "목록 표시" : "지도 표시"}
        {showMap ? (
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M2.5 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 12v2H6v-2h9zM2.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 7v2H6V7h9zM2.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 2v2H6V2h9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M31.25 3.75a2.29 2.29 0 0 0-1.01-1.44A2.29 2.29 0 0 0 28.5 2L21 3.67l-10-2L2.5 3.56A2.29 2.29 0 0 0 .7 5.8v21.95a2.28 2.28 0 0 0 1.06 1.94A2.29 2.29 0 0 0 3.5 30L11 28.33l10 2 8.49-1.89a2.29 2.29 0 0 0 1.8-2.24V4.25a2.3 2.3 0 0 0-.04-.5zM12 4.17l8 1.6v22.06l-8-1.6zM3 27.96 2.94 6 10 4.44v21.98zM29.06 26 22 27.56V5.58L29 4z" />
          </svg>
        )}
      </button>
    </div>
  );
}
