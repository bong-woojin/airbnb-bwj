"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatYMD } from "@/lib/dates";
import Link from "next/link";
import { homeTabHref, searchPathForTab } from "@/lib/tabs";
import styles from "./SearchBar.module.css";
import LocationPopup from "./LocationPopup";
import CalendarPopup from "./CalendarPopup";
import GuestCounter, { type GuestKey, type Guests } from "@/components/common/GuestCounter";
import ServiceTypePopup from "./ServiceTypePopup";
import CompactSearchBar, { type SearchLabels } from "./CompactSearchBar";
import MobileSearchModal, { type MobileStep } from "./MobileSearchModal";
import mobileStyles from "./MobileSearch.module.css";
import { sectionToIdx } from "./flip";
import { useSectionPopup } from "./useSectionPopup";
import { useSearchTransition } from "./useSearchTransition";
import {
  type DateSelection,
  EMPTY_DATE_SELECTION,
  EMPTY_GUESTS,
  countGuests,
  filterDestinations,
  formatDateSelectionLabel,
  resolveSearchLocation,
} from "./searchState";

interface SearchBarProps {
  activeTab: number;
  onScrolledChange?: (scrolled: boolean) => void;
  forceScrolled?: boolean;
  searchLabels?: SearchLabels;
}

export default function SearchBar({ activeTab, onScrolledChange, forceScrolled = false, searchLabels }: SearchBarProps) {
  // 검색 조건 상태 — 전부 여기서 소유하고 팝업들은 value/onChange로만 다룬다(controlled).
  // 팝업은 섹션을 옮길 때마다 언마운트되므로, 선택값을 팝업 안에 두면 다시 열 때 사라진다.
  // 표시 문구(날짜 라벨, 게스트 수)는 state로 따로 두지 않고 렌더링 때 계산한다.
  const [locationQuery, setLocationQuery] = useState(""); // 여행지 입력창에 친 텍스트
  const [selectedLocation, setSelectedLocation] = useState(""); // 목록에서 고른 도시
  const [selectedServiceType, setSelectedServiceType] = useState("");
  // 모바일(743px 이하): 헤더 알약 → 전체 화면 검색 모달. 검색 조건 state는 데스크톱과 공유한다.
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileStep, setMobileStep] = useState<MobileStep>("location");
  const [dateSelection, setDateSelection] = useState<DateSelection>(EMPTY_DATE_SELECTION);
  const [guests, setGuests] = useState<Guests>(EMPTY_GUESTS);

  const dateLabel = formatDateSelectionLabel(dateSelection);
  const totalGuests = countGuests(guests);

  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);

  const {
    activeSection,
    prevSectionIdx,
    pillStyle,
    pillTransition,
    registerSection,
    focusSection,
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
    focusSection,
  });

  // 키보드(Enter/Space)로 섹션을 열면 팝업 안으로 포커스를 옮긴다. 팝업은 DOM상 검색 버튼 뒤에
  // 있어서, 그대로 두면 Tab으로 다른 섹션·검색 버튼을 지나야 팝업에 닿는다.
  // 마우스 클릭(detail > 0)은 포커스를 옮기지 않는다.
  const popupRef = useRef<HTMLDivElement>(null);
  const focusPopupOnOpen = useRef(false);
  const popupId = useId();
  const locationInputId = useId();

  function openSectionFromButton(section: "date" | "guest", e: React.MouseEvent) {
    focusPopupOnOpen.current = e.detail === 0;
    openSection(section);
  }

  useLayoutEffect(() => {
    if (!activeSection || !focusPopupOnOpen.current) return;
    focusPopupOnOpen.current = false;
    popupRef.current
      ?.querySelector<HTMLElement>('button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')
      ?.focus({ preventScroll: true });
  }, [activeSection]);

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

  // 검색: 선택한 조건을 URL 파라미터로 넘겨 현재 탭의 목록 페이지(/rooms, /experiences, /services)로 이동.
  // 파라미터는 탭과 무관하게 같은 이름으로 싣는다 — 각 목록 페이지가 지원하는 것만 골라 쓴다.
  function handleSearch() {
    const params = new URLSearchParams();
    const location = resolveSearchLocation(selectedLocation, locationQuery);
    if (location) params.set("location", location);
    if (dateSelection.start && dateSelection.end) {
      params.set("checkin", formatYMD(dateSelection.start));
      params.set("checkout", formatYMD(dateSelection.end));
    }
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    const query = params.toString();
    const path = searchPathForTab(activeTab);
    closeSection();
    setMobileOpen(false);
    router.push(query ? `${path}?${query}` : path);
    // 목록 페이지에서 재검색한 경우: 같은 라우트라 컴포넌트가 유지되므로 직접 접는다
    if (forceScrolled) collapseToCompact();
  }

  function selectLocation(title: string) {
    setSelectedLocation(title);
    setLocationQuery(title);
    openSection("date");
  }

  function clearLocation() {
    setSelectedLocation("");
    setLocationQuery("");
    openSection("location");
  }

  // 모바일 모달용: 도시 선택(빈 문자열이면 선택 해제) 후 날짜 카드로 넘어간다
  function selectLocationMobile(title: string) {
    setSelectedLocation(title);
    if (!title) return;
    setLocationQuery(title);
    setMobileStep("date");
  }

  function resetAll() {
    setLocationQuery("");
    setSelectedLocation("");
    setSelectedServiceType("");
    setDateSelection(EMPTY_DATE_SELECTION);
    setGuests(EMPTY_GUESTS);
    setMobileStep("location");
  }

  function adjustGuest(key: GuestKey, delta: number) {
    setGuests((g) => ({ ...g, [key]: Math.max(0, g[key] + delta) }));
  }

  const guestPlaceholder =
    activeTab === 2
      ? selectedServiceType || "서비스 추가"
      : totalGuests > 0
        ? `게스트 ${totalGuests}명`
        : "게스트 추가";
  const hasGuestValue = activeTab === 2 ? !!selectedServiceType : totalGuests > 0;
  const locationPlaceholder = activeTab === 1 ? "도시나 명소로 검색" : "여행지 검색";
  const thirdSectionLabel = activeTab === 2 ? "서비스 유형" : "여행자";

  return (
    <>
      {/* 목록 페이지에서 검색바 확장 시 본문 위를 덮는 반투명 오버레이 */}
      {forceScrolled && !scrolled && <div className={styles.searchOverlay} />}

      {/* 모바일 전용 알약 버튼 (데스크톱에서는 CSS로 숨김). 목록 페이지에선 현재 검색 조건 요약을 보여준다 */}
      <div className={`${mobileStyles.pillOuter} ${forceScrolled ? mobileStyles.pillOuterWithBack : ""}`}>
        {/* 목록·상세 페이지: 알약 왼쪽 뒤로가기 → 해당 탭의 홈 (실제 에어비앤비 모바일 검색 결과 화면) */}
        {forceScrolled && (
          <Link href={homeTabHref(activeTab)} className={mobileStyles.backBtn} aria-label="홈으로">
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4" />
            </svg>
          </Link>
        )}
        <button
          type="button"
          className={mobileStyles.pill}
          onClick={() => {
            setMobileStep(selectedLocation ? "date" : "location");
            setMobileOpen(true);
          }}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.33 0 6.36-1.26 8.65-3.32l8.84 8.84 1.41-1.41-8.84-8.84C25.26 19.36 26 16.33 26 13c0-7.18-5.82-13-13-13zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z" />
          </svg>
          <span className={mobileStyles.pillText}>
            {searchLabels && (searchLabels.location || searchLabels.date || searchLabels.guests) ? (
              <>
                <span className={mobileStyles.pillMain}>{searchLabels.location ?? "어디든지"}</span>
                <span className={mobileStyles.pillSub}>
                  {searchLabels.date ?? "언제든지"} · {searchLabels.guests ?? "게스트 추가"}
                </span>
              </>
            ) : (
              <span className={mobileStyles.pillMain}>검색을 시작해 보세요</span>
            )}
          </span>
        </button>
      </div>

      {mobileOpen && (
        <MobileSearchModal
          activeTab={activeTab}
          step={mobileStep}
          onStepChange={setMobileStep}
          locationQuery={locationQuery}
          onLocationQueryChange={setLocationQuery}
          selectedLocation={selectedLocation}
          onSelectLocation={selectLocationMobile}
          dateSelection={dateSelection}
          onDateChange={setDateSelection}
          dateLabel={dateLabel}
          guests={guests}
          onAdjustGuest={adjustGuest}
          selectedServiceType={selectedServiceType}
          onSelectServiceType={setSelectedServiceType}
          guestSummary={guestPlaceholder}
          onReset={resetAll}
          onSearch={handleSearch}
          onClose={() => setMobileOpen(false)}
        />
      )}

      <CompactSearchBar
        visible={scrolled}
        labels={searchLabels}
        onExpand={forceScrolled ? expandFromCompact : undefined}
        ref={compactSearchRef}
      />

      {/* 확장 검색바 */}
      {/* 압축 상태에서는 inert — 숨겨진 확장 바의 입력창·버튼으로 Tab 포커스가 들어가지 않게 */}
      <div className={`${styles.expandedSearch} ${scrolled ? styles.expandedSearchHidden : ""}`} inert={scrolled}>
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

          {/* 여행지 — 입력창과 지우기 버튼을 품고 있어 섹션 자체는 버튼이 될 수 없다
              (button 안에 interactive content 중첩 금지). 키보드 진입점은 입력창(또는 선택된 도시 버튼)이고,
              래퍼의 onClick은 섹션 아무 곳이나 눌러도 열리게 하는 마우스용 편의다. */}
          <div
            ref={registerSection("location")}
            className={`${styles.searchSection} ${activeSection === "location" ? styles.searchSectionActive : ""}`}
            onClick={() => openSection("location")}
          >
            <label htmlFor={locationInputId} className={styles.searchLabel}>여행지</label>
            {selectedLocation ? (
              <div className={styles.locationSelected}>
                <button
                  type="button"
                  className={`${styles.buttonReset} ${styles.locationSelectedText}`}
                  onClick={() => openSection("location")}
                >
                  {selectedLocation}
                </button>
                {activeSection === "location" && (
                  <button
                    type="button"
                    className={styles.locationClearBtn}
                    aria-label="여행지 지우기"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearLocation();
                      // 지우기 버튼이 사라지므로 다시 나타나는 입력창으로 포커스를 옮긴다
                      requestAnimationFrame(() => focusSection("location"));
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: "block", fill: "none", height: "12px", width: "12px", stroke: "currentcolor", strokeWidth: 3.5, overflow: "visible" as const }}>
                      <path d="m6 6 20 20M26 6 6 26" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <input
                id={locationInputId}
                className={styles.searchInput}
                placeholder={locationPlaceholder}
                autoComplete="off"
                aria-controls={activeSection === "location" ? popupId : undefined}
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  // 탭 키로 포커스해 바로 타이핑한 경우에도 자동완성 목록이 보이도록
                  if (activeSection !== "location") openSection("location");
                }}
                onKeyDown={(e) => {
                  // 한글 조합 중 Enter는 조합 확정용이므로 무시
                  if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
                  const [first] = filterDestinations(locationQuery, activeTab);
                  if (first && locationQuery.trim()) selectLocation(first.title);
                  else handleSearch();
                }}
              />
            )}
          </div>
          <div className={styles.searchDivider} />

          {/* 날짜 — 표시만 하던 readOnly input은 버튼 안에 둘 수 없어 span으로 바꿨다 */}
          <button
            type="button"
            ref={registerSection("date")}
            className={`${styles.buttonReset} ${styles.searchSection} ${activeSection === "date" ? styles.searchSectionActive : ""}`}
            aria-expanded={activeSection === "date"}
            aria-controls={activeSection === "date" ? popupId : undefined}
            onClick={(e) => openSectionFromButton("date", e)}
          >
            <span className={styles.searchLabel}>날짜</span>
            <span className={`${styles.searchValue} ${dateLabel ? styles.searchInputFilled : styles.searchValuePlaceholder}`}>
              {dateLabel ?? "날짜 추가"}
            </span>
          </button>
          <div className={styles.searchDivider} />

          {/* 여행자 / 서비스 유형 */}
          <button
            type="button"
            ref={registerSection("guest")}
            className={`${styles.buttonReset} ${styles.searchSection} ${activeSection === "guest" ? styles.searchSectionActive : ""}`}
            aria-expanded={activeSection === "guest"}
            aria-controls={activeSection === "guest" ? popupId : undefined}
            onClick={(e) => openSectionFromButton("guest", e)}
          >
            <span className={styles.searchLabel}>{thirdSectionLabel}</span>
            <span className={`${styles.searchValue} ${hasGuestValue ? styles.searchInputFilled : styles.searchValuePlaceholder}`}>
              {guestPlaceholder}
            </span>
          </button>

          <button type="button" className={styles.searchBtn} onClick={handleSearch} aria-label="검색">
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
              id={popupId}
              ref={popupRef}
              className={`${styles.popup} ${prevSectionIdx < 0 ? styles.popupFirstOpen : ""}`}
              style={getPopupStyle()}
            >
              {/* key 변경 시 리마운트 → 콘텐츠 슬라이드 애니메이션 */}
              <div key={activeSection} className={contentAnimClass}>
                {activeSection === "location" && (
                  <LocationPopup query={locationQuery} tab={activeTab} onSelect={selectLocation} />
                )}

                {activeSection === "date" && (
                  <CalendarPopup value={dateSelection} onChange={setDateSelection} />
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
                    <GuestCounter guests={guests} onAdjust={adjustGuest} />
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
