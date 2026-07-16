import ListingGrid from "./ListingGrid";
import type { ListingItem } from "@/data/types";
import styles from "./ListingResults.module.css";

interface ListingResultsProps {
  // 첫 페이지 항목 (서버에서 필터링·페이지네이션된 결과)
  items: ListingItem[];
  title: string;
  basePath: string;
  mapQuery: string;
  mapZoom: number;
  perPerson?: boolean;
  // 상세 링크에 이어 붙일 쿼리스트링("checkin=…&guests=…") — 검색 컨텍스트를 상세까지 유지
  linkQuery?: string;
  // 무한 스크롤: 다음 페이지를 가져올 /api/listings 쿼리 + 남은 페이지 유무. 없으면 정적 목록.
  fetchQuery?: string;
  hasMore?: boolean;
}

// 검색/목록 결과 화면: 왼쪽 절반은 제목 + 카드 2열 목록(스크롤), 오른쪽 절반은 고정 지도.
// 숙소/체험/서비스 목록 페이지가 공유한다.
export default function ListingResults({
  items,
  title,
  basePath,
  mapQuery,
  mapZoom,
  perPerson,
  linkQuery,
  fetchQuery,
  hasMore,
}: ListingResultsProps) {
  return (
    <div className={styles.results}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {items.length === 0 ? (
          <p className={styles.empty}>표시할 항목이 없습니다.</p>
        ) : (
          <ListingGrid
            // 검색 조건이 바뀌면(쿼리가 바뀌면) 그리드 상태(누적 항목, 페이지 번호)를 리셋하기 위해 리마운트
            key={fetchQuery ?? "static"}
            initialItems={items}
            basePath={basePath}
            perPerson={perPerson}
            linkQuery={linkQuery}
            fetchQuery={fetchQuery}
            initialHasMore={hasMore}
          />
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
