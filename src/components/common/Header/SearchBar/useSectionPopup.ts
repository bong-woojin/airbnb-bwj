"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { type ActiveSection, sectionToIdx } from "./flip";

export interface PillStyle {
  left: number;
  width: number;
}

const SECTIONS: Exclude<ActiveSection, null>[] = ["location", "date", "guest"];

// 섹션 요소 안에서 키보드 포커스를 받을 대상 — 섹션 자체가 버튼이면 그대로,
// 여행지처럼 입력창을 감싼 래퍼면 안쪽 입력창/버튼
function focusTarget(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  return el.matches("button, input") ? el : el.querySelector<HTMLElement>("input, button");
}

// 검색바 섹션(여행지/날짜/게스트) 활성 상태와 슬라이딩 필 위치를 관리한다.
// 바깥 클릭·바깥으로 포커스 이동·Escape 시 섹션 닫기도 여기서 처리.
export function useSectionPopup(searchBarRef: RefObject<HTMLDivElement | null>) {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [prevSectionIdx, setPrevSectionIdx] = useState(-1);
  const [pillStyle, setPillStyle] = useState<PillStyle | null>(null);
  const [pillTransition, setPillTransition] = useState(false);
  // 섹션 DOM은 훅 내부에서만 쓴다. 호출부는 registerSection으로 ref 콜백만 받는다
  // (훅이 반환한 ref를 호출부에서 직접 쓰면 react-hooks/immutability 위반).
  const sectionEls = useRef<(HTMLElement | null)[]>([null, null, null]);

  // 섹션별 ref 콜백을 한 번만 만들어 둔다 — 렌더마다 새 함수를 주면 React가 매번 ref를 떼었다 붙인다
  const sectionRefCallbacks = useMemo(
    () =>
      SECTIONS.map((_, i) => (el: HTMLElement | null) => {
        sectionEls.current[i] = el;
      }),
    [],
  );

  function registerSection(section: Exclude<ActiveSection, null>) {
    return sectionRefCallbacks[sectionToIdx(section)];
  }

  function focusSection(section: Exclude<ActiveSection, null>) {
    focusTarget(sectionEls.current[sectionToIdx(section)])?.focus({ preventScroll: true });
  }

  function openSection(section: ActiveSection) {
    // 이미 열린 섹션을 다시 여는 건 무시 (클릭 + 포커스 등 이벤트가 겹쳐도 첫 열림 애니메이션이 유지되게)
    if (section === activeSection) return;
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
    const isOutside = (target: EventTarget | null) =>
      !!searchBarRef.current && !searchBarRef.current.contains(target as Node);
    const onMouseDown = (e: MouseEvent) => {
      if (isOutside(e.target)) closeSection();
    };
    // 키보드 사용자가 Tab으로 검색바 밖으로 나가면 팝업도 닫는다 (마우스의 바깥 클릭과 같은 의미)
    const onFocusIn = (e: FocusEvent) => {
      if (isOutside(e.target)) closeSection();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // 팝업 안에 있던 포커스는 팝업과 함께 사라지므로, 열었던 섹션으로 돌려준다
      const hadFocus = searchBarRef.current?.contains(document.activeElement);
      closeSection();
      if (hadFocus) focusSection(activeSection);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  return {
    activeSection,
    prevSectionIdx,
    pillStyle,
    pillTransition,
    registerSection,
    focusSection,
    openSection,
    closeSection,
  };
}
