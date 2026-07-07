export type ActiveSection = "location" | "date" | "guest" | null;

export function sectionToIdx(s: ActiveSection): number {
  if (s === "location") return 0;
  if (s === "date") return 1;
  if (s === "guest") return 2;
  return -1;
}

// FLIP(First-Last-Invert-Play): sourceRect 위치/크기에서 시작해 el의 실제 위치/크기로 자연스럽게 줄어들거나 커지는 것처럼 보이게 함
export function runFlip(el: HTMLElement | null, sourceRect: DOMRect | null, baseTransform: string) {
  if (!el || !sourceRect) return;
  const last = el.getBoundingClientRect();
  if (last.width === 0 || last.height === 0) return;
  const scaleX = sourceRect.width / last.width;
  const scaleY = sourceRect.height / last.height;
  const dx = sourceRect.left + sourceRect.width / 2 - (last.left + last.width / 2);
  const dy = sourceRect.top + sourceRect.height / 2 - (last.top + last.height / 2);

  el.style.transition = "none";
  el.style.transform = `${baseTransform} translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  void el.offsetWidth; // 강제 리플로우 — 위 트랜스폼을 즉시 반영시켜야 아래 트랜지션이 애니메이션됨
  requestAnimationFrame(() => {
    el.style.transition = "transform 0.4s cubic-bezier(0.2, 0, 0, 1)";
    el.style.transform = baseTransform;
  });
}
