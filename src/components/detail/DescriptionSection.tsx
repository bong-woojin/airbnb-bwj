"use client";

import { useState } from "react";
import styles from "./ItemDetail.module.css";
import Modal from "./Modal";
import { DESCRIPTION_TEXT } from "./content";

interface DescriptionSectionProps {
  text?: string;
  modalTitle?: string;
}

// 소개글: 8줄 말줄임 + "더 보기" 클릭 시 전문 모달
export default function DescriptionSection({
  text = DESCRIPTION_TEXT,
  modalTitle = "숙소 설명",
}: DescriptionSectionProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <p className={styles.descriptionText}>{text}</p>
      <button type="button" className={styles.moreBtn} onClick={() => setShowModal(true)}>
        더 보기
      </button>

      {showModal && (
        <Modal title={modalTitle} onClose={() => setShowModal(false)}>
          <p className={styles.modalDescription}>{text}</p>
        </Modal>
      )}
    </>
  );
}
