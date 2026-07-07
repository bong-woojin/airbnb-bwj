"use client";

import styles from "./LocationPopup.module.css";

const DESTINATIONS = [
  { icon: "🗺️", title: "근처 체험 찾기", desc: "가까운 곳에서 즐길 수 있는 체험을 찾아보세요" },
  { icon: "🏖️", title: "해변 여행", desc: "파도 소리와 함께하는 완벽한 휴가" },
  { icon: "🏔️", title: "산악 여행", desc: "자연 속에서 즐기는 트레킹과 등산" },
  { icon: "🏙️", title: "도시 탐방", desc: "다양한 문화와 음식을 경험하는 도시 여행" },
  { icon: "🌿", title: "농촌 체험", desc: "자연과 함께하는 힐링 농촌 여행" },
  { icon: "🏯", title: "역사 문화 투어", desc: "한국의 역사와 전통을 느껴보세요" },
  { icon: "🎿", title: "스키 & 스노우보드", desc: "설경 속에서 즐기는 겨울 스포츠" },
  { icon: "🌊", title: "수상 스포츠", desc: "서핑, 스쿠버다이빙 등 수중 액티비티" },
  { icon: "🍜", title: "음식 투어", desc: "현지의 맛을 탐험하는 미식 여행" },
  { icon: "🛕", title: "사찰 & 명상 여행", desc: "고요한 사찰에서 마음의 안정을 찾아보세요" },
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
