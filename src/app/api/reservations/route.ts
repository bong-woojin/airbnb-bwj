import { parseReservationRequest } from "@/lib/reservation";
import { allRooms } from "@/data/rooms";
import { allExperiences } from "@/data/experiences";
import { allServices } from "@/data/services";

// 예약 요청 데모 API. 실제 백엔드 대신 요청-응답 사이클을 담당한다.
// 지연과 확률 실패를 일부러 넣어 클라이언트의 로딩/에러 UI가 실제로 동작하는지 확인할 수 있게 했다.
const DEMO_DELAY_MS = 1000;
const DEMO_FAIL_RATE = 0.2;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "요청 본문이 JSON 형식이 아닙니다." }, { status: 400 });
  }

  const parsed = parseReservationRequest(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }
  const { itemId, checkin, checkout, guests } = parsed.data;

  const item = [...allRooms, ...allExperiences, ...allServices].find((i) => i.id === itemId);
  if (!item) {
    return Response.json({ error: "존재하지 않는 상품입니다." }, { status: 404 });
  }
  if (item.maxGuests != null && guests > item.maxGuests) {
    return Response.json(
      { error: `이 숙소의 최대 숙박 인원은 ${item.maxGuests}명입니다.` },
      { status: 400 },
    );
  }

  // 네트워크/서버 처리 시간 시뮬레이션 — 로딩 상태가 눈에 보이게
  await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));

  // 확률 실패 시뮬레이션 — 에러 상태와 재시도 UI 검증용
  if (Math.random() < DEMO_FAIL_RATE) {
    return Response.json(
      { error: "일시적인 오류로 예약 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }

  const reservationId = `R-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

  return Response.json(
    { id: reservationId, itemId, checkin, checkout, guests, createdAt: new Date().toISOString() },
    { status: 201 },
  );
}
