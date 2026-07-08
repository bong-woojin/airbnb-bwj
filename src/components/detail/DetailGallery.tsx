import Image from "next/image";
import styles from "./ItemDetail.module.css";

interface DetailGalleryProps {
  image: string;
  alt: string;
}

// 상단 이미지 갤러리: 왼쪽 큰 사진 1장 + 오른쪽 2x2 작은 사진.
// 목데이터에 이미지가 1장뿐이라 5칸 모두 같은 이미지를 재사용한다.
export default function DetailGallery({ image, alt }: DetailGalleryProps) {
  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <Image src={image} alt={alt} fill sizes="(max-width: 743px) 100vw, 450px" className={styles.image} priority />
      </div>
      <div className={styles.gallerySide}>
        {[0, 1, 2, 3].map((i) => (
          <div className={styles.gallerySideItem} key={i}>
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 743px) 50vw, 225px"
              className={styles.image}
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
