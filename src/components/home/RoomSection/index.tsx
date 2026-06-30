"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./RoomSection.module.css";
import RoomCard from "@/components/home/RoomCard";

interface Room {
  id: string;
  image: string;
  location: string;
  date: string;
  price: number;
  rating: number;
  isGuestFavorite: boolean;
}

interface RoomSectionProps {
  title: string;
  href: string;
  rooms: Room[];
}

const GAP = 16;
const MAX_VISIBLE = 7;
const MIN_CARD_WIDTH = 140;

export default function RoomSection({ title, href, rooms }: RoomSectionProps) {
  const [offset, setOffset] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visible, setVisible] = useState(MAX_VISIBLE);
  const [animKey, setAnimKey] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const totalCards = rooms.length + 1; // 전체보기 카드 포함
  const maxOffset = Math.max(0, totalCards - visible);
  const stepSize = cardWidth + GAP;

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const innerW = wrapRef.current.offsetWidth;
      const newVisible = Math.min(
        MAX_VISIBLE,
        Math.max(1, Math.floor((innerW + GAP) / (MIN_CARD_WIDTH + GAP)))
      );
      setVisible(newVisible);
      setCardWidth((innerW - (newVisible - 1) * GAP) / newVisible);
      setOffset((o) => Math.min(o, Math.max(0, totalCards - newVisible)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [totalCards]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <Link href={href} className={styles.titleLink}>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.arrow}>
            <em>→</em>
          </span>
        </Link>
        <div className={styles.controls}>
          <button
            className={styles.controlBtn}
            onClick={() => { setOffset(0); setTimeout(() => setAnimKey(0), 150); }}
            disabled={offset === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible", transform: "scaleX(-1)" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></svg>
          </button>
          <button
            className={styles.controlBtn}
            onClick={() => { setOffset(maxOffset); setTimeout(() => setAnimKey((k) => k + 1), 150); }}
            disabled={offset >= maxOffset}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></svg>
          </button>
        </div>
      </div>
      <div className={styles.gridOuter}>
        <div className={styles.gridWrap} ref={wrapRef}>
          <div
            className={styles.grid}
            style={{ transform: `translateX(${-offset * stepSize}px)` }}
          >
            {rooms.map((room) => (
              <div key={room.id} style={{ width: cardWidth, flexShrink: 0 }}>
                <RoomCard {...room} />
              </div>
            ))}
            <div style={{ width: cardWidth, flexShrink: 0 }}>
              <Link href={href} className={styles.viewAllCard}>
                <div className={`${styles.imageStack} ${animKey > 0 ? styles.animate : ""}`} key={animKey}>
                  <div className={styles.stackCard1}>
                    <img src={rooms[1]?.image} alt="" className={styles.stackImg} />
                  </div>
                  <div className={styles.stackCard2}>
                    <img src={rooms[2]?.image} alt="" className={styles.stackImg} />
                  </div>
                  <div className={styles.stackCard3}>
                    <img src={rooms[0]?.image} alt="" className={styles.stackImg} />
                  </div>
                </div>
                <span className={styles.viewAllText}>전체보기</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
