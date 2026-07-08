"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { type ActiveSection, sectionToIdx } from "./flip";

export interface PillStyle {
  left: number;
  width: number;
}

// 검색바 섹션(여행지/날짜/게스트) 활성 상태와 슬라이딩 필 위치를 관리한다.
// 바깥 클릭·Escape 시 섹션 닫기도 여기서 처리.
export function useSectionPopup(searchBarRef: RefObject<HTMLDivElement | null>) {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [prevSectionIdx, setPrevSectionIdx] = useState(-1);
  const [pillStyle, setPillStyle] = useState<PillStyle | null>(null);
  const [pillTransition, setPillTransition] = useState(false);
  const sectionEls = useRef<(HTMLDivElement | null)[]>([null, null, null]);

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
    if (!activeSection) return;
    const onMouseDown = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        closeSection();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSection();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  return {
    activeSection,
    prevSectionIdx,
    pillStyle,
    pillTransition,
    sectionEls,
    openSection,
    closeSection,
  };
}
