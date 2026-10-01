// 날짜 유틸. 목록 항목의 예약 가능 기간은 "오늘로부터 며칠 뒤"(오프셋)로 저장돼 있고,
// 실제 Date는 여기서 오늘 기준으로 계산한다.
//
// 이 앱의 Date는 전부 "달력 날짜"다: 로컬 타임존 자정의 Date(y, m, d)로 만들고
// getFullYear/getMonth/getDate로만 읽는다. 시각 정보는 쓰지 않는다.

export interface DateRange {
  start: Date;
  end: Date;
}

// 예약 가능 기간 (ListingItem의 startOffset/nights)
export interface Availability {
  startOffset?: number;
  nights?: number;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 오늘 날짜 — 실행 환경의 타임존이 아니라 항상 한국 시간(KST) 기준.
// 서버(배포 환경은 보통 UTC)와 브라우저의 타임존이 달라도 같은 날짜가 나와야
// SSR 결과와 hydration 결과가 일치한다. 예) UTC 15:30 = KST 다음날 00:30 → 서버/클라이언트 모두 "다음날".
// KST는 서머타임이 없어 +9시간 고정 오프셋으로 정확히 계산된다.
export function getToday(now: Date = new Date()): Date {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  return new Date(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate());
}

// n일 뒤(음수면 앞) 날짜 — Date 생성자가 월/연도 넘김을 알아서 처리한다
export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

// 오프셋 → 실제 예약 가능 기간. 기간 정보가 없는 항목(체험/서비스)은 null.
export function getAvailabilityRange(item: Availability, today: Date = getToday()): DateRange | null {
  if (item.startOffset == null || item.nights == null) return null;
  const start = addDays(today, item.startOffset);
  return { start, end: addDays(start, item.nights) };
}

// 카드 표시용 라벨 ("7월 15일~20일"). 기간 정보가 없으면 undefined.
export function formatAvailabilityLabel(item: Availability, today: Date = getToday()): string | undefined {
  const range = getAvailabilityRange(item, today);
  return range ? formatRangeLabel(range.start, range.end) : undefined;
}

// 검색한 체크인~체크아웃이 숙소의 가능 기간 안에 완전히 포함되는지 (검색 필터 판정)
export function isStayWithinRange(stayStart: Date, stayEnd: Date, range: DateRange): boolean {
  return stayStart >= range.start && stayEnd <= range.end;
}

// 카드/검색바 표시용 "7월 15일~20일" | "7월 29일~8월 3일" 형식으로 변환
export function formatRangeLabel(start: Date, end: Date): string {
  const head = `${start.getMonth() + 1}월 ${start.getDate()}일`;
  return start.getMonth() === end.getMonth()
    ? `${head}~${end.getDate()}일`
    : `${head}~${end.getMonth() + 1}월 ${end.getDate()}일`;
}

// URL 파라미터용 "YYYY-MM-DD" 변환/역변환 (로컬 타임존 기준)
export function formatYMD(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function parseYMD(s: string | undefined): Date | null {
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
