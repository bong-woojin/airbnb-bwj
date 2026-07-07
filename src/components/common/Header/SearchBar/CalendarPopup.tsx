"use client";

import { useEffect, useState } from "react";
import styles from "./CalendarPopup.module.css";
import CalendarMonth from "./CalendarMonth";

type DateTab = "specific" | "flexible";
type FlexDuration = "weekend" | "week" | "month" | null;

const FLEX_MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2026, 5 + i, 1));
const CAL_MAX_OFFSET = 23;
const DATE_FLEX_OPTIONS = [
  { label: "정확한 날짜", value: 0 },
  { label: "1일", value: 1 },
  { label: "2일", value: 2 },
  { label: "3일", value: 3 },
  { label: "7일", value: 7 },
  { label: "14일", value: 14 },
] as const;

function formatDate(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

interface CalendarPopupProps {
  onChange: (placeholder: string, hasSelection: boolean) => void;
}

export default function CalendarPopup({ onChange }: CalendarPopupProps) {
  const [dateTab, setDateTab] = useState<DateTab>("specific");
  const [flexDuration, setFlexDuration] = useState<FlexDuration>(null);
  const [selectedFlexMonths, setSelectedFlexMonths] = useState<number[]>([]);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [calOffset, setCalOffset] = useState(0);
  const [flexPage, setFlexPage] = useState(0);
  const [dateFlexibility, setDateFlexibility] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const calLeft = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
  const calRight = new Date(today.getFullYear(), today.getMonth() + calOffset + 1, 1);

  const flexSuffix = dateFlexibility > 0 ? ` ±${dateFlexibility}` : "";
  const placeholder = selectedStart
    ? selectedEnd
      ? `${formatDate(selectedStart)} ~ ${formatDate(selectedEnd)}${flexSuffix}`
      : `${formatDate(selectedStart)}${flexSuffix}`
    : "날짜 추가";

  useEffect(() => {
    onChange(placeholder, !!selectedStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, selectedStart]);

  function handleDayClick(d: Date) {
    if (!selectedStart || selectedEnd) {
      setSelectedStart(d);
      setSelectedEnd(null);
    } else if (d < selectedStart) {
      setSelectedEnd(selectedStart);
      setSelectedStart(d);
    } else if (d > selectedStart) {
      setSelectedEnd(d);
    }
  }

  return (
    <>
      <div className={styles.dateTabs}>
        <button
          className={`${styles.dateTabBtn} ${dateTab === "specific" ? styles.dateTabBtnActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setDateTab("specific");
          }}
        >
          날짜 지정
        </button>
        <button
          className={`${styles.dateTabBtn} ${dateTab === "flexible" ? styles.dateTabBtnActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setDateTab("flexible");
          }}
        >
          유연한 일정
        </button>
      </div>

      {dateTab === "specific" ? (
        <>
          <div className={styles.calWrapper}>
            <CalendarMonth
              year={calLeft.getFullYear()}
              month={calLeft.getMonth()}
              today={today}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              hovered={hoveredDate}
              onDayClick={handleDayClick}
              onDayHover={setHoveredDate}
              showPrev
              prevDisabled={calOffset === 0}
              onPrev={() => setCalOffset((o) => o - 1)}
            />
            <CalendarMonth
              year={calRight.getFullYear()}
              month={calRight.getMonth()}
              today={today}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              hovered={hoveredDate}
              onDayClick={handleDayClick}
              onDayHover={setHoveredDate}
              showNext
              nextDisabled={calOffset >= CAL_MAX_OFFSET}
              onNext={() => setCalOffset((o) => o + 1)}
            />
          </div>
          <div className={styles.dateFlexRow}>
            {DATE_FLEX_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                className={`${styles.dateFlexBtn} ${dateFlexibility === value ? styles.dateFlexBtnActive : ""}`}
                onClick={(e) => { e.stopPropagation(); setDateFlexibility(value); }}
              >
                {value > 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "10px", width: "10px", stroke: "currentcolor", strokeWidth: 2.66667, overflow: "visible" as const }}>
                    <path fill="none" d="M16 4v16m-8-8h16M8 26h16" />
                  </svg>
                )}
                {label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.flexWrapper}>
          <p className={styles.flexSubTitle}>숙박 기간을 선택하세요</p>
          <div className={styles.flexDurations}>
            {(["weekend", "week", "month"] as const).map((key) => (
              <button
                key={key}
                className={`${styles.flexDurBtn} ${flexDuration === key ? styles.flexDurBtnActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setFlexDuration(key);
                }}
              >
                {key === "weekend" ? "주말" : key === "week" ? "일주일" : "한달"}
              </button>
            ))}
          </div>
          <p className={styles.flexSubTitle}>여행 날짜를 선택하세요.</p>
          <div className={styles.flexSliderWrap}>
            <button
              className={styles.flexNavBtn}
              style={{ visibility: flexPage > 0 ? "visible" : "hidden" }}
              onClick={(e) => { e.stopPropagation(); setFlexPage(0); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "10px", width: "10px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible", transform: "scaleX(-1)" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" /></svg>
            </button>
            <div className={styles.flexSliderOuter}>
              <div
                className={styles.flexSliderTrack}
                style={{ transform: flexPage === 1 ? "translateX(calc(-100% - 8px))" : "none" }}
              >
                {FLEX_MONTHS.map((m, i) => {
                  const label = m.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                  });
                  const active = selectedFlexMonths.includes(i);
                  return (
                    <button
                      key={i}
                      className={`${styles.flexMonthCard} ${active ? styles.flexMonthCardActive : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFlexMonths((prev) =>
                          prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                        );
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              className={styles.flexNavBtn}
              style={{ visibility: flexPage < 1 ? "visible" : "hidden" }}
              onClick={(e) => { e.stopPropagation(); setFlexPage(1); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "10px", width: "10px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
