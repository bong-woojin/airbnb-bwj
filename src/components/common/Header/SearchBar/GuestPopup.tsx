"use client";

import { useEffect, useState } from "react";
import styles from "./GuestPopup.module.css";

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

const GUEST_ROWS = [
  { key: "adults" as const, label: "성인", sub: "13세 이상" },
  { key: "children" as const, label: "어린이", sub: "2~12세" },
  { key: "infants" as const, label: "유아", sub: "2세 미만" },
  { key: "pets" as const, label: "반려동물", sub: "" },
];

interface GuestPopupProps {
  onTotalChange: (total: number) => void;
}

export default function GuestPopup({ onTotalChange }: GuestPopupProps) {
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });

  const total = guests.adults + guests.children + guests.infants + guests.pets;

  useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

  function adjustGuest(key: keyof Guests, delta: number) {
    setGuests((g) => ({ ...g, [key]: Math.max(0, g[key] + delta) }));
  }

  return (
    <>
      {GUEST_ROWS.map((row, i) => (
        <div key={row.key} className={`${styles.guestRow} ${i < GUEST_ROWS.length - 1 ? styles.guestRowBorder : ""}`}>
          <div>
            <div className={styles.guestLabel}>{row.label}</div>
            {row.sub && <div className={styles.guestSub}>{row.sub}</div>}
          </div>
          <div className={styles.guestCounter}>
            <button
              className={styles.counterBtn}
              onClick={(e) => {
                e.stopPropagation();
                adjustGuest(row.key, -1);
              }}
              disabled={guests[row.key] === 0}
            >
              −
            </button>
            <span className={styles.counterVal}>{guests[row.key]}</span>
            <button
              className={styles.counterBtn}
              onClick={(e) => {
                e.stopPropagation();
                adjustGuest(row.key, 1);
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
