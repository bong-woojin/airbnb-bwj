"use client";

import { useState } from "react";
import styles from "./CalendarPopup.module.css";
import CalendarMonth from "@/components/common/CalendarMonth";
import { getToday } from "@/lib/dates";
import { type DateSelection, type DateTab, selectDay } from "./searchState";

const FLEX_MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2026, 5 + i, 1));
// 목데이터의 예약 가능 기간이 오늘부터 최대 약 90일 뒤까지라 캘린더도 3개월 뒤까지 탐색을 허용한다.
const CAL_MAX_OFFSET = 3;
const DATE_FLEX_OPTIONS = [
  { label: "정확한 날짜", value: 0 },
  { label: "1일", value: 1 },
  { label: "2일", value: 2 },
  { label: "3일", value: 3 },
  { label: "7일", value: 7 },
  { label: "14일", value: 14 },
] as const;

interface CalendarPopupProps {
  // 선택값은 SearchBar가 소유한다. 섹션을 옮기면 이 컴포넌트는 언마운트되지만 선택은 유지된다.
  value: DateSelection;
  onChange: (next: DateSelection) => void;
}

export default function CalendarPopup({ value, onChange }: CalendarPopupProps) {
  // 여기 남은 state는 "보기 상태"뿐 — 다시 열 때 초기화돼도 사용자가 고른 값은 잃지 않는다.
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [flexPage, setFlexPage] = useState(0);
  const today = getToday();
  // 다시 열면 체크인이 있는 달부터 보여준다 (마운트 시 한 번 계산하는 초기값 — 부모에 보고하지 않음)
  const [calOffset, setCalOffset] = useState(() => {
    if (!value.start) return 0;
    const offset =
      (value.start.getFullYear() - today.getFullYear()) * 12 + (value.start.getMonth() - today.getMonth());
    return Math.min(Math.max(offset, 0), CAL_MAX_OFFSET);
  });

  const calLeft = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
  const calRight = new Date(today.getFullYear(), today.getMonth() + calOffset + 1, 1);

  const { tab: dateTab, start: selectedStart, end: selectedEnd, flexibility: dateFlexibility } = value;

  function setTab(tab: DateTab) {
    onChange({ ...value, tab });
  }

  function handleDayClick(d: Date) {
    onChange(selectDay(value, d));
  }

  return (
    <>
      <div className={styles.dateTabs}>
        <button
          className={`${styles.dateTabBtn} ${dateTab === "specific" ? styles.dateTabBtnActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setTab("specific");
          }}
        >
          날짜 지정
        </button>
        <button
          className={`${styles.dateTabBtn} ${dateTab === "flexible" ? styles.dateTabBtnActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setTab("flexible");
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
            {DATE_FLEX_OPTIONS.map(({ label, value: flexibility }) => (
              <button
                key={flexibility}
                className={`${styles.dateFlexBtn} ${dateFlexibility === flexibility ? styles.dateFlexBtnActive : ""}`}
                onClick={(e) => { e.stopPropagation(); onChange({ ...value, flexibility }); }}
              >
                {flexibility > 0 && (
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
                className={`${styles.flexDurBtn} ${value.flexDuration === key ? styles.flexDurBtnActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ ...value, flexDuration: key });
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
                  const active = value.flexMonths.includes(i);
                  return (
                    <button
                      key={i}
                      className={`${styles.flexMonthCard} ${active ? styles.flexMonthCardActive : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange({
                          ...value,
                          flexMonths: active ? value.flexMonths.filter((x) => x !== i) : [...value.flexMonths, i],
                        });
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
