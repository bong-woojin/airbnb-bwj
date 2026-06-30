"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

type ActiveSection = "location" | "date" | "guest" | null;
type DateTab = "specific" | "flexible";
type FlexDuration = "weekend" | "week" | "month" | null;

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface PillStyle {
  left: number;
  width: number;
}

const DESTINATIONS = [
  { icon: "🗺️", title: "근처 체험 찾기", desc: "가까운 곳에서 즐길 수 있는 체험을 찾아보세요" },
  { icon: "🏖️", title: "해변 여행", desc: "파도 소리와 함께하는 완벽한 휴가" },
  { icon: "🏔️", title: "산악 여행", desc: "자연 속에서 즐기는 트레킹과 등산" },
  { icon: "🏙️", title: "도시 탐방", desc: "다양한 문화와 음식을 경험하는 도시 여행" },
  { icon: "🌿", title: "농촌 체험", desc: "자연과 함께하는 힐링 농촌 여행" },
  { icon: "🏯", title: "역사 문화 투어", desc: "한국의 역사와 전통을 느껴보세요" },
  { icon: "🎿", title: "스키 & 스노우보드", desc: "설경 속에서 즐기는 겨울 스포츠" },
  { icon: "🌊", title: "수상 스포츠", desc: "서핑, 스쿠버다이빙 등 수중 액티비티" },
  { icon: "🍜", title: "음식 투어", desc: "현지의 맛을 탐험하는 미식 여행" },
  { icon: "🛕", title: "사찰 & 명상 여행", desc: "고요한 사찰에서 마음의 안정을 찾아보세요" },
];

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
const KO_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function sectionToIdx(s: ActiveSection): number {
  if (s === "location") return 0;
  if (s === "date") return 1;
  if (s === "guest") return 2;
  return -1;
}

function CalendarMonth({
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
}: {
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
}) {
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [prevSectionIdx, setPrevSectionIdx] = useState(-1);
  const [pillStyle, setPillStyle] = useState<PillStyle | null>(null);
  const [pillTransition, setPillTransition] = useState(false);
  const [dateTab, setDateTab] = useState<DateTab>("specific");
  const [flexDuration, setFlexDuration] = useState<FlexDuration>(null);
  const [selectedFlexMonths, setSelectedFlexMonths] = useState<number[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [calOffset, setCalOffset] = useState(0);
  const [flexPage, setFlexPage] = useState(0);
  const [dateFlexibility, setDateFlexibility] = useState(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isFirstRender = useRef(true);
  const isTransitioning = useRef(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const sectionEls = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const calLeft = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
  const calRight = new Date(today.getFullYear(), today.getMonth() + calOffset + 1, 1);

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
    if (activeSection === "guest") return { left: "50%", width: "50%" };
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
    const onScroll = () => {
      if (isTransitioning.current) return;
      setScrolled((prev) => {
        if (!prev && window.scrollY > 80) {
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 400);
          return true;
        }
        if (prev && window.scrollY < 40) {
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, 400);
          return false;
        }
        return prev;
      });
      closeSection();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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


  useEffect(() => {
    const timers = videoRefs.current.map((video, i) =>
      setTimeout(() => {
        if (video) video.play().catch(() => {});
      }, i * 180)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeTab) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeTab]);

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

  function adjustGuest(key: keyof Guests, delta: number) {
    setGuests((g) => ({ ...g, [key]: Math.max(0, g[key] + delta) }));
  }

  const totalGuests = guests.adults + guests.children + guests.infants + guests.pets;
  const flexSuffix = dateFlexibility > 0 ? ` ±${dateFlexibility}` : "";
  const datePlaceholder = selectedStart
    ? selectedEnd
      ? `${formatDate(selectedStart)} ~ ${formatDate(selectedEnd)}${flexSuffix}`
      : `${formatDate(selectedStart)}${flexSuffix}`
    : "날짜 추가";
  const guestPlaceholder = totalGuests > 0 ? `게스트 ${totalGuests}명` : "게스트 추가";

  const guestRows = [
    { key: "adults" as const, label: "성인", sub: "13세 이상" },
    { key: "children" as const, label: "어린이", sub: "2~12세" },
    { key: "infants" as const, label: "유아", sub: "2세 미만" },
    { key: "pets" as const, label: "반려동물", sub: "" },
  ];

  const tabs = [
    {
      label: "숙소",
      poster:
        "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240",
      hevc: "https://a0.muscache.com/videos/search-bar-icons/hevc/house-twirl-selected.mov",
      webm: "https://a0.muscache.com/videos/search-bar-icons/webm/house-twirl-selected.webm",
    },
    {
      label: "체험",
      poster:
        "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/1e24b1c9-b070-48d9-8a70-91aae3151830.png?im_w=240",
      hevc: "https://a0.muscache.com/videos/search-bar-icons/hevc/balloon-selected.mov#t=0.001",
      webm: "https://a0.muscache.com/videos/search-bar-icons/webm/balloon-selected.webm",
    },
    {
      label: "서비스",
      poster:
        "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240",
      hevc: "https://a0.muscache.com/videos/search-bar-icons/hevc/consierge-selected.mov#t=0.001",
      webm: "https://a0.muscache.com/videos/search-bar-icons/webm/consierge-selected.webm",
    },
  ];

  return (
    <header className={`${styles.wrapper} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg
            width="102"
            height="32"
            viewBox="0 0 3490 1080"
            style={{ display: "block" }}
          >
            <path
              d="M1494.71 456.953C1458.28 412.178 1408.46 389.892 1349.68 389.892C1233.51 389.892 1146.18 481.906 1146.18 605.892C1146.18 729.877 1233.51 821.892 1349.68 821.892C1408.46 821.892 1458.28 799.605 1494.71 754.83L1500.95 810.195H1589.84V401.588H1500.95L1494.71 456.953ZM1369.18 736.895C1295.33 736.895 1242.08 683.41 1242.08 605.892C1242.08 528.373 1295.33 474.888 1369.18 474.888C1443.02 474.888 1495.49 529.153 1495.49 605.892C1495.49 682.63 1443.8 736.895 1369.18 736.895ZM1656.11 810.195H1750.46V401.588H1656.11V810.195ZM948.912 666.715C875.618 506.859 795.308 344.664 713.438 184.809C698.623 155.177 670.554 98.2527 645.603 67.8412C609.736 24.1733 556.715 0.779785 502.915 0.779785C449.115 0.779785 396.094 24.1733 360.227 67.8412C335.277 98.2527 307.207 155.177 292.392 184.809C210.522 344.664 130.212 506.859 56.9187 666.715C47.5621 687.769 24.9504 737.675 16.3736 760.289C6.2373 787.581 0.779297 817.213 0.779297 846.845C0.779297 975.509 101.362 1079.22 235.473 1079.22C346.193 1079.22 434.3 1008.26 502.915 934.18C571.53 1008.26 659.638 1079.22 770.357 1079.22C904.468 1079.22 1005.83 975.509 1005.83 846.845C1005.83 817.213 999.593 787.581 989.457 760.289C980.88 737.675 958.268 687.769 948.912 666.715ZM502.915 810.195C447.555 738.455 396.094 649.56 396.094 577.819C396.094 506.079 446.776 470.209 502.915 470.209C559.055 470.209 610.516 508.419 610.516 577.819C610.516 647.22 558.275 738.455 502.915 810.195ZM770.357 998.902C688.362 998.902 618.032 941.557 555.741 872.656C619.966 792.541 690.826 679.121 690.826 577.819C690.826 458.513 598.04 389.892 502.915 389.892C407.79 389.892 315.784 458.513 315.784 577.819C315.784 679.098 386.145 792.478 450.144 872.593C387.845 941.526 317.491 998.902 235.473 998.902C146.586 998.902 81.0898 931.061 81.0898 846.845C81.0898 826.57 84.2087 807.856 91.2261 788.361C98.2436 770.426 120.855 720.52 130.212 701.025C203.505 541.17 282.256 380.534 364.126 220.679C378.941 191.047 403.891 141.921 422.605 119.307C442.877 94.3538 470.947 81.0975 502.915 81.0975C534.883 81.0975 562.953 94.3538 583.226 119.307C601.939 141.921 626.89 191.047 641.704 220.679C723.574 380.534 802.325 541.17 875.618 701.025C884.975 720.52 907.587 770.426 914.604 788.361C921.622 807.856 925.52 826.57 925.52 846.845C925.52 931.061 859.244 998.902 770.357 998.902ZM3285.71 389.892C3226.91 389.892 3175.97 413.098 3139.91 456.953V226.917H3045.56V810.195H3134.45L3140.69 754.83C3177.12 799.605 3226.94 821.892 3285.71 821.892C3401.89 821.892 3489.22 729.877 3489.22 605.892C3489.22 481.906 3401.89 389.892 3285.71 389.892ZM3266.22 736.895C3191.6 736.895 3139.91 682.63 3139.91 605.892C3139.91 529.153 3191.6 474.888 3266.22 474.888C3340.85 474.888 3393.32 528.373 3393.32 605.892C3393.32 683.41 3340.07 736.895 3266.22 736.895ZM2827.24 389.892C2766.15 389.892 2723.56 418.182 2699.37 456.953L2693.13 401.588H2604.24V810.195H2698.59V573.921C2698.59 516.217 2741.47 474.888 2800.73 474.888C2856.87 474.888 2888.84 513.097 2888.84 578.599V810.195H2983.19V566.903C2983.19 457.733 2923.15 389.892 2827.24 389.892ZM1911.86 460.072L1905.62 401.588H1816.73V810.195H1911.08V604.332C1911.08 532.592 1954.74 486.585 2027.26 486.585C2042.85 486.585 2058.44 488.144 2070.92 492.043V401.588C2059.22 396.91 2044.41 395.35 2028.04 395.35C1978.58 395.35 1936.66 421.177 1911.86 460.072ZM2353.96 389.892C2295.15 389.892 2244.21 413.098 2208.15 456.953V226.917H2113.8V810.195H2202.69L2208.93 754.83C2245.36 799.605 2295.18 821.892 2353.96 821.892C2470.13 821.892 2557.46 729.877 2557.46 605.892C2557.46 481.906 2470.13 389.892 2353.96 389.892ZM2334.46 736.895C2259.84 736.895 2208.15 682.63 2208.15 605.892C2208.15 529.153 2259.84 474.888 2334.46 474.888C2409.09 474.888 2461.56 528.373 2461.56 605.892C2461.56 683.41 2408.31 736.895 2334.46 736.895ZM1703.28 226.917C1669.48 226.917 1642.08 254.326 1642.08 288.13C1642.08 321.934 1669.48 349.343 1703.28 349.343C1737.09 349.343 1764.49 321.934 1764.49 288.13C1764.49 254.326 1737.09 226.917 1703.28 226.917Z"
              fill="#ff385c"
            />
          </svg>
        </div>

        {/* 탭 */}
        <div className={styles.tabs}>
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
              style={{ gap: [14, 6, 10][i] }}
              onClick={() => setActiveTab(i)}
            >
              <span
                className={styles.tabIconWrap}
                style={{ animationDelay: `${i * 0.18}s` }}
                onAnimationEnd={(e) => {
                  (e.currentTarget as HTMLElement).style.animation = "none";
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className={styles.tabIcon}
                  poster={tab.poster}
                  playsInline
                  muted
                  preload="none"
                >
                  <source src={tab.hevc} type='video/mp4; codecs="hvc1"' />
                  <source src={tab.webm} type="video/webm" />
                </video>
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 컴팩트 검색 */}
        <div className={styles.compactSearch}>
          <span className={styles.compactItem}>어디든지</span>
          <span className={styles.compactDivider} />
          <span className={styles.compactItem}>언제든지</span>
          <span className={styles.compactDivider} />
          <span className={styles.compactItemLight}>게스트 추가</span>
          <button className={styles.compactBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style={{ display: "block", fill: "currentcolor", height: "12px", width: "12px" }}
            >
              <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.33 0 6.36-1.26 8.65-3.32l8.84 8.84 1.41-1.41-8.84-8.84C25.26 19.36 26 16.33 26 13c0-7.18-5.82-13-13-13zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          <a href="#">호스팅하기</a>
          <div className={styles.btnWrap}>
            <button className={styles.navItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                style={{ display: "block", height: "16px", width: "16px", fill: "currentcolor" }}
              >
                <path d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 8 .25zm1.95 8.5h-3.9c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zm4.26 0h-2.76c-.09 1.96-.53 3.78-1.18 5.08A6.26 6.26 0 0 0 14.17 9zm-9.67 0H1.8a6.26 6.26 0 0 0 3.94 5.08 12.59 12.59 0 0 1-1.16-4.7l-.03-.38zm1.2-6.58-.12.05a6.26 6.26 0 0 0-3.83 5.03h2.75c.09-1.83.48-3.54 1.06-4.81zm2.25-.42c-.7 0-1.78 2.51-1.94 5.5h3.9c-.15-2.9-1.18-5.34-1.89-5.5h-.07zm2.28.43.03.05a12.95 12.95 0 0 1 1.15 5.02h2.75a6.28 6.28 0 0 0-3.93-5.07z" />
              </svg>
            </button>
            <button className={styles.navItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                style={{
                  display: "block",
                  fill: "none",
                  height: "16px",
                  width: "16px",
                  stroke: "currentcolor",
                  strokeWidth: 3,
                  overflow: "visible",
                }}
              >
                <g fill="none">
                  <path d="M2 16h28M2 24h28M2 8h28" />
                </g>
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* 확장 검색바 */}
      <div className={styles.expandedSearch}>
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
              <input className={styles.searchInput} placeholder="여행지 검색" />
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
              className={`${styles.searchInput} ${selectedStart ? styles.searchInputFilled : ""}`}
              placeholder={selectedStart ? "" : datePlaceholder}
              value={selectedStart ? datePlaceholder : ""}
              readOnly
            />
          </div>
          <div className={styles.searchDivider} />

          {/* 여행자 */}
          <div
            ref={(el) => {
              sectionEls.current[2] = el;
            }}
            className={`${styles.searchSection} ${activeSection === "guest" ? styles.searchSectionActive : ""}`}
            onClick={() => openSection("guest")}
          >
            <span className={styles.searchLabel}>여행자</span>
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
                {/* 여행지 */}
                {activeSection === "location" && (
                  <>
                    <p className={styles.popupSectionTitle}>추천 여행지</p>
                    <ul className={styles.destList}>
                      {DESTINATIONS.map((dest) => (
                        <li
                          key={dest.title}
                          className={styles.destItem}
                          onClick={() => { setSelectedLocation(dest.title); openSection("date"); }}
                        >
                          <div className={styles.destIcon}>{dest.icon}</div>
                          <div className={styles.destText}>
                            <div className={styles.destTitle}>{dest.title}</div>
                            <div className={styles.destDesc}>{dest.desc}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* 날짜 */}
                {activeSection === "date" && (
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
                )}

                {/* 여행자 */}
                {activeSection === "guest" && (
                  <>
                    {guestRows.map((row, i) => (
                      <div
                        key={row.key}
                        className={`${styles.guestRow} ${i < guestRows.length - 1 ? styles.guestRowBorder : ""}`}
                      >
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
