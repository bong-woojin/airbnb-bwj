"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import type { SearchLabels } from "@/components/common/Header/SearchBar/CompactSearchBar";

interface PageHeaderProps {
  initialTab?: number;
  searchLabels?: SearchLabels;
  children: ReactNode;
}

// 홈페이지 밖(목록/상세 페이지)에서 쓰는 Header 래퍼.
// 홈페이지는 탭에 따라 보여줄 콘텐츠가 달라지지만, 여기서는 탭을 눌러도 콘텐츠가 바뀌지 않고
// 그냥 홈으로 돌아가는 게 자연스러워서 별도로 둔다.
export default function PageHeader({ initialTab = 0, searchLabels, children }: PageHeaderProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [headerHeight, setHeaderHeight] = useState(210.8);
  // 검색바가 오버레이로 확장 중일 때는 헤더 높이 변화를 본문 padding에 반영하지 않는다
  // (실서비스처럼 본문은 고정, 검색바만 위에 얹히는 형태)
  const searchOpenRef = useRef(false);

  return (
    <div>
      <Header
        activeTab={activeTab}
        onTabChange={(i) => {
          setActiveTab(i);
          router.push("/");
        }}
        onHeightChange={(h) => {
          if (!searchOpenRef.current) setHeaderHeight(h);
        }}
        onSearchOpenChange={(open) => {
          searchOpenRef.current = open;
        }}
        forceScrolled
        searchLabels={searchLabels}
      />
      <main style={{ paddingTop: `${headerHeight}px` }}>{children}</main>
    </div>
  );
}
