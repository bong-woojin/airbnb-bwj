"use client";

import { useRef, type ReactNode } from "react";
import styles from "./MobileSearch.module.css";
import LocationPopup from "./LocationPopup";
import CalendarPopup from "./CalendarPopup";
import ServiceTypePopup from "./ServiceTypePopup";
import GuestCounter, { type GuestKey, type Guests } from "@/components/common/GuestCounter";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import type { DateSelection } from "./searchState";

export type MobileStep = "location" | "date" | "guest";

interface MobileSearchModalProps {
  activeTab: number;
  step: MobileStep;
  onStepChange: (step: MobileStep) => void;
  // 검색 조건은 SearchBar가 소유한다 (데스크톱 팝업과 같은 state를 공유하는 controlled 모달)
  locationQuery: string;
  onLocationQueryChange: (q: string) => void;
  selectedLocation: string;
  onSelectLocation: (title: string) => void;
  dateSelection: DateSelection;
  onDateChange: (next: DateSelection) => void;
  dateLabel: string | null;
  guests: Guests;
  onAdjustGuest: (key: GuestKey, delta: number) => void;
  selectedServiceType: string;
  onSelectServiceType: (title: string) => void;
  guestSummary: string;
  onReset: () => void;
  onSearch: () => void;
  onClose: () => void;
}

// 모바일(743px 이하) 전체 화면 검색 — 실제 에어비앤비 모바일 웹처럼
// 여행지 → 날짜 → 여행자 카드가 아코디언으로 하나씩 펼쳐지고, 하단에 "전체 삭제 / 검색" 바.
export default function MobileSearchModal(props: MobileSearchModalProps) {
  const { activeTab, step, onStepChange, onClose } = props;
  const panelRef = useRef<HTMLDivElement>(null);
  // Escape 닫기 / 배경 스크롤 잠금 / 포커스 트랩 (상세 모달과 같은 훅)
  useModalBehavior(panelRef, onClose);

  const isService = activeTab === 2;
  const locationSummary = props.selectedLocation || props.locationQuery.trim() || "유연한 검색";

  return (
    <div className={styles.modal} ref={panelRef} role="dialog" aria-modal="true" aria-label="검색">
      <div className={styles.top}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="검색 닫기">
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="m6 6 20 20M26 6 6 26" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        <Card
          open={step === "location"}
          label="여행지"
          summary={locationSummary}
          title="어디로 여행가세요?"
          onOpen={() => onStepChange("location")}
        >
          <label className={styles.searchField}>
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.33 0 6.36-1.26 8.65-3.32l8.84 8.84 1.41-1.41-8.84-8.84C25.26 19.36 26 16.33 26 13c0-7.18-5.82-13-13-13zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="여행지 검색"
              autoComplete="off"
              value={props.selectedLocation || props.locationQuery}
              onChange={(e) => {
                // 선택된 도시가 있으면 지우고 새로 입력 (입력창 하나로 선택/검색어를 같이 보여준다)
                if (props.selectedLocation) props.onSelectLocation("");
                props.onLocationQueryChange(e.target.value);
              }}
            />
          </label>
          <LocationPopup
            query={props.selectedLocation ? "" : props.locationQuery}
            tab={activeTab}
            onSelect={props.onSelectLocation}
          />
        </Card>

        <Card
          open={step === "date"}
          label="날짜"
          summary={props.dateLabel ?? "날짜 추가"}
          title="여행 날짜는 언제인가요?"
          onOpen={() => onStepChange("date")}
        >
          <CalendarPopup value={props.dateSelection} onChange={props.onDateChange} />
        </Card>

        <Card
          open={step === "guest"}
          label={isService ? "서비스 유형" : "여행자"}
          summary={props.guestSummary}
          title={isService ? "어떤 서비스를 찾으세요?" : "누구와 함께 하시나요?"}
          onOpen={() => onStepChange("guest")}
        >
          {isService ? (
            <ServiceTypePopup selected={props.selectedServiceType} onSelect={props.onSelectServiceType} />
          ) : (
            <GuestCounter guests={props.guests} onAdjust={props.onAdjustGuest} />
          )}
        </Card>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.resetBtn} onClick={props.onReset}>
          전체 삭제
        </button>
        <button type="button" className={styles.searchBtn} onClick={props.onSearch}>
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.33 0 6.36-1.26 8.65-3.32l8.84 8.84 1.41-1.41-8.84-8.84C25.26 19.36 26 16.33 26 13c0-7.18-5.82-13-13-13zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z" />
          </svg>
          검색
        </button>
      </div>
    </div>
  );
}

interface CardProps {
  open: boolean;
  label: string;
  summary: string;
  title: string;
  onOpen: () => void;
  children: ReactNode;
}

// 접힌 상태: "라벨 ··· 요약" 한 줄 버튼 / 펼친 상태: 질문형 제목 + 입력 UI
function Card({ open, label, summary, title, onOpen, children }: CardProps) {
  if (!open) {
    return (
      <button type="button" className={`${styles.card} ${styles.cardCollapsed}`} onClick={onOpen}>
        <span className={styles.cardLabel}>{label}</span>
        <span className={styles.cardSummary}>{summary}</span>
      </button>
    );
  }
  return (
    <section className={`${styles.card} ${styles.cardOpen}`} aria-label={label}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {children}
    </section>
  );
}
