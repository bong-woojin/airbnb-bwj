"use client";

import { useState } from "react";
import styles from "./ItemDetail.module.css";
import Modal from "./Modal";
import { AMENITIES_PREVIEW, AMENITIES_SECTIONS } from "./content";

// "숙소 편의시설" 미리보기 그리드 + 전체 목록 모달
export default function AmenitiesSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.amenitiesSection}>
      <h2 className={styles.amenitiesTitle}>숙소 편의시설</h2>
      <ul className={styles.amenitiesGrid}>
        {AMENITIES_PREVIEW.map((a) => (
          <li key={a.label} className={styles.amenityItem}>
            <span className={styles.amenityIcon}>{a.icon}</span>
            {a.label}
          </li>
        ))}
      </ul>
      <button type="button" className={styles.moreBtn} onClick={() => setShowModal(true)}>
        편의시설 30개 모두 보기
      </button>

      {showModal && (
        <Modal title="숙소 편의시설" onClose={() => setShowModal(false)}>
          {AMENITIES_SECTIONS.map((section, si) => (
            <div key={section.title}>
              {si > 0 && <hr className={styles.divider} />}
              <h3 className={styles.amenitiesModalSubtitle}>{section.title}</h3>
              <ul className={styles.amenitiesModalList}>
                {section.items.map((item) => (
                  <li
                    key={item.label}
                    className={`${styles.amenitiesModalItem} ${item.unavailable ? styles.amenitiesModalItemUnavailable : ""}`}
                  >
                    <span className={styles.amenityIcon}>{item.icon}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}
