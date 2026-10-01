"use client";

import styles from "./LocationPopup.module.css";
import { filterDestinations } from "./searchState";

interface LocationPopupProps {
  // 여행지 입력창의 현재 값 — 이 값으로 목록을 거른다(자동완성)
  query: string;
  // 현재 탭 — 그 탭에 결과가 있는 도시만 보여준다
  tab: number;
  onSelect: (title: string) => void;
}

export default function LocationPopup({ query, tab, onSelect }: LocationPopupProps) {
  const destinations = filterDestinations(query, tab);
  const searching = query.trim() !== "";

  return (
    <>
      <p className={styles.popupSectionTitle}>{searching ? "검색 결과" : "추천 여행지"}</p>
      {destinations.length === 0 ? (
        <p className={styles.emptyText}>일치하는 여행지가 없습니다. 검색 버튼을 누르면 입력한 이름으로 검색합니다.</p>
      ) : (
        <ul className={styles.destList}>
          {destinations.map((dest) => (
            <li key={dest.title}>
              <button type="button" className={styles.destItem} onClick={() => onSelect(dest.title)}>
                <span className={styles.destIcon} aria-hidden="true">{dest.icon}</span>
                <span className={styles.destText}>
                  <span className={styles.destTitle}>{dest.title}</span>
                  <span className={styles.destDesc}>{dest.desc}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
