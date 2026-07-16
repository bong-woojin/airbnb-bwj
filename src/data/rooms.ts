import type { ListingItem } from "./types";
import { generateRooms } from "./generatedRooms";

export const busanRooms: ListingItem[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", location: "부산 · 해운대", date: "7월 15일~20일", price: 1750000, rating: 4.92, tag: "게스트 선호", maxGuests: 6 },
  { id: "2", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400", location: "부산 · 광안리", date: "7월 18일~23일", price: 900000, rating: 4.87, tag: "게스트 선호", maxGuests: 4 },
  { id: "3", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", location: "부산 · 남포동", date: "7월 21일~26일", price: 600000, rating: 4.75, maxGuests: 2 },
  { id: "4", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400", location: "부산 · 기장", date: "7월 25일~30일", price: 1680000, rating: 4.95, tag: "게스트 선호", maxGuests: 8 },
  { id: "5", image: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=400", location: "부산 · 수영구", date: "7월 28일~8월 2일", price: 490000, rating: 4.68, maxGuests: 2 },
  { id: "6", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", location: "부산 · 동래", date: "8월 1일~6일", price: 540000, rating: 4.71, maxGuests: 3 },
  { id: "7", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", location: "부산 · 송도", date: "8월 5일~10일", price: 660000, rating: 4.82, maxGuests: 4 },
  { id: "b8", image: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=400", location: "부산 · 영도", date: "8월 9일~14일", price: 780000, rating: 4.79, maxGuests: 4 },
];

export const seoulRooms: ListingItem[] = [
  { id: "8", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", location: "서울 · 마포구", date: "7월 16일~21일", price: 875000, rating: 4.88, maxGuests: 5 },
  { id: "9", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", location: "서울 · 성수동", date: "7월 20일~25일", price: 380000, rating: 4.72, tag: "게스트 선호", maxGuests: 2 },
  { id: "10", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", location: "서울 · 강남", date: "7월 24일~29일", price: 1050000, rating: 4.80, maxGuests: 6 },
  { id: "11", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", location: "서울 · 이태원", date: "7월 29일~8월 3일", price: 620000, rating: 4.65, tag: "게스트 선호", maxGuests: 4 },
  { id: "12", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400", location: "서울 · 홍대", date: "8월 2일~7일", price: 352000, rating: 4.60, maxGuests: 2 },
  { id: "13", image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400", location: "서울 · 북촌", date: "8월 7일~12일", price: 920000, rating: 4.93, tag: "게스트 선호", maxGuests: 6 },
  { id: "14", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400", location: "서울 · 연남동", date: "8월 12일~17일", price: 448000, rating: 4.74, maxGuests: 3 },
  { id: "s8", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", location: "서울 · 용산구", date: "8월 16일~21일", price: 710000, rating: 4.81, maxGuests: 4 },
];

export const jejuRooms: ListingItem[] = [
  { id: "15", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400", location: "제주 · 애월", date: "7월 17일~22일", price: 1400000, rating: 4.97, tag: "게스트 선호", maxGuests: 8 },
  { id: "16", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400", location: "제주 · 서귀포", date: "7월 22일~27일", price: 975000, rating: 4.90, maxGuests: 6 },
  { id: "17", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400", location: "제주 · 함덕", date: "7월 26일~31일", price: 825000, rating: 4.83, tag: "게스트 선호", maxGuests: 4 },
  { id: "18", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400", location: "제주 · 성산", date: "8월 3일~8일", price: 725000, rating: 4.78, maxGuests: 4 },
  { id: "19", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400", location: "제주 · 중문", date: "8월 10일~15일", price: 1280000, rating: 4.85, tag: "게스트 선호", maxGuests: 7 },
  { id: "20", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", location: "제주 · 한림", date: "8월 15일~20일", price: 890000, rating: 4.76, maxGuests: 5 },
  { id: "21", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", location: "제주 · 구좌", date: "8월 21일~26일", price: 625000, rating: 4.69, maxGuests: 3 },
  { id: "j8", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400", location: "제주 · 제주시", date: "8월 26일~31일", price: 540000, rating: 4.72, maxGuests: 2 },
];

export const roomsByCity: Record<string, ListingItem[]> = {
  "부산": busanRooms,
  "서울": seoulRooms,
  "제주": jejuRooms,
};

// 손으로 만든 24개 (상세 오버라이드 콘텐츠가 붙어 있음)
const curatedRooms: ListingItem[] = [...busanRooms, ...seoulRooms, ...jejuRooms];

// + 규칙으로 생성한 126개 = 총 150개. 이미지 풀은 위 숙소들의 사진을 순환 재사용한다.
export const allRooms: ListingItem[] = [
  ...curatedRooms,
  ...generateRooms(126, curatedRooms.map((room) => room.image)),
];
