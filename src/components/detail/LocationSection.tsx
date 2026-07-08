import styles from "./ItemDetail.module.css";

interface LocationSectionProps {
  location: string; // 예: "부산 · 해운대"
  // 체험/서비스처럼 location이 도시명이 아닐 때 표기/지도 검색어를 직접 지정
  cityLabel?: string;
  mapQuery?: string;
}

// "위치" 섹션: 도시명 + Google Maps 임베드
export default function LocationSection({ location, cityLabel, mapQuery }: LocationSectionProps) {
  const city = cityLabel ?? location.split("·")[0].trim();
  const query = mapQuery ?? location.replace(/·/g, " ").replace(/\s+/g, " ").trim();

  return (
    <div className={styles.locationSection}>
      <h2 className={styles.locationTitle}>위치</h2>
      <p className={styles.locationSubtitle}>{city}, 한국</p>
      <div className={styles.mapWrap}>
        <iframe
          className={styles.mapFrame}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="지도"
        />
      </div>
    </div>
  );
}
