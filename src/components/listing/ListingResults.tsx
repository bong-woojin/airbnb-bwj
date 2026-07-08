import RoomCard from "@/components/home/RoomCard";
import type { ListingItem } from "@/data/types";
import styles from "./ListingResults.module.css";

interface ListingResultsProps {
  items: ListingItem[];
  title: string;
  basePath: string;
  mapQuery: string;
  mapZoom: number;
  perPerson?: boolean;
}

// 검색/목록 결과 화면: 왼쪽 절반은 제목 + 카드 2열 목록(스크롤), 오른쪽 절반은 고정 지도.
// 숙소/체험/서비스 목록 페이지가 공유한다.
export default function ListingResults({ items, title, basePath, mapQuery, mapZoom, perPerson }: ListingResultsProps) {
  return (
    <div className={styles.results}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {items.length === 0 ? (
          <p className={styles.empty}>표시할 항목이 없습니다.</p>
        ) : (
          <div className={styles.grid}>
            {items.map((item, index) => (
              <RoomCard
                key={item.id}
                {...item}
                href={`${basePath}/${item.id}`}
                perPerson={perPerson}
                priority={index < 4}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.mapSticky}>
          <iframe
            className={styles.mapFrame}
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${mapZoom}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="검색 결과 지도"
          />
        </div>
      </div>
    </div>
  );
}
