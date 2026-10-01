"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RoomCard from "@/components/home/RoomCard";
import type { ListingItem } from "@/data/types";
import type { Paginated } from "@/lib/listings";
import styles from "./ListingResults.module.css";

interface ListingGridProps {
  // 서버가 렌더링해준 첫 페이지 (빠른 첫 화면 + SEO)
  initialItems: ListingItem[];
  basePath: string;
  perPerson?: boolean;
  linkQuery?: string;
  // 무한 스크롤: 2페이지부터 가져올 /api/listings 쿼리. 없으면 정적 그리드로 동작.
  fetchQuery?: string;
  initialHasMore?: boolean;
  pageLimit?: number;
}

// 첫 페이지는 서버 컴포넌트가 만들고, 이후 페이지는 이 컴포넌트가 /api/listings에서
// 가져와 이어 붙인다. 바닥 감지는 IntersectionObserver — 스크롤 이벤트 방식과 달리
// 스크롤할 때마다 실행되지 않고 감시 요소가 화면에 들어올 때만 콜백이 호출된다.
export default function ListingGrid({
  initialItems,
  basePath,
  perPerson,
  linkQuery,
  fetchQuery,
  initialHasMore = false,
  pageLimit = 12,
}: ListingGridProps) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재까지 불러온 페이지 번호. IntersectionObserver 콜백이 연달아 발화해도
  // 같은 페이지를 중복 요청하지 않도록 ref로 재진입을 막는다.
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !fetchQuery) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/listings?${fetchQuery}&page=${pageRef.current + 1}&limit=${pageLimit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Paginated<ListingItem> = await res.json();
      pageRef.current += 1;
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
    } catch {
      setError("목록을 더 불러오지 못했습니다.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [fetchQuery, pageLimit]);

  useEffect(() => {
    // 에러 상태에서는 자동 재요청하지 않는다 — 실패가 반복되면 무한 요청 루프가 되므로
    // 사용자가 "다시 시도"를 눌러야 재개된다.
    if (!fetchQuery || !hasMore || error) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      // 바닥에 닿기 400px 전에 미리 요청해서 스크롤이 끊기지 않게
      { rootMargin: "400px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchQuery, hasMore, error, loadMore]);

  return (
    <>
      <div className={styles.grid}>
        {items.map((item, index) => (
          <RoomCard
            key={item.id}
            {...item}
            href={`${basePath}/${item.id}${linkQuery ? `?${linkQuery}` : ""}`}
            perPerson={perPerson}
            variant="list"
            priority={index < 4}
          />
        ))}
        {loading &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={`skeleton-${i}`} className={styles.skeletonCard} aria-hidden="true">
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </div>
          ))}
      </div>

      {hasMore && !error && <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />}

      {error && (
        <div className={styles.loadError} role="alert">
          <p>{error}</p>
          <button type="button" className={styles.loadErrorRetry} onClick={loadMore}>
            다시 시도
          </button>
        </div>
      )}
    </>
  );
}
