"use client";

import { forwardRef } from "react";
import styles from "./SearchBar.module.css";

interface CompactSearchBarProps {
  visible: boolean;
}

const CompactSearchBar = forwardRef<HTMLDivElement, CompactSearchBarProps>(function CompactSearchBar(
  { visible },
  ref
) {
  return (
    <div className={styles.compactSearchOuter}>
      <div className={`${styles.compactSearch} ${visible ? styles.compactSearchVisible : ""}`} ref={ref}>
        <span className={styles.compactItem}>어디든지</span>
        <span className={styles.compactDivider} />
        <span className={styles.compactItem}>언제든지</span>
        <span className={styles.compactDivider} />
        <span className={styles.compactItemLight}>게스트 추가</span>
        <button className={styles.compactBtn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            style={{ display: "block", fill: "currentcolor", height: "12px", width: "12px" }}
          >
            <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.33 0 6.36-1.26 8.65-3.32l8.84 8.84 1.41-1.41-8.84-8.84C25.26 19.36 26 16.33 26 13c0-7.18-5.82-13-13-13zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default CompactSearchBar;
