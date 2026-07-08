"use client";

import styles from "./GuestCounter.module.css";

export type GuestKey = "adults" | "children" | "infants" | "pets";
export type Guests = Record<GuestKey, number>;

export const GUEST_ROWS: { key: GuestKey; label: string; sub: string }[] = [
  { key: "adults", label: "성인", sub: "13세 이상" },
  { key: "children", label: "어린이", sub: "2~12세" },
  { key: "infants", label: "유아", sub: "2세 미만" },
  { key: "pets", label: "반려동물", sub: "보조동물을 동반하시나요?" },
];

interface GuestCounterProps {
  guests: Guests;
  onAdjust: (key: GuestKey, delta: number) => void;
  // BookingCard처럼 좁은 영역에서 쓰는 작은 사이즈 변형
  compact?: boolean;
}

// 성인/어린이/유아/반려동물 인원 카운터.
// 헤더 검색바 게스트 팝업과 상세페이지 예약카드가 공유하는 표시 전용(controlled) 컴포넌트.
export default function GuestCounter({ guests, onAdjust, compact }: GuestCounterProps) {
  return (
    <>
      {GUEST_ROWS.map((row, i) => (
        <div
          key={row.key}
          className={[
            styles.guestRow,
            compact ? styles.compact : "",
            i < GUEST_ROWS.length - 1 ? styles.guestRowBorder : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div>
            <div className={styles.guestLabel}>{row.label}</div>
            {row.sub && <div className={styles.guestSub}>{row.sub}</div>}
          </div>
          <div className={styles.guestCounter}>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={(e) => {
                e.stopPropagation();
                onAdjust(row.key, -1);
              }}
              disabled={guests[row.key] === 0}
            >
              −
            </button>
            <span className={styles.counterVal}>{guests[row.key]}</span>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={(e) => {
                e.stopPropagation();
                onAdjust(row.key, 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
