"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoomCard from "@/components/home/RoomCard";
import type { ListingItem } from "@/data/types";
import { useAppSelector } from "@/hooks/useAppDispatch";
import styles from "./WishlistGrid.module.css";

type WishlistItem = ListingItem & { type: string; basePath: string };

export default function WishlistGrid() {
  const ids = useAppSelector((state) => state.wishlist.wishlistedIds);
  // 마지막으로 받아온 결과 — 어떤 id 목록(key)에 대한 결과인지 같이 둔다.
  // 로딩/빈 상태는 state로 따로 두지 않고 key와 비교해 렌더링 때 판단한다 (이펙트 안 동기 setState 회피).
  const [result, setResult] = useState<{ key: string; items?: WishlistItem[]; error?: boolean } | null>(null);
  // 찜 목록은 Providers가 마운트 직후 localStorage에서 복원한다 — 복원 전의 빈 배열을
  // "찜한 곳 없음"으로 보여주지 않도록 한 틱 기다린 뒤에 판단한다.
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRestored(true), 0);
    return () => clearTimeout(t);
  }, []);

  const key = ids.join(",");
  useEffect(() => {
    if (!restored || !key) return;
    let cancelled = false;
    fetch(`/api/listings?ids=${encodeURIComponent(key)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ items: WishlistItem[] }>;
      })
      .then((data) => !cancelled && setResult({ key, items: data.items }))
      .catch(() => !cancelled && setResult({ key, error: true }));
    return () => {
      cancelled = true;
    };
  }, [key, restored]);

  const current = result?.key === key ? result : null;
  const error = !!current?.error;
  const items: WishlistItem[] | null = !restored ? null : !key ? [] : (current?.items ?? null);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>위시리스트</h1>
      {error ? (
        <p className={styles.empty}>위시리스트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      ) : items === null ? (
        <p className={styles.empty} role="status">불러오는 중…</p>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>아직 찜한 곳이 없어요</p>
          <p>마음에 드는 숙소의 하트를 눌러 위시리스트에 저장해 보세요.</p>
          <Link href="/" className={styles.emptyLink}>
            둘러보기
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <RoomCard key={item.id} {...item} href={`${item.basePath}/${item.id}`} perPerson={item.type !== "rooms"} variant="list" />
          ))}
        </div>
      )}
    </div>
  );
}
