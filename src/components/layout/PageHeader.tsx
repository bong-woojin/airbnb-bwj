"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";

interface PageHeaderProps {
  initialTab?: number;
  children: ReactNode;
}

// 홈페이지 밖(목록/상세 페이지)에서 쓰는 Header 래퍼.
// 홈페이지는 탭에 따라 보여줄 콘텐츠가 달라지지만, 여기서는 탭을 눌러도 콘텐츠가 바뀌지 않고
// 그냥 홈으로 돌아가는 게 자연스러워서 별도로 둔다.
export default function PageHeader({ initialTab = 0, children }: PageHeaderProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [headerHeight, setHeaderHeight] = useState(210.8);

  return (
    <div>
      <Header
        activeTab={activeTab}
        onTabChange={(i) => {
          setActiveTab(i);
          router.push("/");
        }}
        onHeightChange={setHeaderHeight}
        forceScrolled
      />
      <main style={{ paddingTop: `${headerHeight}px` }}>{children}</main>
    </div>
  );
}
