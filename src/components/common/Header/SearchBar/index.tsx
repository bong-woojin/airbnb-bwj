"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import LocationPopup from "./LocationPopup";
import CalendarPopup from "./CalendarPopup";
import GuestPopup from "./GuestPopup";
import ServiceTypePopup from "./ServiceTypePopup";
import CompactSearchBar from "./CompactSearchBar";
import { type ActiveSection, runFlip, sectionToIdx } from "./flip";

interface PillStyle {
  left: number;
  width: number;
}

interface SearchBarProps {
  activeTab: number;
  onScrolledChange?: (scrolled: boolean) => void;
  forceScrolled?: boolean;
}

export default function SearchBar({ activeTab, onScrolledChange, forceScrolled = false }: SearchBarProps) {
  const [scrolled, setScrolled] = useState(forceScrolled);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [prevSectionIdx, setPrevSectionIdx] = useState(-1);
  const [pillStyle, setPillStyle] = useState<PillStyle | null>(null);
  const [pillTransition, setPillTransition] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [datePlaceholder, setDatePlaceholder] = useState("날짜 추가");
  const [hasDateSelection, setHasDateSelection] = useState(false);
  const [totalGuests, setTotalGuests] = useState(0);

  const isTransitioning = useRef(false);
  const scrolledRef = useRef(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const compactSearchRef = useRef<HTMLDivElement>(null);
  const searchFlipSourceRect = useRef<DOMRect | null>(null);
  const sectionEls = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const sectionIdx = sectionToIdx(activeSection);

  // 팝업 내부 콘텐츠 애니메이션: 처음 열릴 땐 없음, 섹션 전환 시 좌우 슬라이드
  const contentAnimClass =
    prevSectionIdx >= 0 && prevSectionIdx !== sectionIdx
      ? sectionIdx > prevSectionIdx
        ? styles.popupContentFromRight
        : styles.popupContentFromLeft
      : "";

  // 팝업 컨테이너 위치: left + width 인라인 스타일로 transition 처리
  function getPopupStyle(): React.CSSProperties {
    if (activeSection === "location") return { left: 0, width: "50%" };
    if (activeSection === "date") return { left: 0, width: "100%" };
    if (activeSection === "guest") {
      if (activeTab === 2) {
        return { left: "34%", width: "66%", padding: "40px 50px", borderRadius: "32px" };
      }
      return { left: "50%", width: "50%" };
    }
    return {};
  }

  function openSection(section: ActiveSection) {
    const idx = sectionToIdx(section);
    const el = sectionEls.current[idx];
    const bar = searchBarRef.current;
    if (el && bar) {
      const eRect = el.getBoundingClientRect();
      const bRect = bar.getBoundingClientRect();
      const hasTransition = activeSection !== null;
      setPillStyle({ left: eRect.left - bRect.left, width: eRect.width });
      setPillTransition(hasTransition);
    }
    setPrevSectionIdx(sectionToIdx(activeSection));
    setActiveSection(section);
  }

  function closeSection() {
    setActiveSection(null);
    setPillStyle(null);
    setPillTransition(false);
    setPrevSectionIdx(-1);
  }

  useEffect(() => {
    if (forceScrolled) {
      onScrolledChange?.(true);
      return;
    }
    const onScroll = () => {
      if (isTransitioning.current) return;
      if (!scrolledRef.current && window.scrollY > 80) {
        isTransitioning.current = true;
        scrolledRef.current = true;
        searchFlipSourceRect.current = searchBarRef.current?.getBoundingClientRect() ?? null;
        setScrolled(true);
        onScrolledChange?.(true);
        setTimeout(() => {
          isTransitioning.current = false;
        }, 400);
      } else if (scrolledRef.current && window.scrollY < 40) {
        isTransitioning.current = true;
        scrolledRef.current = false;
        searchFlipSourceRect.current = compactSearchRef.current?.getBoundingClientRect() ?? null;
        setScrolled(false);
        onScrolledChange?.(false);
        setTimeout(() => {
          isTransitioning.current = false;
        }, 400);
      }
      closeSection();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceScrolled]);

  useLayoutEffect(() => {
    if (scrolled) {
      runFlip(compactSearchRef.current, searchFlipSourceRect.current,"");
    } else {
      runFlip(searchBarRef.current, searchFlipSourceRect.current, "");
    }
  }, [scrolled]);

  useEffect(() => {
    if (!activeSection) return;
    const onMouseDown = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        closeSection();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [activeSection]);

  const guestPlaceholder =
    activeTab === 2
      ? selectedServiceType || "서비스 추가"
      : totalGuests > 0
        ? `게스트 ${totalGuests}명`
        : "게스트 추가";
  const locationPlaceholder = activeTab === 1 ? "도시나 명소로 검색" : "여행지 검색";
  const thirdSectionLabel = activeTab === 2 ? "서비스 유형" : "여행자";

  return (
    <>
      <CompactSearchBar visible={scrolled} ref={compactSearchRef} />

      {/* 확장 검색바 */}
      <div className={`${styles.expandedSearch} ${scrolled ? styles.expandedSearchHidden : ""}`}>
        <div
          className={`${styles.searchBar} ${activeSection ? styles.searchBarActive : ""}`}
          ref={searchBarRef}
        >
          {/* 슬라이딩 백그라운드 필 */}
          {activeSection && pillStyle && (
            <div
              className={`${styles.sectionPill} ${pillTransition ? styles.sectionPillTransition : ""}`}
              style={{ left: pillStyle.left, width: pillStyle.width }}
            />
          )}

          {/* 여행지 */}
          <div
            ref={(el) => {
              sectionEls.current[0] = el;
            }}
            className={`${styles.searchSection} ${activeSection === "location" ? styles.searchSectionActive : ""}`}
            onClick={() => openSection("location")}
          >
            <span className={styles.searchLabel}>여행지</span>
            {selectedLocation ? (
              <div className={styles.locationSelected}>
                <span className={styles.locationSelectedText}>{selectedLocation}</span>
                {activeSection === "location" && (
                  <button
                    className={styles.locationClearBtn}
                    onClick={(e) => { e.stopPropagation(); setSelectedLocation(""); openSection("location"); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 3.5, overflow: "visible" as const }}>
                      <path d="m6 6 20 20M26 6 6 26" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <input className={styles.searchInput} placeholder={locationPlaceholder} />
            )}
          </div>
          <div className={styles.searchDivider} />

          {/* 날짜 */}
          <div
            ref={(el) => {
              sectionEls.current[1] = el;
            }}
            className={`${styles.searchSection} ${activeSection === "date" ? styles.searchSectionActive : ""}`}
            onClick={() => openSection("date")}
          >
            <span className={styles.searchLabel}>날짜</span>
            <input
              className={`${styles.searchInput} ${hasDateSelection ? styles.searchInputFilled : ""}`}
              placeholder={hasDateSelection ? "" : datePlaceholder}
              value={hasDateSelection ? datePlaceholder : ""}
              readOnly
            />
          </div>
          <div className={styles.searchDivider} />

          {/* 여행자 / 서비스 유형 */}
          <div
            ref={(el) => {
              sectionEls.current[2] = el;
            }}
            className={`${styles.searchSection} ${activeSection === "guest" ? styles.searchSectionActive : ""}`}
            onClick={() => openSection("guest")}
          >
            <span className={styles.searchLabel}>{thirdSectionLabel}</span>
            <input className={styles.searchInput} placeholder={guestPlaceholder} readOnly />
          </div>

          <button className={styles.searchBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style={{ display: "block", fill: "currentcolor", height: "16px", width: "16px" }}
            >
              <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.33 0 6.36-1.26 8.65-3.32l8.84 8.84 1.41-1.41-8.84-8.84C25.26 19.36 26 16.33 26 13c0-7.18-5.82-13-13-13zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z" />
            </svg>
          </button>

          {/* 단일 팝업 컨테이너 — left/width 트랜지션으로 이동 */}
          {activeSection && !(activeSection === "location" && selectedLocation) && (
            <div
              className={`${styles.popup} ${prevSectionIdx < 0 ? styles.popupFirstOpen : ""}`}
              style={getPopupStyle()}
            >
              {/* key 변경 시 리마운트 → 콘텐츠 슬라이드 애니메이션 */}
              <div key={activeSection} className={contentAnimClass}>
                {activeSection === "location" && (
                  <LocationPopup
                    onSelect={(title) => {
                      setSelectedLocation(title);
                      openSection("date");
                    }}
                  />
                )}

                {activeSection === "date" && (
                  <CalendarPopup
                    onChange={(text, hasSelection) => {
                      setDatePlaceholder(text);
                      setHasDateSelection(hasSelection);
                    }}
                  />
                )}

                {activeSection === "guest" && (
                  activeTab === 2 ? (
                    <ServiceTypePopup
                      selected={selectedServiceType}
                      onSelect={(title) => {
                        setSelectedServiceType(title);
                        closeSection();
                      }}
                    />
                  ) : (
                    <GuestPopup onTotalChange={setTotalGuests} />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
