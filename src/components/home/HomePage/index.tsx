"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import RoomSection from "@/components/home/RoomSection";
import { busanRooms, seoulRooms, jejuRooms } from "@/data/rooms";
import {
  todayGapyeongExperiences,
  tomorrowGapyeongExperiences,
  weekendGapyeongExperiences,
} from "@/data/experiences";
import { photoServices, busanServices, seoulServices } from "@/data/services";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(210.8);

  return (
    <div>
      <Header activeTab={activeTab} onTabChange={setActiveTab} onHeightChange={setHeaderHeight} />
      <main style={{ paddingTop: `${headerHeight}px` }}>
        {activeTab === 0 && (
          <>
            <RoomSection title="광안리해수욕장의 인기 숙소" href="/rooms?location=부산" basePath="/rooms" rooms={busanRooms} priority />
            <RoomSection title="서울 인기 숙소" href="/rooms?location=서울" basePath="/rooms" rooms={seoulRooms} />
            <RoomSection title="제주도 추천 숙소" href="/rooms?location=제주" basePath="/rooms" rooms={jejuRooms} />
          </>
        )}
        {activeTab === 1 && (
          <>
            <RoomSection title="오늘 가평군에서 진행되는 체험" href="/experiences?category=gapyeong-today" basePath="/experiences" rooms={todayGapyeongExperiences} priority perPerson />
            <RoomSection title="내일 가평군에서 진행되는 체험" href="/experiences?category=gapyeong-tomorrow" basePath="/experiences" rooms={tomorrowGapyeongExperiences} perPerson />
            <RoomSection title="이번 주말에 진행되는 체험" href="/experiences?category=weekend" basePath="/experiences" rooms={weekendGapyeongExperiences} perPerson />
          </>
        )}
        {activeTab === 2 && (
          <>
            <RoomSection title="사진 촬영" href="/services?category=photo" basePath="/services" rooms={photoServices} priority perPerson />
            <RoomSection title="부산의 서비스" href="/services?location=부산" basePath="/services" rooms={busanServices} perPerson />
            <RoomSection title="서울의 서비스" href="/services?location=서울" basePath="/services" rooms={seoulServices} perPerson />
          </>
        )}
      </main>
    </div>
  );
}
