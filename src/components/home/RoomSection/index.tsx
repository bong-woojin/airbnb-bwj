"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./RoomSection.module.css";
import RoomCard from "@/components/home/RoomCard";

interface Room {
  id: string;
  image: string;
  location: string;
  startOffset?: number;
  nights?: number;
  price: number;
  rating: number;
  tag?: string;
}

interface RoomSectionProps {
  title: string;
  href: string;
  basePath: string;
  rooms: Room[];
  priority?: boolean;
  perPerson?: boolean;
}

const GAP = 16;
const MAX_VISIBLE = 7;
const MOBILE_VISIBLE = 2.1;

// Header.module.css의 반응형 브레이크포인트(1439/1127/949/743)와 맞춘 카드 노출 개수.
// 너비가 좁아질수록 보이는 카드 수는 줄고, 그만큼 카드 하나의 크기는 커진다.
// 743 이하에서는 2.1개로 잡아 다음 카드가 살짝 걸쳐 보이게(스크롤 가능함을 암시) 한다.
const VISIBLE_BREAKPOINTS = [
  { maxWidth: 743, visible: MOBILE_VISIBLE },
  { maxWidth: 949, visible: 4 },
  { maxWidth: 1127, visible: 5 },
  { maxWidth: 1439, visible: 6 },
];

function getVisibleCount(windowWidth: number) {
  for (const bp of VISIBLE_BREAKPOINTS) {
    if (windowWidth <= bp.maxWidth) return bp.visible;
  }
  return MAX_VISIBLE;
}

export default function RoomSection({ title, href, basePath, rooms, priority, perPerson }: RoomSectionProps) {
  const [offset, setOffset] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visible, setVisible] = useState<number>(MAX_VISIBLE);
  const [animKey, setAnimKey] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const totalCards = rooms.length + 1; // 전체보기 카드 포함
  const maxOffset = Math.max(0, totalCards - visible);
  const stepSize = cardWidth + GAP;
  const isMobile = visible === MOBILE_VISIBLE;
  // 한 번에 보이는 개수만큼만 이동 — 끝까지 한 번에 점프하지 않고, 다음 클릭에서 전체보기 카드가 자연스럽게 들어온다.
  const pageStep = Math.max(1, Math.floor(visible));

  function goPrev() {
    setOffset((o) => Math.max(0, o - pageStep));
    setAnimKey(0);
  }

  function goNext() {
    const next = Math.min(maxOffset, offset + pageStep);
    setOffset(next);
    if (next >= maxOffset) {
      setTimeout(() => setAnimKey((k) => k + 1), 150);
    }
  }
  // JS가 실제 픽셀 너비를 측정하기 전(SSR 및 최초 렌더)에는 카드 너비가 0이 되어
  // 이미지가 보일 공간 자체가 사라지므로, 측정 전까지는 .cardFallbackWidth의 미디어 쿼리로
  // VISIBLE_BREAKPOINTS와 동일한 값을 미리 잡아둔다 (측정 후 크기가 튀어 보이지 않도록).
  const cardStyle = cardWidth ? { width: cardWidth, flexShrink: 0 } : { flexShrink: 0 };
  const cardClassName = cardWidth ? "" : styles.cardFallbackWidth;

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const innerW = wrapRef.current.offsetWidth;
      const newVisible = getVisibleCount(window.innerWidth);
      setVisible(newVisible);
      // 소수(2.1)인 경우 "칸 수"는 올림 기준으로 세되, 갭도 그만큼만 들어간다.
      const gapCount = Math.ceil(newVisible) - 1;
      setCardWidth((innerW - gapCount * GAP) / newVisible);
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
            <em>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}><g fill="none"><path d="M28 16H2M17 4l11.3 11.3a1 1 0 0 1 0 1.4L17 28"></path></g></svg>
            </em>
          </span>
        </Link>
        <div className={styles.controls}>
          {isMobile ? (
            <Link href={href} className={styles.controlBtn} aria-label="전체보기">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></svg>
            </Link>
          ) : (
            <>
              <button className={styles.controlBtn} onClick={goPrev} disabled={offset === 0}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible", transform: "scaleX(-1)" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></svg>
              </button>
              <button className={styles.controlBtn} onClick={goNext} disabled={offset >= maxOffset}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></svg>
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.gridOuter}>
        <div className={styles.gridWrap} ref={wrapRef}>
          <div
            className={styles.grid}
            style={{ transform: `translateX(${-offset * stepSize}px)` }}
          >
            {rooms.map((room, index) => (
              <div key={room.id} className={cardClassName} style={cardStyle}>
                <RoomCard {...room} href={`${basePath}/${room.id}`} priority={priority && index < 3} perPerson={perPerson} />
              </div>
            ))}
            <div className={cardClassName} style={cardStyle}>
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
