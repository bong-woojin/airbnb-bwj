"use client";

import styles from "./LocationPopup.module.css";

// title은 검색 필터(roomsByCity 키)와 그대로 매칭되므로 도시명을 정확히 유지한다.
const DESTINATIONS = [
  { icon: "🌇", title: "서울", desc: "전통과 트렌드가 공존하는 도시 여행" },
  { icon: "🌊", title: "부산", desc: "해운대와 광안리, 바다의 도시" },
  { icon: "🏝️", title: "제주", desc: "자연이 살아있는 힐링 섬 여행" },
  { icon: "⛰️", title: "강릉", desc: "동해 바다와 커피의 도시" },
  { icon: "🌅", title: "여수", desc: "밤바다가 아름다운 남해 여행" },
  { icon: "🏯", title: "경주", desc: "천년 고도에서 즐기는 역사 여행" },
  { icon: "🍜", title: "전주", desc: "한옥마을과 미식의 고장" },
  { icon: "🎿", title: "속초", desc: "설악산과 바다를 한번에" },
  { icon: "🌉", title: "인천", desc: "공항과 가까운 근교 여행" },
  { icon: "🌆", title: "대구", desc: "골목 투어와 야시장의 매력" },
];

interface LocationPopupProps {
  onSelect: (title: string) => void;
}

export default function LocationPopup({ onSelect }: LocationPopupProps) {
  return (
    <>
      <p className={styles.popupSectionTitle}>추천 여행지</p>
      <ul className={styles.destList}>
        {DESTINATIONS.map((dest) => (
          <li key={dest.title} className={styles.destItem} onClick={() => onSelect(dest.title)}>
            <div className={styles.destIcon}>{dest.icon}</div>
            <div className={styles.destText}>
              <div className={styles.destTitle}>{dest.title}</div>
              <div className={styles.destDesc}>{dest.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
