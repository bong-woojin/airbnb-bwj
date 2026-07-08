// 상세페이지에 표시되는 목(mock) 콘텐츠 모음.
// 실제 데이터에 없는 상세 정보(호스트, 편의시설, 소개글 등)는 여기서 관리한다.

export const HOST_NAME = "우진";
export const REVIEW_COUNT = 8;

export const HIGHLIGHTS = [
  {
    text: "상위 5% 숙소",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="5" />
        <path d="M9 12.5 7 21l5-3 5 3-2-8.5" />
      </svg>
    ),
  },
  {
    text: "부산역 근처",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    text: "여행 가방 보관 가능",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M4 13h16" />
      </svg>
    ),
  },
  {
    text: "편의성이 뛰어난 체크인 절차",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="4" />
        <path d="M11 11l9 9M17 15l2 2M14 18l2 2" />
      </svg>
    ),
  },
  {
    text: "세탁기 및 건조기",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <circle cx="12" cy="13" r="5" />
        <circle cx="8" cy="6" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    text: "에어컨",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12" />
      </svg>
    ),
  },
];

export const AMENITIES_PREVIEW = [
  { label: "해변으로 연결", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20c4-4 8-8 20-8"/><path d="M2 20c2-6 6-10 10-12"/><path d="M17 8l1-5 4 1-1 5"/></svg> },
  { label: "와이파이", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg> },
  { label: "세탁기", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><circle cx="7.5" cy="6.5" r="0.75" fill="currentColor" stroke="none"/><circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none"/></svg> },
  { label: "냉장고", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14"/><path d="M9 6v2"/><path d="M9 14v3"/></svg> },
  { label: "주방", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg> },
  { label: "TV", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8"/><path d="M12 18v2"/></svg> },
  { label: "에어컨", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="8" rx="2"/><path d="M7 16l-2 4"/><path d="M12 16v4"/><path d="M17 16l2 4"/><path d="M6 12v2"/><path d="M12 12v2"/><path d="M18 12v2"/></svg> },
  { label: "전자레인지", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><rect x="15" y="8" width="4" height="8" rx="1"/><circle cx="8" cy="12" r="3"/></svg> },
];

export const AMENITIES_SECTIONS = [
  {
    title: "욕실",
    items: [
      { label: "샴푸", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2h6l1 4H8L9 2z"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11h4"/></svg>, unavailable: false },
      { label: "컨디셔너", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2h6l1 4H8L9 2z"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/></svg>, unavailable: false },
      { label: "보디클렌저", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 3h10l2 4H5L7 3z"/><path d="M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/><path d="M9 12h6"/></svg>, unavailable: false },
      { label: "온수", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v4M4.93 5.93l2.83 2.83M2 12h4M4.93 18.07l2.83-2.83M12 22v-4M19.07 18.07l-2.83-2.83M22 12h-4M19.07 5.93l-2.83 2.83"/><circle cx="12" cy="12" r="3"/></svg>, unavailable: false },
    ],
  },
  {
    title: "침실 및 세탁 시설",
    items: [
      { label: "세탁기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/></svg>, unavailable: false },
      { label: "필수용품", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8a1 1 0 0 0-1 1v3h10V4a1 1 0 0 0-1-1z"/></svg>, unavailable: false },
      { label: "옷걸이", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="none"/><path d="M12 4v4L3 18h18L12 8"/></svg>, unavailable: false },
      { label: "침구", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"/><path d="M2 9h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z"/><path d="M12 9v11"/></svg>, unavailable: false },
      { label: "암막 커튼", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v2H3z"/><path d="M5 5v16"/><path d="M12 5v16"/><path d="M19 5v16"/></svg>, unavailable: false },
      { label: "의류 보관 공간", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>, unavailable: false },
    ],
  },
  {
    title: "엔터테인먼트",
    items: [
      { label: "TV", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/></svg>, unavailable: false },
    ],
  },
  {
    title: "냉난방",
    items: [
      { label: "에어컨", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="8" rx="2"/><path d="M7 16l-2 4M12 16v4M17 16l2 4M6 12v2M12 12v2M18 12v2"/></svg>, unavailable: false },
      { label: "난방", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c0 4-4 4-4 8a4 4 0 0 0 8 0c0-4-4-4-4-8z"/><path d="M9 22h6"/><path d="M12 18v4"/></svg>, unavailable: false },
    ],
  },
  {
    title: "숙소 안전",
    items: [
      { label: "화재경보기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>, unavailable: false },
      { label: "일산화탄소 경보기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>, unavailable: false },
      { label: "소화기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3h3v2H8z"/><path d="M10 5v2a4 4 0 0 1 4 4v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9a4 4 0 0 1 4-4z"/><path d="M11 3h4a1 1 0 0 1 1 1v1"/></svg>, unavailable: false },
      { label: "구급상자", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 9v6M9 12h6"/></svg>, unavailable: false },
    ],
  },
  {
    title: "인터넷 및 업무 공간",
    items: [
      { label: "와이파이", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>, unavailable: false },
    ],
  },
  {
    title: "주방 및 식사 공간",
    items: [
      { label: "주방", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>, unavailable: false },
      { label: "냉장고", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14"/><path d="M9 6v2"/></svg>, unavailable: false },
      { label: "전자레인지", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><rect x="15" y="8" width="4" height="8" rx="1"/></svg>, unavailable: false },
      { label: "기본 조리도구", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 3v11a4 4 0 0 0 8 0V3"/><path d="M7 8h8"/></svg>, unavailable: false },
      { label: "식기류", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2v7c0 1.66 1.34 3 3 3h2v10h2V12h2c1.66 0 3-1.34 3-3V2h-2v5H9V2H7v5H5V2H3z"/><path d="M16 2v20h2V13h2c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-4z"/></svg>, unavailable: false },
      { label: "소형 냉장고", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 11h12"/><path d="M10 7v2"/></svg>, unavailable: false },
      { label: "냉동고", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 6v12M9 9l3-3 3 3M9 15l3 3 3-3"/></svg>, unavailable: false },
      { label: "가스레인지", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="10" r="2"/><circle cx="16" cy="10" r="2"/><path d="M8 16h8"/></svg>, unavailable: false },
      { label: "와인 잔", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2h8l2 8H6L8 2z"/><path d="M12 10v8"/><path d="M8 22h8"/><path d="M6 10a6 6 0 0 0 12 0"/></svg>, unavailable: false },
    ],
  },
  {
    title: "위치 특성",
    items: [
      { label: "해변으로 연결", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20c4-4 8-8 20-8"/><path d="M2 20c2-6 6-10 10-12"/></svg>, unavailable: false },
    ],
  },
  {
    title: "서비스",
    items: [
      { label: "셀프 체크인", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, unavailable: false },
      { label: "디지털 도어록", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/></svg>, unavailable: false },
    ],
  },
  {
    title: "숙소에 없는 시설",
    items: [
      { label: "숙소 건물 외부 보안 카메라", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>, unavailable: true },
      { label: "건조기", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M7 6h2"/></svg>, unavailable: true },
    ],
  },
];

export const SLEEP_PHOTOS = [
  {
    label: "침실 1",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  },
  {
    label: "침실 2",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  },
  {
    label: "침실 3",
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600",
  },
  {
    label: "거실",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  },
];

export const EXPERIENCE_DESCRIPTION = `안녕하세요, 호스트 우진입니다. 🌿

가평의 아름다운 자연 속에서 특별한 하루를 선물해드리는 체험 프로그램입니다. 처음 오시는 분도 부담 없이 즐기실 수 있도록 모든 과정을 처음부터 차근차근 안내해드려요.

📌 진행 안내
· 소요 시간: 약 2시간 30분
· 진행 인원: 최소 2인 ~ 최대 9인 소규모로 진행되어 한 분 한 분 세심하게 챙겨드립니다.
· 준비물: 편한 복장과 운동화면 충분합니다. 나머지는 모두 준비되어 있어요.

📌 포함 사항
· 체험에 필요한 모든 장비와 재료
· 진행 중 촬영해드리는 스냅 사진 (원본 전체 제공)
· 시원한 생수와 간단한 간식

우천 시에는 하루 전까지 연락드리고 일정 변경 또는 전액 환불로 안내해드립니다. 궁금한 점은 언제든 메시지 주세요. 😊`;

export const SERVICE_DESCRIPTION = `안녕하세요, 호스트 우진입니다. ✨

수년간의 현장 경험을 바탕으로 고객 한 분 한 분께 맞춘 프리미엄 서비스를 제공하고 있습니다. 예약 전 채팅으로 원하시는 스타일과 일정을 편하게 상담해보세요.

📌 서비스 안내
· 소요 시간: 약 1시간 ~ 2시간 (옵션에 따라 상이)
· 진행 방식: 예약 확정 후 세부 일정과 장소를 조율해드립니다.
· 결과물: 작업 완료 후 3일 이내에 전달해드립니다.

📌 포함 사항
· 사전 상담 및 맞춤 컨설팅
· 서비스 진행에 필요한 모든 장비
· 결과물 보정 및 편집 1회

일정 변경은 이용일 기준 2일 전까지 무료로 가능합니다. 궁금한 점은 언제든 메시지 주세요. 😊`;

export const DESCRIPTION_TEXT = `안녕하세요. 🌸부산역 근처 정성 가득한 숙소, 정스테이(Jung Stay)입니다.

우리 집은 2026년 6월에 정성껏 리모델링을 마친 30평 규모의 넓고 고풍스러운 숙소입니다. 한국적인 따뜻함과 아늑함을 가득 담아, 귀한 걸음 해주시는 손님들이 내 집처럼 편안하게 쉬어가실 수 있도록 공간 하나하나 신경 써서 준비했습니다.

최대 9명까지 머무르실 수 있어 대가족 여행, 동창회나 동호회 모임, 오랜 친구들과의 우정 여행 등 소중한 분들과 함께하는 부산 여행에 더없이 좋은 선택이 되실 겁니다. 넉넉하고 훈훈한 정으로 손님들을 맞이하겠습니다.

숙소
🏠 공간 소개 (The Space)

크기 및 인원: 약 30평(100㎡)의 넓은 복층 구조로, 최대 9인까지 여유롭게 머무실 수 있습니다.

구조: 침실 3개 (퀸사이즈 침대 총 4개) + 거실 + 주방 + 욕실 2개

위치: 부산역에서 걸어서 7분 거리라 약간 거리가 있지만 거리가 있는 만큼 조용한곳에 있어 정말 괜찮습니다. (김해공항에서는 차로 30분 거리이며, 숙소 도보 2분 거리에 24시간 편의점이 있어 늦은 밤에도 든든합니다.)

게스트 이용 가능 공간/시설
🛋️ 정성으로 가꾼 공간들

▪️ 거실 (Living Room)
다 함께 둘러앉아 도란도란 이야기꽃을 피울 수 있는 9인용 대형 원목 식탁을 두었습니다.
55인치 스마트 TV로 보고 싶으신 모든 OTT 영상을 자유롭게 즐기실 수 있습니다.

초고속 무료 Wi-Fi는 물론, 여행지에서도 옷매무새를 깔끔하게 유지하실 수 있도록 스팀다리미도 챙겨두었습니다.

▪️ 침실 (Bedrooms - 총 3개)
편안하고 깊은 숙면을 위해 방마다 널찍한 퀸사이즈 침대를 총 4개 나누어 배치했습니다.

매일매일 깨끗하게 세탁하고 보송하게 말린 호텔급 고급 침구류로 갈아 끼우니 안심하고 꿀잠 자러 오세요.

방마다 옷걸이와 화장대, 거울을 각각 구비해 두어, 인원이 많아도 바쁜 아침 시간에 서두르지 않고 여유롭게 외출 준비를 하실 수 있습니다.

▪️ 주방 (Kitchen)
대가족이 오셔도 부족함 없도록 넉넉한 식기 세트와 냉장고, 전자레인지, 가스레인지, 전기포트를 세심하게 채워두었습니다.

크기별 냄비와 후라이팬, 조리도구 일체가 준비되어 있습니다. (※ 단, 소금이나 후추 같은 조미료는 개인 위생을 위해 제공되지 않으니 필요하신 경우 개별 지참 부탁드립니다.)

⚠️ 주의해 주세요: 다음번에 머무실 손님들을 위해 연기나 기름, 냄새가 많이 베이는 음식(고기구이, 해산물 요리, 마라탕, 매운탕 등)의 조리는 삼가해 주시기를 정중히 부탁드립니다.

▪️ 욕실 (Bathrooms - 총 2개)

욕실이 2개라 인원이 많아도 화장실 때문에 기다리는 일 없도록 준비했고, 드라이기 2개와 고데기 1개를 준비해 두었습니다. 면봉, 화장솜, 머리끈까지 세심하게 챙겨두었으니 편하게 쓰세요.

수건은 1인당 2장씩 보송한 상태로 기본 제공됩니다. (※ 3박 이상 오래 머무시는 분들은 숙소 내 세탁기와 건조기로 언제든 편하게 셀프 세탁하실 수 있습니다.)

▪️ 세탁기&건조기 (Washer & Dryer)
게스트분들의 쾌적한 여행을 위해 신제품 세탁기와 건조기를 구비해뒀습니다. 머무시는 동안 내 집처럼 편안하게 사용하세요!

🧳 게스트를 위한 세심한 서비스
짐 보관 서비스: 체크인 전이나 체크아웃 하신 후에도 무거운 가방 없이 가볍고 즐겁게 부산을 구경하실 수 있도록, 짐을 무료로 안전하게 보관해 드립니다.(사전 예약 필수)

하우스키핑 서비스: 3박 이상 연박하시는 귀한 손님들께는 내 집처럼 더 쾌적하게 지내실 수 있도록 중간에 무료 하우스키핑을 진행해 드립니다. (사전 예약 필수)

기타 주의사항
🤝 머무시는 동안 꼭 지켜주세요 (주의사항)
서로를 배려하는 따뜻한 마음으로 아래 사항들을 꼭 확인해 주시길 부탁드립니다.

1. 복층 안내: 저희 숙소는 3층과 4층을 함께 쓰는 복층 구조입니다. 건물 내에 엘리베이터는 없지만, 계단 층계가 낮고 완만해서 큰 짐을 들고 오르내리시기에도 크게 힘들지 않으실 겁니다. 하지만 심신이 미약하신 어르신이나 아이들에게는 어려움이 있는 숙소일수도 있습니다. 😭

2. 이용 시간: 입실은 오후 3시부터, 퇴실은 오전 11시까지입니다. 다음 손님을 위한 깨끗한 청소 시간을 위해 시간을 꼭 지켜주세요.

3. 전 객실 절대 금연 🚭: 화장실을 포함한 숙소 내부 전체가 당연히 금연입니다. 흡연 시 경보기가 울리거나 과태료 10만 원과 특수 청소 비용이 청구될 수 있으니 꼭 숙소 건물 외부에서 흡연해 주시고, 담배꽁초도 깔끔하게 처리해 주세요.

4. 인원 확인: 예약하신 분들 외에 추가 인원이나 외부 방문객이 들어오시는 것은 엄격히 금지됩니다. (안전과 인원 확인을 위해 건물 입구 및 외부에 CCTV가 가동 중입니다. 허가되지 않은 인원 적발 시 인당 5만 원의 추가 요금이 부과됩니다.)

5. 소음 주의: 아랫집에 태어난지 얼마되지않은 사랑스러운 천사가 살고있습니다. 늦은 밤인 오후 10시 이후에는 고성방가를 자제해 주시고 서로 조금씩만 조용히 배려해 주세요.

6. 반려동물 동반 불가: 안타깝게도 안내견을 제외한 모든 반려동물은 동반이 어렵습니다.

7. 물품 소중히 다루기: 가구나 숙소 비품을 소중히 사용해 주세요. 심한 오염(침구·소파의 혈흔이나 염색약 등)이나 파손, 분실이 생길 경우 실제 구매 비용 기준으로 청구될 수 있습니다. 퇴실하실 때는 가벼운 쓰레기 정리와 설거지를 부탁드립니다.

8. 현장 사진 안내: 저희 집은 정기적으로 계절에 어울리는 소품(액자 등)과 가구 배치로 인테리어를 조금씩 새로이 단장하고 있습니다. 때문에 시기에 따라 사진과 실제 느낌이 살짝 다를 수 있습니다. 편의시설이나 제공 물품은 변함없이 알차게 준비되어 있으니 편안한 마음으로 찾아주세요. 🙏🏼


**지자체에서 허가받은 합법숙소입니다**
**본 숙소는 미스터멘션 특례를 적용받아 내국인 공유 숙박 합법 업체로 등록되어 운영되고 있습니다**

등록 세부 정보
발급 지역: 부산광역시, 중구
허가 유형: 외국인관광도시민박업
허가번호: 2026000009`;
