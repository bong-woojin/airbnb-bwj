"use client";

import styles from "./CalendarMonth.module.css";

const KO_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarMonthProps {
  year: number;
  month: number;
  today: Date;
  selectedStart: Date | null;
  selectedEnd: Date | null;
  hovered: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  showPrev?: boolean;
  prevDisabled?: boolean;
  onPrev?: () => void;
  showNext?: boolean;
  nextDisabled?: boolean;
  onNext?: () => void;
}

export default function CalendarMonth({
  year,
  month,
  today,
  selectedStart,
  selectedEnd,
  hovered,
  onDayClick,
  onDayHover,
  showPrev,
  prevDisabled,
  onPrev,
  showNext,
  nextDisabled,
  onNext,
}: CalendarMonthProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  const rangeEnd = selectedEnd ?? hovered;

  function inRange(d: Date) {
    if (!selectedStart || !rangeEnd) return false;
    const a = selectedStart <= rangeEnd ? selectedStart : rangeEnd;
    const b = selectedStart <= rangeEnd ? rangeEnd : selectedStart;
    return d > a && d < b;
  }

  function isSelected(d: Date) {
    if (selectedStart && d.toDateString() === selectedStart.toDateString()) return true;
    if (rangeEnd && d.toDateString() === rangeEnd.toDateString()) return true;
    return false;
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className={styles.calMonth}>
      <div className={styles.calMonthHeader}>
        {showPrev ? (
          <button
            className={styles.calNavBtn}
            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
            disabled={prevDisabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "10px", width: "10px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible", transform: "scaleX(-1)" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" /></svg>
          </button>
        ) : (
          <div className={styles.calNavSpacer} />
        )}
        <div className={styles.calMonthName}>{monthName}</div>
        {showNext ? (
          <button
            className={styles.calNavBtn}
            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
            disabled={nextDisabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "10px", width: "10px", stroke: "currentcolor", strokeWidth: 4, overflow: "visible" }}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" /></svg>
          </button>
        ) : (
          <div className={styles.calNavSpacer} />
        )}
      </div>
      <div className={styles.calGrid}>
        {KO_DAYS.map((w) => (
          <div key={w} className={styles.calWeekday}>
            {w}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e${idx}`} />;
          const d = new Date(year, month, day);
          const isPast = d < today;
          const sel = isSelected(d);
          const range = !sel && inRange(d);
          return (
            <button
              key={day}
              className={[
                styles.calDay,
                isPast ? styles.calDayPast : "",
                sel ? styles.calDaySelected : "",
                range ? styles.calDayRange : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={isPast}
              onClick={() => onDayClick(d)}
              onMouseEnter={() => onDayHover(d)}
              onMouseLeave={() => onDayHover(null)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
