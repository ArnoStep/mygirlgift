import { useState } from 'react';
import { motion } from 'framer-motion';
import type { StagePhoto } from '../content';

interface Props {
  photo: StagePhoto;
  /** Индекс для чередования наклона влево/вправо */
  index?: number;
  size?: 'small' | 'large';
}

/** Фото в белой рамке-«полароиде»; если файл не загрузился — не рендерится вовсе */
export default function Polaroid({ photo, index = 0, size = 'small' }: Props) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;

  const tilt = (index % 2 === 0 ? -1 : 1) * (2 + (index % 3));

  return (
    <motion.figure
      className={`polaroid ${size}`}
      initial={{ opacity: 0, y: 16, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ delay: 0.15 + index * 0.12 }}
    >
      <img src={photo.src} alt={photo.caption ?? ''} onError={() => setOk(false)} />
      {photo.caption && <figcaption>{photo.caption}</figcaption>}
    </motion.figure>
  );
}

export function PolaroidRow({ photos }: { photos?: StagePhoto[] }) {
  if (!photos || photos.length === 0) return null;
  return (
    <div className="polaroid-row">
      {photos.map((photo, i) => (
        <Polaroid key={photo.src} photo={photo} index={i} />
      ))}
    </div>
  );
}
