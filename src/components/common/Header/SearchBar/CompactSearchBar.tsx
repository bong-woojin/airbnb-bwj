"use client";

import { forwardRef } from "react";
import styles from "./SearchBar.module.css";

export interface SearchLabels {
  location?: string;
  date?: string;
  guests?: string;
}

export type CompactSection = "location" | "date" | "guest";

// 헤더 탭의 숙소 아이콘과 같은 이미지
const HOUSE_ICON =
  "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240";

interface CompactSearchBarProps {
  visible: boolean;
  labels?: SearchLabels;
  onExpand?: (section?: CompactSection) => void;
}

const CompactSearchBar = forwardRef<HTMLDivElement, CompactSearchBarProps>(function CompactSearchBar(
  { visible, labels, onExpand },
  ref
) {
  // 세그먼트: 확장 가능한 곳(목록/상세)에서는 버튼, 아니면(홈 — 스크롤로만 전환) 표시용 텍스트.
  // 버튼이면 클릭 시 해당 섹션이 바로 열리도록 섹션명을 함께 전달한다.
  function segment(section: CompactSection, label: string, className: string) {
    if (!onExpand) return <span className={className}>{label}</span>;
    return (
      <button
        type="button"
        className={`${styles.buttonReset} ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          onExpand(section);
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div className={styles.compactSearchOuter}>
      {/* 숨겨진 동안은 inert — opacity 0이어도 Tab 포커스가 보이지 않는 버튼으로 들어가지 않게 */}
      <div
        className={`${styles.compactSearch} ${visible ? styles.compactSearchVisible : ""}`}
        ref={ref}
        inert={!visible}
        onClick={() => onExpand?.()}
        style={onExpand ? { cursor: "pointer" } : undefined}
      >
        <img src={HOUSE_ICON} alt="" className={styles.compactIcon} />
        {segment("location", labels?.location ?? "어디든지", styles.compactItem)}
        <span className={styles.compactDivider} />
        {segment("date", labels?.date ?? "언제든지", styles.compactItem)}
        <span className={styles.compactDivider} />
        {segment("guest", labels?.guests ?? "게스트 추가", labels?.guests ? styles.compactItem : styles.compactItemLight)}
        {/* 검색 아이콘: 클릭은 바깥 div의 onClick(확장)으로 버블링된다 */}
        <button type="button" className={styles.compactBtn} aria-label="검색 조건 편집" tabIndex={onExpand ? undefined : -1}>
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
