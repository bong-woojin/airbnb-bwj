# Airbnb Clone

에어비앤비를 클론한 리액트 학습 프로젝트입니다. 홈 → 검색 → 목록 → 상세로 이어지는 핵심 사용자 흐름을 실제 서비스에 가깝게 구현하는 것을 목표로 합니다.

## 기술 스택

- **Next.js 16** (App Router, React Server Components)
- **React 19** + TypeScript
- **Redux Toolkit** — 위시리스트 상태 관리 (localStorage 영속화)
- **CSS Modules** — 컴포넌트 단위 스타일
- **Vitest** — 단위 테스트

## 주요 기능

### 홈
- 숙소/체험/서비스 탭 전환 (탭 아이콘 비디오 애니메이션)
- 도시·카테고리별 카드 캐러셀 (반응형 노출 개수, 페이지 단위 이동)
- 스크롤 시 검색바가 압축 바로 변형 (FLIP 애니메이션 + 콘텐츠 페이드)

### 검색
- 여행지(도시) / 날짜(캘린더 범위) / 게스트 수 선택 → URL 파라미터 기반 검색
- 검색 결과: 좌측 카드 목록 + 우측 고정 지도 레이아웃
- 날짜 필터 — 선택 기간이 숙소 가능 기간에 포함되는 숙소만 노출
- 결과 페이지에서 압축 바 클릭으로 재검색 (세그먼트 클릭 시 해당 섹션 바로 열림)

### 상세
- 숙소: 이미지 갤러리, 소개(더보기 모달), 숙박 장소 사진, 예약 카드(체크인/체크아웃 캘린더 + 게스트), 편의시설 모달, 위치 지도
- 체험/서비스: 같은 부품을 카테고리에 맞게 재조립 (1인당 가격, 단일 날짜 선택)
- 위시리스트(찜) — 새로고침해도 유지
- 공유하기 — 링크 클립보드 복사

### 접근성
- 모달: Escape 닫기 / 배경 스크롤 잠금 / 포커스 트랩 / 포커스 복귀
- 팝업류 Escape 닫기 (계층적 — 팝업 먼저, 그다음 검색바)

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
```

## 테스트

```bash
npm test           # 단위 테스트 1회 실행
npm run test:watch # 파일 변경 감지 모드
```

날짜 파싱/검색 필터 판정(`src/lib/dates.ts`), 위시리스트 리듀서를 커버합니다.

## 구조

```
src/
├── app/                  # 라우트 (홈, /rooms, /experiences, /services + 각 상세)
├── components/
│   ├── common/           # Header, SearchBar, CalendarMonth, GuestCounter 등 공용
│   ├── home/             # RoomCard, RoomSection (캐러셀)
│   ├── listing/          # ListingResults (목록 + 지도)
│   ├── detail/           # 상세 섹션들, BookingCard, Modal
│   └── layout/           # PageHeader (목록/상세용 헤더 래퍼)
├── data/                 # 목 데이터 (숙소/체험/서비스)
├── hooks/                # useWishlist, useModalBehavior
├── lib/                  # 날짜 유틸 (+ 테스트)
└── store/                # Redux (위시리스트)
```

> 참고: 데이터는 전부 목(mock)이며, 예약/결제 등 백엔드 연동은 범위에서 제외했습니다.
