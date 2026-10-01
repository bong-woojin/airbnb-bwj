@AGENTS.md

# Airbnb Clone 프로젝트 가이드

에어비앤비 UI를 클론한 Next.js 학습/포트폴리오 프로젝트. 숙소·체험·서비스 3개 카테고리의 홈/목록/상세 페이지와 실제 에어비앤비 수준의 검색바 인터랙션을 구현했다.

## 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16.2.7 (App Router) | **주의: 학습 데이터와 다른 버전 — `node_modules/next/dist/docs/` 문서 먼저 확인** |
| UI | React 19.2.4 | Server Components + Client Components 혼용 |
| 상태관리 | Redux Toolkit 2 + react-redux 9 | 전역 상태는 위시리스트(찜)만 |
| 스타일 | CSS Modules | 별도 UI 라이브러리/Tailwind 없음, 애니메이션도 순수 CSS + 인라인 스타일 |
| 테스트 | Vitest 4 | `src/**/*.test.ts`, `@` → `src` 별칭은 vitest.config.ts에서 별도 설정 |
| 언어 | TypeScript 5 | path alias `@/*` → `src/*` |

## 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
npm test           # Vitest 단발 실행
npm run test:watch # Vitest watch
```

## 프로젝트 구조

```
src/
├── app/                      # App Router 라우트
│   ├── layout.tsx            # 루트 레이아웃 (lang=ko, Providers 래핑)
│   ├── providers.tsx         # Redux Provider + 위시리스트 localStorage 동기화
│   ├── page.tsx              # 홈 (서버) — ?tab= 으로 탭별 RoomSection 3개씩
│   ├── rooms/                # 숙소 목록(검색 필터) + [id] 상세
│   ├── experiences/          # 체험 목록(category 필터) + [id] 상세
│   └── services/             # 서비스 목록(category/location 필터) + [id] 상세
├── components/
│   ├── common/
│   │   ├── Header/           # 로고 + 탭(비디오 아이콘) + 검색바
│   │   │   └── SearchBar/    # ★ 가장 복잡한 부분 — 아래 "검색바 아키텍처" 참고
│   │   ├── CalendarMonth/    # 달력 한 달 렌더링 (CalendarPopup에서 2개월 표시)
│   │   └── GuestCounter/     # 인원 +/- 카운터
│   ├── home/                 # RoomSection(가로 캐러셀), RoomCard(공용 카드)
│   ├── listing/              # ListingResults — 좌측 카드 그리드 + 우측 고정 Google 지도 iframe
│   ├── detail/               # 상세페이지 섹션들(갤러리/소개/설명/편의시설/지도/예약카드/모달)
│   └── layout/PageHeader.tsx # 홈·목록·상세 공용 Header 래퍼 (탭 클릭 → /?tab=…)
├── data/                     # 정적 목업 데이터 (rooms/experiences/services + ListingItem 타입)
├── hooks/                    # useAppDispatch(타입드 훅), useWishlist, useModalBehavior
├── lib/dates.ts              # 오늘(KST)·오프셋 → 날짜 계산, 라벨/YMD 포맷 유틸 (+ 테스트)
└── store/                    # Redux store + wishlistSlice (wishlistedIds)
```

## 아키텍처 & 데이터 흐름

- **DB/API 없음**: 모든 데이터는 `src/data/*.ts`의 정적 배열(`ListingItem[]`). 목록 페이지는 **서버 컴포넌트**에서 `searchParams`를 읽어 이 배열을 필터링한다 (Next.js 16이라 `params`/`searchParams`는 **Promise — 반드시 await**).
- **검색 흐름**: 검색바(클라이언트)에서 조건 선택 → `URLSearchParams`로 조립해 `router.push("/<탭 경로>?location=…&checkin=…&checkout=…&guests=…")` (탭 경로는 `lib/tabs.ts`: /rooms·/experiences·/services) → 서버 컴포넌트가 파라미터로 필터링. 홈 탭도 `/?tab=rooms|experiences|services`. **URL이 곧 검색 상태**라 새로고침/공유가 그대로 동작한다. 단 체험/서비스 데이터에는 날짜·인원 필드가 없어 `/experiences`는 검색 파라미터를 무시하고, `/services`는 `location`(도시명 정확 일치)만 쓴다.
- **날짜 필터**: 숙소의 예약 가능 기간은 라벨이 아니라 오프셋(`startOffset`일 뒤부터 `nights`박)으로 저장된다. `lib/dates.ts`가 오늘(KST 자정 기준) + 오프셋으로 실제 Date 범위를 계산하고, 검색한 체크인~체크아웃이 그 범위에 완전히 포함되는 항목만 노출. 카드 라벨도 렌더링 시점에 같은 방식으로 계산한다.
- **"오늘"은 반드시 `getToday()`로**: 서버(UTC)와 브라우저 타임존이 달라도 같은 날짜가 나오도록 KST로 정규화돼 있다. `new Date()`로 직접 오늘을 구하면 hydration mismatch가 난다. 날짜를 그리는 페이지는 정적 생성되면 빌드 날짜가 HTML에 박히므로 요청 시점 렌더링이어야 한다(홈은 `connection()` 사용).
- **서버/클라이언트 경계**: 페이지(라우트, 홈 포함)는 전부 서버 컴포넌트로 데이터를 고르고/필터링해 props로 넘긴다. 인터랙션이 필요한 것들(PageHeader·Header·SearchBar, RoomSection·RoomCard 캐러셀, ListingGrid, ItemDetail)만 `"use client"`. **클라이언트 컴포넌트에서 `@/data/*`를 import하지 말 것** — 목업 데이터와 생성기가 브라우저 번들에 들어간다(타입 import는 무방).
- **전역 상태는 최소화**: Redux에는 `wishlistedIds: string[]` 하나만 있다. `providers.tsx`가 마운트 시 localStorage에서 복원하고 `store.subscribe`로 변경 시마다 저장한다. 나머지 UI 상태는 전부 컴포넌트 로컬 state.

## 검색바 아키텍처 (`components/common/Header/SearchBar/`)

이 프로젝트에서 가장 복잡하고 발표 가치가 높은 부분. 두 개의 커스텀 훅으로 관심사를 분리했다:

- **`useSectionPopup.ts`** — 섹션(여행지/날짜/게스트) 활성 상태 + 슬라이딩 필 위치 관리. 바깥 클릭·Escape로 닫기.
- **`useSearchTransition.ts`** — 확장 검색바 ↔ 압축 바 전환 관리.
  - 홈: 스크롤 위치(내려가면 80px, 올라오면 40px — 히스테리시스로 떨림 방지) 기반 자동 전환.
  - 목록/상세 페이지(`forceScrolled`): 압축 바 고정, 클릭하면 오버레이로 확장, 바깥 클릭·스크롤·Escape로 복귀.
- **`flip.ts`** — FLIP(First-Last-Invert-Play) 애니메이션 유틸. 두 검색바는 실제로는 서로 다른 DOM인데, 전환 시 출발 위치/크기에서 도착 위치/크기로 transform(translate+scale)을 걸어 하나가 morphing하는 것처럼 보이게 한다. 내부 콘텐츠는 scale 왜곡이 보이지 않도록 숨겼다가 페이드인.
- **팝업은 컨테이너 1개 재사용**: 섹션 전환 시 팝업을 새로 열지 않고 `left`/`width` 인라인 스타일 트랜지션으로 미끄러지듯 이동. 내부 콘텐츠는 `key={activeSection}`으로 리마운트시켜 좌→우/우→좌 방향에 맞는 슬라이드 애니메이션 적용.
- **검색 조건은 SearchBar가 소유**: 여행지(입력 텍스트·선택 도시)·날짜·게스트 state는 전부 `index.tsx`에 있고 팝업은 `value`/`onChange`만 받는 controlled 컴포넌트다. 팝업은 섹션 전환 때마다 언마운트되므로 선택값을 팝업 안에 두면 다시 열 때 사라진다. 팝업에는 hover·보고 있는 달 같은 보기 상태만 남긴다. 타입·전이 로직은 `searchState.ts`(+ 테스트). 자식이 `useEffect`로 부모에 값을 보고하는 패턴은 쓰지 않는다.
- **탭 연동**: 서비스 탭(activeTab === 2)에서는 세 번째 섹션이 "여행자" 대신 "서비스 유형"으로 바뀐다.

이벤트 리스너 순서 이슈(캡처 단계 등록 이유 등)는 코드 주석에 이미 설명돼 있으니 수정 전에 주석을 먼저 읽을 것.

## 그 외 동적인 부분 (발표 포인트)

- **헤더 탭 비디오 아이콘**: 에어비앤비 실제 에셋(hevc/webm) 사용. 첫 로드 시 180ms 간격 스태거 재생, 탭 전환 시 활성 탭만 재생하고 나머지는 정지·리셋 (`Header/index.tsx`).
- **헤더 높이 → 본문 padding 동기화**: 검색바 확장/축소로 헤더 높이가 변하므로 `ResizeObserver`로 측정해 `<main>` paddingTop에 반영. 단 목록 페이지에서 검색바가 오버레이로 열릴 땐 본문을 밀지 않음 (`PageHeader.tsx`).
- **모달 접근성 3종 세트** (`hooks/useModalBehavior.ts`): Escape 닫기 + body 스크롤 잠금 + 포커스 트랩(Tab 순환, 닫히면 열었던 요소로 포커스 복귀).
- **위시리스트(찜)**: 카드/상세 어디서든 토글 → Redux → localStorage 영속화. 새로고침해도 유지.
- **공유하기**: 상세페이지에서 현재 URL 클립보드 복사 + "링크 복사됨!" 2초 피드백 (`ItemDetail.tsx`).
- **목록 페이지 지도**: 우측 절반에 Google Maps embed iframe을 sticky로 고정, 검색 지역에 따라 query/zoom 변경 (`ListingResults.tsx`).
- **상세페이지 콘텐츠 오버라이드**: 기본 콘텐츠 + `roomContent.ts`의 `ROOM_OVERRIDES[id]`로 숙소별 차별화(호스트명/설명/부제목 등).
- **이미지 최적화**: `next/image` + `next.config.ts`의 remotePatterns(unsplash, muscache, picsum). 첫 화면 카드에는 `priority` 부여.

## 컨벤션

- 스타일은 컴포넌트 옆 `*.module.css` 코로케이션. 동적 값(팝업 위치, 필 위치 등)만 인라인 스타일.
- 컴포넌트 디렉토리 패턴: `ComponentName/index.tsx` + `ComponentName.module.css`.
- 주석은 한국어로, "왜"를 설명하는 주석 위주 (이벤트 순서, 브라우저 동작 회피 등).
- UI 문구는 전부 한국어.
- 숙소/체험/서비스가 같은 컴포넌트(`RoomCard`, `RoomSection`, `ListingResults`, `ItemDetail`)를 공유하고 `perPerson`(1인당 가격 표시), `basePath`, `categoryLabel` 같은 props로 분기한다.

## 새 기능 추가 시

- **새 목록 항목**: `src/data/*.ts` 배열에 추가만 하면 홈/목록/상세에 모두 반영 (상세는 `allRooms`/`allExperiences`/`allServices`에서 id로 조회).
- **새 카테고리 페이지**: `app/<name>/page.tsx`(서버, searchParams 필터) + `app/<name>/[id]/page.tsx` 패턴을 따르고 `PageHeader` + `ListingResults` / `ItemDetail` 재사용.
- **순수 로직**은 `lib/`에 두고 Vitest 테스트를 함께 작성 (`dates.test.ts`, `wishlistSlice.test.ts` 참고).
- Next.js API 사용 전 `node_modules/next/dist/docs/` 문서 확인 — 이 버전은 학습 데이터와 다를 수 있음.
