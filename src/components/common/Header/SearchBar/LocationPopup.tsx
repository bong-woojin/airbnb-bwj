"use client";

import styles from "./LocationPopup.module.css";
import { filterDestinations } from "./searchState";

interface LocationPopupProps {
  // 여행지 입력창의 현재 값 — 이 값으로 목록을 거른다(자동완성)
  query: string;
  onSelect: (title: string) => void;
}

export default function LocationPopup({ query, onSelect }: LocationPopupProps) {
  const destinations = filterDestinations(query);
  const searching = query.trim() !== "";

  return (
    <>
      <p className={styles.popupSectionTitle}>{searching ? "검색 결과" : "추천 여행지"}</p>
      {destinations.length === 0 ? (
        <p className={styles.emptyText}>일치하는 여행지가 없습니다. 검색 버튼을 누르면 입력한 이름으로 검색합니다.</p>
      ) : (
        <ul className={styles.destList}>
          {destinations.map((dest) => (
            <li key={dest.title} className={styles.destItem} onClick={() => onSelect(dest.title)}>
              <div className={styles.destIcon}>{dest.icon}</div>
              <div className={styles.destText}>
                <div className={styles.destTitle}>{dest.title}</div>
                <div className={styles.destDesc}>{dest.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
