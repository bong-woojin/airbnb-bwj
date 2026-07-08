"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatYMD } from "@/lib/dates";
import styles from "./SearchBar.module.css";
import LocationPopup from "./LocationPopup";
import CalendarPopup from "./CalendarPopup";
import GuestPopup from "./GuestPopup";
import ServiceTypePopup from "./ServiceTypePopup";
import CompactSearchBar, { type SearchLabels } from "./CompactSearchBar";
import { sectionToIdx } from "./flip";
import { useSectionPopup } from "./useSectionPopup";
import { useSearchTransition } from "./useSearchTransition";

interface SearchBarProps {
  activeTab: number;
  onScrolledChange?: (scrolled: boolean) => void;
  forceScrolled?: boolean;
  searchLabels?: SearchLabels;
}

export default function SearchBar({ activeTab, onScrolledChange, forceScrolled = false, searchLabels }: SearchBarProps) {
  // 검색 조건 상태
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [datePlaceholder, setDatePlaceholder] = useState("날짜 추가");
  const [hasDateSelection, setHasDateSelection] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [totalGuests, setTotalGuests] = useState(0);

  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);

  const {
    activeSection,
    prevSectionIdx,
    pillStyle,
    pillTransition,
    sectionEls,
    openSection,
    closeSection,
  } = useSectionPopup(searchBarRef);

  const { scrolled, compactSearchRef, expandFromCompact, collapseToCompact } = useSearchTransition({
    forceScrolled,
    onScrolledChange,
    searchBarRef,
    activeSection,
    openSection,
    closeSection,
  });

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

  // 검색: 선택한 여행지/날짜를 URL 파라미터로 넘겨 숙소 목록 페이지로 이동
  function handleSearch() {
    const params = new URLSearchParams();
    if (selectedLocation) params.set("location", selectedLocation);
    if (dateRange.start && dateRange.end) {
      params.set("checkin", formatYMD(dateRange.start));
      params.set("checkout", formatYMD(dateRange.end));
    }
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    const query = params.toString();
    closeSection();
    router.push(query ? `/rooms?${query}` : "/rooms");
    // 목록 페이지에서 재검색한 경우: 같은 라우트라 컴포넌트가 유지되므로 직접 접는다
    if (forceScrolled) collapseToCompact();
  }

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
      {/* 목록 페이지에서 검색바 확장 시 본문 위를 덮는 반투명 오버레이 */}
      {forceScrolled && !scrolled && <div className={styles.searchOverlay} />}

      <CompactSearchBar
        visible={scrolled}
        labels={searchLabels}
        onExpand={forceScrolled ? expandFromCompact : undefined}
        ref={compactSearchRef}
      />

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

          <button className={styles.searchBtn} onClick={handleSearch} aria-label="검색">
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
                    onChange={(text, hasSelection, range) => {
                      setDatePlaceholder(text);
                      setHasDateSelection(hasSelection);
                      setDateRange(range);
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
