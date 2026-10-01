"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { type ActiveSection, runFlip } from "./flip";

interface UseSearchTransitionOptions {
  forceScrolled: boolean;
  onScrolledChange?: (scrolled: boolean) => void;
  // 확장 검색바 요소 — 섹션 팝업 훅과 공유하므로 컴포넌트에서 주입받는다
  searchBarRef: RefObject<HTMLDivElement | null>;
  // 섹션 팝업과의 연동: 전환 시 팝업 닫기, 압축 바 세그먼트 클릭 시 해당 섹션 열기
  activeSection: ActiveSection;
  openSection: (section: ActiveSection) => void;
  closeSection: () => void;
  // 확장/압축 전환 때 키보드 포커스 이관용 — 숨겨지는 쪽 바는 inert라 포커스가 사라지므로
  focusSection: (section: Exclude<ActiveSection, null>) => void;
}

// 확장 검색바 ↔ 압축 바 전환을 관리한다.
// - 홈: 스크롤 위치에 따라 자동 전환 (FLIP 애니메이션)
// - 목록 페이지(forceScrolled): 압축 고정 + 클릭으로 확장, 바깥 클릭·스크롤·Escape로 복귀
export function useSearchTransition({
  forceScrolled,
  onScrolledChange,
  searchBarRef,
  activeSection,
  openSection,
  closeSection,
  focusSection,
}: UseSearchTransitionOptions) {
  const [scrolled, setScrolled] = useState(forceScrolled);

  const isTransitioning = useRef(false);
  const scrolledRef = useRef(false);
  const compactSearchRef = useRef<HTMLDivElement>(null);
  const searchFlipSourceRect = useRef<DOMRect | null>(null);

  // 압축 바 클릭 → 확장. 세그먼트를 눌렀다면 FLIP이 끝난 뒤 해당 섹션을 바로 연다.
  // 압축 바는 숨겨지며 inert가 되므로 포커스를 확장 바의 해당 섹션(없으면 여행지)으로 옮긴다.
  // (프로그래매틱 포커스라 마우스 사용자에게는 :focus-visible 링이 뜨지 않는다)
  function expandFromCompact(section?: Exclude<ActiveSection, null>) {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    searchFlipSourceRect.current = compactSearchRef.current?.getBoundingClientRect() ?? null;
    setScrolled(false);
    onScrolledChange?.(false);
    setTimeout(() => {
      isTransitioning.current = false;
      if (section) openSection(section);
      focusSection(section ?? "location");
    }, 400);
  }

  function collapseToCompact() {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    // 확장 바 안에 포커스가 있었다면(Escape 등 키보드로 닫은 경우) 압축 바로 돌려준다
    const hadFocus = searchBarRef.current?.contains(document.activeElement) ?? false;
    searchFlipSourceRect.current = searchBarRef.current?.getBoundingClientRect() ?? null;
    setScrolled(true);
    onScrolledChange?.(true);
    closeSection();
    setTimeout(() => {
      isTransitioning.current = false;
      if (hadFocus) compactSearchRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    }, 400);
  }

  // 홈: 스크롤 위치 기반 자동 전환
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

  // 전환 시 FLIP 모프 실행
  useLayoutEffect(() => {
    if (scrolled) {
      runFlip(compactSearchRef.current, searchFlipSourceRect.current, "");
    } else {
      runFlip(searchBarRef.current, searchFlipSourceRect.current, "");
    }
  }, [scrolled]);

  // 목록 페이지에서 확장된 검색바: 바깥 클릭·스크롤·Escape 시 압축 바로 복귀.
  // mousedown은 캡처 단계로 등록한다 — 버블 단계에 두면 섹션 팝업의 바깥클릭 핸들러가
  // 먼저 실행되며 상태를 바꾸고, 리스너 사이 마이크로태스크에서 React가 이 이펙트를
  // 재실행하면서 이 리스너가 같은 이벤트 디스패치 중에 제거(=스킵)되기 때문.
  useEffect(() => {
    if (!forceScrolled || scrolled) return;
    const onMouseDown = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        collapseToCompact();
      }
    };
    // Tab으로 검색바 밖(본문)으로 나가면 바깥 클릭과 똑같이 접는다
    const onFocusIn = (e: FocusEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        collapseToCompact();
      }
    };
    const onScroll = () => collapseToCompact();
    const onKeyDown = (e: KeyboardEvent) => {
      // 섹션 팝업이 열려있으면 그쪽 Escape 핸들러가 먼저 팝업만 닫도록 양보
      if (e.key === "Escape" && !activeSection) collapseToCompact();
    };
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceScrolled, scrolled, activeSection]);

  return {
    scrolled,
    compactSearchRef,
    expandFromCompact,
    collapseToCompact,
  };
}
