"use client";

import { useRef, type ReactNode } from "react";
import styles from "./ItemDetail.module.css";
import { CloseIcon } from "./icons";
import { useModalBehavior } from "@/hooks/useModalBehavior";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  // 예약 확인처럼 내용이 짧은 모달용 — 콘텐츠 높이에 맞는 작은 패널로 렌더링
  compact?: boolean;
}

// 숙소 설명/편의시설 모달이 공유하는 껍데기 (오버레이 + 헤더 + 스크롤 바디).
// Escape 닫기 / 배경 스크롤 잠금 / 포커스 트랩은 useModalBehavior가 담당한다.
export default function Modal({ title, onClose, children, compact = false }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalBehavior(panelRef, onClose);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={compact ? `${styles.modalPanel} ${styles.modalPanelCompact}` : styles.modalPanel}
        onClick={(e) => e.stopPropagation()}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.modalHeader}>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose} aria-label="닫기">
            <CloseIcon />
          </button>
          <span className={styles.modalTitle}>{title}</span>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
