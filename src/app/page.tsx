"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import RoomSection from "@/components/home/RoomSection";

const busanRooms = [
  { id: "1", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", location: "부산 · 해운대", date: "6월 15일~20일", price: 1750000, rating: 4.92, tag: "게스트 선호" },
  { id: "2", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400", location: "부산 · 광안리", date: "6월 10일~15일", price: 900000, rating: 4.87, tag: "게스트 선호" },
  { id: "3", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", location: "부산 · 남포동", date: "6월 20일~25일", price: 600000, rating: 4.75 },
  { id: "4", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400", location: "부산 · 기장", date: "7월 1일~5일", price: 1680000, rating: 4.95, tag: "게스트 선호" },
  { id: "5", image: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=400", location: "부산 · 수영구", date: "7월 5일~10일", price: 490000, rating: 4.68 },
  { id: "6", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", location: "부산 · 동래", date: "7월 8일~12일", price: 540000, rating: 4.71 },
  { id: "7", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", location: "부산 · 송도", date: "7월 12일~16일", price: 660000, rating: 4.82 },
  { id: "b8", image: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=400", location: "부산 · 영도", date: "7월 15일~19일", price: 780000, rating: 4.79 },
];

const seoulRooms = [
  { id: "8", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", location: "서울 · 마포구", date: "6월 15일~20일", price: 875000, rating: 4.88 },
  { id: "9", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", location: "서울 · 성수동", date: "6월 18일~22일", price: 380000, rating: 4.72, tag: "게스트 선호" },
  { id: "10", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", location: "서울 · 강남", date: "6월 25일~30일", price: 1050000, rating: 4.80 },
  { id: "11", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", location: "서울 · 이태원", date: "7월 3일~7일", price: 620000, rating: 4.65, tag: "게스트 선호" },
  { id: "12", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400", location: "서울 · 홍대", date: "7월 6일~10일", price: 352000, rating: 4.60 },
  { id: "13", image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400", location: "서울 · 북촌", date: "7월 10일~14일", price: 920000, rating: 4.93, tag: "게스트 선호" },
  { id: "14", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400", location: "서울 · 연남동", date: "7월 14일~18일", price: 448000, rating: 4.74 },
  { id: "s8", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", location: "서울 · 용산구", date: "7월 18일~22일", price: 710000, rating: 4.81 },
];

const jejuRooms = [
  { id: "15", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400", location: "제주 · 애월", date: "6월 20일~25일", price: 1400000, rating: 4.97, tag: "게스트 선호" },
  { id: "16", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400", location: "제주 · 서귀포", date: "7월 5일~10일", price: 975000, rating: 4.90 },
  { id: "17", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400", location: "제주 · 함덕", date: "7월 10일~15일", price: 825000, rating: 4.83, tag: "게스트 선호" },
  { id: "18", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400", location: "제주 · 성산", date: "7월 15일~20일", price: 725000, rating: 4.78 },
  { id: "19", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400", location: "제주 · 중문", date: "7월 18일~22일", price: 1280000, rating: 4.85, tag: "게스트 선호" },
  { id: "20", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", location: "제주 · 한림", date: "7월 20일~25일", price: 890000, rating: 4.76 },
  { id: "21", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", location: "제주 · 구좌", date: "7월 25일~30일", price: 625000, rating: 4.69 },
  { id: "j8", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400", location: "제주 · 제주시", date: "7월 28일~8월 2일", price: 540000, rating: 4.72 },
];

const todayGapyeongExperiences = [
  { id: "eg1", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", location: "가평 남이섬 감성 산책 투어", price: 32000, rating: 4.89, tag: "오후 5:30" },
  { id: "eg2", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400", location: "가평 자라섬에서 카약 타기", price: 45000, rating: 4.85, tag: "오전 11시" },
  { id: "eg3", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", location: "아침고요수목원 가을 정원 투어", price: 28000, rating: 4.90, tag: "오전 10시" },
  { id: "eg4", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400", location: "쁘띠프랑스 감성 사진 스팟 투어", price: 20000, rating: 4.75, tag: "오후 12:30" },
  { id: "eg5", image: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=400", location: "가평 용추계곡 힐링 트레킹", price: 35000, rating: 4.82, tag: "오후 3시" },
  { id: "eg6", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", location: "유명산 자연휴양림 숲길 산책", price: 30000, rating: 4.88, tag: "오후 2:30" },
  { id: "eg7", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", location: "대성리 감성 캠핑 체험", price: 55000, rating: 4.93, tag: "오후 6시" },
  { id: "eg8", image: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=400", location: "청평호 스탠드업 패들보드 클래스", price: 48000, rating: 4.86, tag: "오후 7시" },
];

const tomorrowGapyeongExperiences = [
  { id: "eg9", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", location: "남이섬 자전거로 한 바퀴 돌기", price: 30000, rating: 4.87, tag: "오전 9:30" },
  { id: "eg10", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", location: "자라섬 노을 피크닉 투어", price: 40000, rating: 4.91, tag: "오후 7:30" },
  { id: "eg11", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", location: "아침고요수목원 야간 라이트 정원", price: 33000, rating: 4.94, tag: "오후 8시" },
  { id: "eg12", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", location: "쁘띠프랑스 미니어처 만들기 클래스", price: 25000, rating: 4.78, tag: "오후 1:30" },
  { id: "eg13", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400", location: "용추계곡에서 즐기는 여름 물놀이", price: 27000, rating: 4.80, tag: "오후 4:30" },
  { id: "eg14", image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400", location: "유명산 별빛 관측 투어", price: 52000, rating: 4.92, tag: "오전 11:30" },
  { id: "eg15", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400", location: "대성리에서 감성 필름 사진 찍기", price: 38000, rating: 4.85, tag: "오후 6:30" },
  { id: "eg16", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", location: "청평호 은빛 낚시 체험", price: 42000, rating: 4.83, tag: "오전 10:30" },
];

const weekendGapyeongExperiences = [
  { id: "eg17", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400", location: "남이섬 커플 자전거 데이트 코스", price: 36000, rating: 4.90, tag: "오후 1시" },
  { id: "eg18", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400", location: "자라섬 음악 캠핑 페스티벌 체험", price: 58000, rating: 4.95, tag: "오후 4시" },
  { id: "eg19", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400", location: "아침고요수목원 플라워 클래스", price: 34000, rating: 4.88, tag: "오전 11시" },
  { id: "eg20", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400", location: "쁘띠프랑스에서 감성 스냅 촬영", price: 30000, rating: 4.84, tag: "오후 12시" },
  { id: "eg21", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400", location: "용추계곡 가족 물놀이 나들이", price: 29000, rating: 4.79, tag: "오후 2시" },
  { id: "eg22", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", location: "유명산 주말 등산 가이드 투어", price: 50000, rating: 4.91, tag: "오전 9시" },
  { id: "eg23", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", location: "대성리 불멍 캠핑 나이트", price: 45000, rating: 4.93, tag: "오후 3:30" },
  { id: "eg24", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400", location: "청평호 선셋 요트 투어", price: 65000, rating: 4.96, tag: "오후 5시" },
];

const photoServices = [
  { id: "svp1", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", location: "서울에서 완성하는 나만의 웨딩 스냅 촬영", price: 300000, rating: 4.95, tag: "인기" },
  { id: "svp2", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400", location: "스튜디오 프로필 사진 촬영 서비스", price: 80000, rating: 4.87 },
  { id: "svp3", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", location: "온 가족이 함께하는 가족사진 촬영", price: 120000, rating: 4.90, tag: "인기" },
  { id: "svp4", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400", location: "반려동물과 함께하는 사진 촬영", price: 60000, rating: 4.82 },
  { id: "svp5", image: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=400", location: "성수에서 나만의 K-드라마 주인공 되기 – 필름감성 포토워크", price: 90000, rating: 5.00 },
  { id: "svp6", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", location: "빠르고 깔끔한 이력서 증명사진 촬영", price: 35000, rating: 4.75 },
  { id: "svp7", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", location: "제주에서 남기는 감성 여행 스냅", price: 150000, rating: 4.93, tag: "인기" },
  { id: "svp8", image: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=400", location: "특별한 날을 담는 돌잔치 출장 촬영", price: 200000, rating: 4.91 },
];

const busanServices = [
  { id: "svb1", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", location: "부산 홈 클리닝 방문 서비스", price: 42000, rating: 4.72 },
  { id: "svb2", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", location: "부산에서 완성하는 애슬레저 바디 – 1:1 퍼스널 트레이닝", price: 75000, rating: 4.90, tag: "인기" },
  { id: "svb3", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", location: "부산 홈 헤어 스타일링 출장 서비스", price: 55000, rating: 4.85 },
  { id: "svb4", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", location: "부산 셰프의 특별한 출장 요리", price: 140000, rating: 4.94, tag: "인기" },
  { id: "svb5", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400", location: "부산 홈 마사지 테라피 서비스", price: 68000, rating: 4.87 },
  { id: "svb6", image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400", location: "부산 반려동물 방문 돌봄 서비스", price: 32000, rating: 4.80 },
  { id: "svb7", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400", location: "부산 메이크업 아티스트 출장 서비스", price: 78000, rating: 4.92, tag: "인기" },
  { id: "svb8", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", location: "부산 홈 인테리어 컨설팅", price: 110000, rating: 4.76 },
];

const seoulServices = [
  { id: "svs1", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400", location: "서울에서 즐기는 명상 클래스", price: 28000, rating: 4.83 },
  { id: "svs2", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400", location: "1:1 맞춤 영양 상담 서비스", price: 52000, rating: 4.78 },
  { id: "svs3", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400", location: "서울 홈 발마사지 출장 서비스", price: 38000, rating: 4.86 },
  { id: "svs4", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400", location: "나를 위한 오늘의 룩 – 퍼스널 패션 스타일링", price: 95000, rating: 4.89, tag: "인기" },
  { id: "svs5", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400", location: "서울 홈스파 트리트먼트 서비스", price: 85000, rating: 4.91, tag: "인기" },
  { id: "svs6", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", location: "서울 네일아트 출장 서비스", price: 43000, rating: 4.74 },
  { id: "svs7", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", location: "1:1 맞춤 필라테스 클래스", price: 72000, rating: 4.93, tag: "인기" },
  { id: "svs8", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400", location: "서울 홈 클리닝 방문 서비스", price: 46000, rating: 4.71 },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{ paddingTop: "210.8px" }}>
        {activeTab === 0 && (
          <>
            <RoomSection title="광안리해수욕장의 인기 숙소" href="/rooms?location=부산" rooms={busanRooms} priority />
            <RoomSection title="서울 인기 숙소" href="/rooms?location=서울" rooms={seoulRooms} />
            <RoomSection title="제주도 추천 숙소" href="/rooms?location=제주" rooms={jejuRooms} />
          </>
        )}
        {activeTab === 1 && (
          <>
            <RoomSection title="오늘 가평군에서 진행되는 체험" href="/experiences?category=gapyeong-today" rooms={todayGapyeongExperiences} priority perPerson />
            <RoomSection title="내일 가평군에서 진행되는 체험" href="/experiences?category=gapyeong-tomorrow" rooms={tomorrowGapyeongExperiences} perPerson />
            <RoomSection title="이번 주말에 진행되는 체험" href="/experiences?category=weekend" rooms={weekendGapyeongExperiences} perPerson />
          </>
        )}
        {activeTab === 2 && (
          <>
            <RoomSection title="사진 촬영" href="/services?category=photo" rooms={photoServices} priority perPerson />
            <RoomSection title="부산의 서비스" href="/services?location=부산" rooms={busanServices} perPerson />
            <RoomSection title="서울의 서비스" href="/services?location=서울" rooms={seoulServices} perPerson />
          </>
        )}
      </main>
    </div>
  );
}
