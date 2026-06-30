"use client";

import Header from "@/components/common/Header";
import RoomSection from "@/components/home/RoomSection";

const busanRooms = [
  { id: "1", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", location: "부산 · 해운대", date: "6월 15일~20일", price: 1750000, rating: 4.92, isGuestFavorite: true },
  { id: "2", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400", location: "부산 · 광안리", date: "6월 10일~15일", price: 900000, rating: 4.87, isGuestFavorite: true },
  { id: "3", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", location: "부산 · 남포동", date: "6월 20일~25일", price: 600000, rating: 4.75, isGuestFavorite: false },
  { id: "4", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400", location: "부산 · 기장", date: "7월 1일~5일", price: 1680000, rating: 4.95, isGuestFavorite: true },
  { id: "5", image: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=400", location: "부산 · 수영구", date: "7월 5일~10일", price: 490000, rating: 4.68, isGuestFavorite: false },
  { id: "6", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", location: "부산 · 동래", date: "7월 8일~12일", price: 540000, rating: 4.71, isGuestFavorite: false },
  { id: "7", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", location: "부산 · 송도", date: "7월 12일~16일", price: 660000, rating: 4.82, isGuestFavorite: false },
  { id: "b8", image: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=400", location: "부산 · 영도", date: "7월 15일~19일", price: 780000, rating: 4.79, isGuestFavorite: false },
];

const seoulRooms = [
  { id: "8", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", location: "서울 · 마포구", date: "6월 15일~20일", price: 875000, rating: 4.88, isGuestFavorite: false },
  { id: "9", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", location: "서울 · 성수동", date: "6월 18일~22일", price: 380000, rating: 4.72, isGuestFavorite: true },
  { id: "10", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", location: "서울 · 강남", date: "6월 25일~30일", price: 1050000, rating: 4.80, isGuestFavorite: false },
  { id: "11", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", location: "서울 · 이태원", date: "7월 3일~7일", price: 620000, rating: 4.65, isGuestFavorite: true },
  { id: "12", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400", location: "서울 · 홍대", date: "7월 6일~10일", price: 352000, rating: 4.60, isGuestFavorite: false },
  { id: "13", image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400", location: "서울 · 북촌", date: "7월 10일~14일", price: 920000, rating: 4.93, isGuestFavorite: true },
  { id: "14", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400", location: "서울 · 연남동", date: "7월 14일~18일", price: 448000, rating: 4.74, isGuestFavorite: false },
  { id: "s8", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", location: "서울 · 용산구", date: "7월 18일~22일", price: 710000, rating: 4.81, isGuestFavorite: false },
];

const jejuRooms = [
  { id: "15", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400", location: "제주 · 애월", date: "6월 20일~25일", price: 1400000, rating: 4.97, isGuestFavorite: true },
  { id: "16", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400", location: "제주 · 서귀포", date: "7월 5일~10일", price: 975000, rating: 4.90, isGuestFavorite: false },
  { id: "17", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400", location: "제주 · 함덕", date: "7월 10일~15일", price: 825000, rating: 4.83, isGuestFavorite: true },
  { id: "18", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400", location: "제주 · 성산", date: "7월 15일~20일", price: 725000, rating: 4.78, isGuestFavorite: false },
  { id: "19", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400", location: "제주 · 중문", date: "7월 18일~22일", price: 1280000, rating: 4.85, isGuestFavorite: true },
  { id: "20", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", location: "제주 · 한림", date: "7월 20일~25일", price: 890000, rating: 4.76, isGuestFavorite: false },
  { id: "21", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", location: "제주 · 구좌", date: "7월 25일~30일", price: 625000, rating: 4.69, isGuestFavorite: false },
  { id: "j8", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400", location: "제주 · 제주시", date: "7월 28일~8월 2일", price: 540000, rating: 4.72, isGuestFavorite: false },
];

export default function HomePage() {
  return (
    <div>
      <Header />
      <main style={{ paddingTop: "185px" }}>
        <RoomSection title="광안리해수욕장의 인기 숙소" href="/rooms?location=부산" rooms={busanRooms} />
        <RoomSection title="서울 인기 숙소" href="/rooms?location=서울" rooms={seoulRooms} />
        <RoomSection title="제주도 추천 숙소" href="/rooms?location=제주" rooms={jejuRooms} />
      </main>
    </div>
  );
}
