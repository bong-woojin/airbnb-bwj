export type ActiveSection = "location" | "date" | "guest" | null;

export function sectionToIdx(s: ActiveSection): number {
  if (s === "location") return 0;
  if (s === "date") return 1;
  if (s === "guest") return 2;
  return -1;
}

// FLIP(First-Last-Invert-Play): sourceRect 위치/크기에서 시작해 el의 실제 위치/크기로 자연스럽게 줄어들거나 커지는 것처럼 보이게 함.
// 컨테이너만 scale로 morph하고, 내부 콘텐츠는 scale 왜곡이 보이지 않도록 숨겼다가 페이드인한다.
export function runFlip(el: HTMLElement | null, sourceRect: DOMRect | null, baseTransform: string) {
  if (!el || !sourceRect) return;
  const last = el.getBoundingClientRect();
  if (last.width === 0 || last.height === 0) return;
  const scaleX = sourceRect.width / last.width;
  const scaleY = sourceRect.height / last.height;
  const dx = sourceRect.left + sourceRect.width / 2 - (last.left + last.width / 2);
  const dy = sourceRect.top + sourceRect.height / 2 - (last.top + last.height / 2);

  const children = Array.from(el.children) as HTMLElement[];
  children.forEach((c) => {
    c.style.transition = "none";
    c.style.opacity = "0";
  });

  el.style.transition = "none";
  el.style.transform = `${baseTransform} translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  void el.offsetWidth; // 강제 리플로우 — 위 트랜스폼을 즉시 반영시켜야 아래 트랜지션이 애니메이션됨
  requestAnimationFrame(() => {
    el.style.transition = "transform 0.4s cubic-bezier(0.2, 0, 0, 1)";
    el.style.transform = baseTransform;
    children.forEach((c) => {
      // morph가 어느 정도 자리잡은 뒤 콘텐츠 페이드인
      c.style.transition = "opacity 0.25s ease 0.15s";
      c.style.opacity = "1";
    });
  });

  // 애니메이션 종료 후 인라인 스타일 제거 → 각 요소의 원래 CSS 트랜지션 복원
  setTimeout(() => {
    children.forEach((c) => {
      c.style.transition = "";
      c.style.opacity = "";
    });
  }, 600);
}
