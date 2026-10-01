"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import type { SearchLabels } from "@/components/common/Header/SearchBar/CompactSearchBar";
import { homeTabHref } from "@/lib/tabs";
import MobileTabBar from "./MobileTabBar";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  // 현재 탭 — 서버가 URL(홈은 ?tab=, 목록/상세는 경로)에서 정해 내려준다
  activeTab?: number;
  // true(기본): 목록/상세 — 압축 바 고정, 클릭하면 오버레이로 확장.
  // false: 홈 — 스크롤 위치에 따라 확장/압축 자동 전환.
  forceScrolled?: boolean;
  searchLabels?: SearchLabels;
  // 모바일(743px 이하) 레이아웃: "default"는 헤더 + 하단 탭바(홈·목록),
  // "detail"은 헤더·탭바 없이 본문이 화면 맨 위부터 (상세 — 갤러리 위 버튼과 하단 예약 바가 대신한다)
  mobileLayout?: "default" | "detail";
  children: ReactNode;
}

// Header + 본문 래퍼. 홈과 목록/상세 페이지가 공유하는 클라이언트 경계다 —
// 페이지(서버 컴포넌트)는 데이터를 골라 children으로 넘기고, 여기서는 헤더 인터랙션과
// 헤더 높이 → 본문 padding 동기화만 맡는다. 탭을 누르면 어느 페이지에서든 /?tab=… 로 이동한다.
export default function PageHeader({
  activeTab = 0,
  forceScrolled = true,
  searchLabels,
  mobileLayout = "default",
  children,
}: PageHeaderProps) {
  const router = useRouter();
  // 탭 표시는 클릭 즉시 바뀌어야 하므로(비디오 아이콘 재생) 로컬 state로 먼저 반영하고,
  // URL에서 온 activeTab이 바뀌면(이동 완료, 뒤로가기) 그 값으로 맞춘다 — 렌더 중 조정 패턴.
  const [shownTab, setShownTab] = useState(activeTab);
  const [syncedTab, setSyncedTab] = useState(activeTab);
  if (activeTab !== syncedTab) {
    setSyncedTab(activeTab);
    setShownTab(activeTab);
  }
  const [headerHeight, setHeaderHeight] = useState(210.8);
  // 목록 페이지에서 검색바가 오버레이로 확장 중일 때는 헤더 높이 변화를 본문 padding에 반영하지 않는다
  // (실서비스처럼 본문은 고정, 검색바만 위에 얹히는 형태)
  const searchOpenRef = useRef(false);

  return (
    <div>
      <Header
        activeTab={shownTab}
        onTabChange={(i) => {
          setShownTab(i);
          router.push(homeTabHref(i));
        }}
        onHeightChange={(h) => {
          if (!searchOpenRef.current) setHeaderHeight(h);
        }}
        onSearchOpenChange={
          forceScrolled
            ? (open) => {
                searchOpenRef.current = open;
              }
            : undefined
        }
        forceScrolled={forceScrolled}
        searchLabels={searchLabels}
        mobileHidden={mobileLayout === "detail"}
      />
      {/* --header-h: 본문에서 헤더 아래 영역을 계산할 때(목록의 모바일 지도 등) 쓰는 실측 헤더 높이 */}
      <main
        className={mobileLayout === "default" ? styles.withTabBar : undefined}
        style={{ paddingTop: `${headerHeight}px`, ["--header-h" as string]: `${headerHeight}px` }}
      >
        {children}
      </main>
      {mobileLayout === "default" && <MobileTabBar />}
    </div>
  );
}
