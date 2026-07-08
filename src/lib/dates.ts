// 카드에 표시되는 "7월 15일~20일" / "7월 28일~8월 2일" 형식의 날짜 문자열을
// 실제 Date 범위로 해석하는 유틸. 연도가 없으므로 "오늘 기준 다음 도래 시점"으로 본다.

export interface DateRange {
  start: Date;
  end: Date;
}

export function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseCardDateRange(label: string | undefined, today: Date = getToday()): DateRange | null {
  if (!label) return null;

  // "7월 28일~8월 2일" (달이 넘어가는 형식)
  let m = label.match(/(\d+)월\s*(\d+)일\s*~\s*(\d+)월\s*(\d+)일/);
  let startMonth: number, startDay: number, endMonth: number, endDay: number;
  if (m) {
    [startMonth, startDay, endMonth, endDay] = [Number(m[1]) - 1, Number(m[2]), Number(m[3]) - 1, Number(m[4])];
  } else {
    // "7월 15일~20일" (같은 달 형식)
    m = label.match(/(\d+)월\s*(\d+)일\s*~\s*(\d+)일/);
    if (!m) return null;
    [startMonth, startDay, endDay] = [Number(m[1]) - 1, Number(m[2]), Number(m[3])];
    endMonth = startMonth;
  }

  let year = today.getFullYear();
  let end = new Date(year, endMonth, endDay);
  // 기간이 이미 완전히 지났으면 내년으로 해석
  if (end < today) {
    year += 1;
    end = new Date(year, endMonth, endDay);
  }
  const start = new Date(year, startMonth, startDay);
  return { start, end };
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
