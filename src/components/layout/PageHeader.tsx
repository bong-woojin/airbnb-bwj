"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import type { SearchLabels } from "@/components/common/Header/SearchBar/CompactSearchBar";
import { homeTabHref } from "@/lib/tabs";

interface PageHeaderProps {
  // 현재 탭 — 서버가 URL(홈은 ?tab=, 목록/상세는 경로)에서 정해 내려준다
  activeTab?: number;
  // true(기본): 목록/상세 — 압축 바 고정, 클릭하면 오버레이로 확장.
  // false: 홈 — 스크롤 위치에 따라 확장/압축 자동 전환.
  forceScrolled?: boolean;
  searchLabels?: SearchLabels;
  children: ReactNode;
}

// Header + 본문 래퍼. 홈과 목록/상세 페이지가 공유하는 클라이언트 경계다 —
// 페이지(서버 컴포넌트)는 데이터를 골라 children으로 넘기고, 여기서는 헤더 인터랙션과
// 헤더 높이 → 본문 padding 동기화만 맡는다. 탭을 누르면 어느 페이지에서든 /?tab=… 로 이동한다.
export default function PageHeader({ activeTab = 0, forceScrolled = true, searchLabels, children }: PageHeaderProps) {
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
      />
      <main style={{ paddingTop: `${headerHeight}px` }}>{children}</main>
    </div>
  );
}
