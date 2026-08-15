import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { config, type StagePhoto } from '../content';
import Polaroid from '../components/Polaroid';

const CONFETTI_COLORS = ['#f96ba4', '#ffc9de', '#ffffff', '#e94e8a', '#f0b84c'];
const SLIDE_MS = 4200;

const heartShape = confetti.shapeFromText({ text: '💗', scalar: 2 });

type Act = 'burst' | 'slides' | 'letter';

/** Оставляем только слайды, картинки которых реально загрузились */
function useLoadedPhotos(photos: StagePhoto[]): StagePhoto[] | null {
  const [loaded, setLoaded] = useState<StagePhoto[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      photos.map(
        (photo) =>
          new Promise<StagePhoto | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(photo);
            img.onerror = () => resolve(null);
            img.src = photo.src;
          }),
      ),
    ).then((results) => {
      if (!cancelled) setLoaded(results.filter((p): p is StagePhoto => p !== null));
    });
    return () => {
      cancelled = true;
    };
  }, [photos]);

  return loaded;
}

function FloatingHearts() {
  const hearts = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      left: (i * 83) % 100,
      delay: (i * 0.9) % 6,
      duration: 6 + (i % 4) * 1.5,
      size: 14 + (i % 3) * 8,
    })),
  );
  return (
    <div className="floating-hearts" aria-hidden>
      {hearts.current.map((h, i) => (
        <span
          key={i}
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: h.size,
          }}
        >
          💗
        </span>
      ))}
    </div>
  );
}

interface Props {
  onBack: () => void;
}

export default function Finale({ onBack }: Props) {
  const [act, setAct] = useState<Act>('burst');
  const [slideIdx, setSlideIdx] = useState(0);
  const slides = useLoadedPhotos(config.finaleSlides);

  // Акт 1: фейерверк с конфетти-сердечками — идёт, пока не нажмут «Дальше»
  useEffect(() => {
    if (act !== 'burst') return;

    let active = true;
    const frame = () => {
      if (!active) return;
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: CONFETTI_COLORS,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: CONFETTI_COLORS,
      });
      confetti({
        particleCount: 1,
        shapes: [heartShape],
        scalar: 2,
        spread: 100,
        startVelocity: 25,
        origin: { x: Math.random(), y: 0.6 },
      });
      requestAnimationFrame(frame);
    };
    frame();

    return () => {
      active = false;
    };
  }, [act]);

  // Если фото для слайдшоу нет — сразу к письму
  useEffect(() => {
    if (act === 'slides' && slides !== null && slides.length === 0) {
      setAct('letter');
    }
  }, [act, slides]);

  // Автолистание слайдов
  useEffect(() => {
    if (act !== 'slides' || !slides || slides.length === 0) return;
    const timer = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, [act, slides]);

  // Лёгкий «снег» из сердечек во время письма
  useEffect(() => {
    if (act !== 'letter') return;
    const timer = setInterval(() => {
      confetti({
        particleCount: 1,
        shapes: [heartShape],
        scalar: 1.4,
        startVelocity: 8,
        gravity: 0.35,
        ticks: 220,
        origin: { x: Math.random(), y: -0.05 },
      });
    }, 900);
    return () => clearInterval(timer);
  }, [act]);

  return (
    <motion.div
      className="screen finale-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {act === 'burst' && (
          <motion.div
            key="burst"
            className="finale-act"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="finale-age"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            >
              {config.age}
            </motion.div>
            <h1 className="finale-title">{config.finaleTitle}</h1>
            <p className="finale-subtitle">{config.finaleSubtitle}</p>
            <motion.button
              className="btn-ghost"
              onClick={() => setAct('slides')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              Дальше →
            </motion.button>
          </motion.div>
        )}

        {act === 'slides' && slides && slides.length > 0 && (
          <motion.div
            key="slides"
            className="finale-act"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="slideshow-title">{config.slideshowTitle}</h2>
            <div
              className="slideshow"
              onClick={() => setSlideIdx((i) => (i + 1) % slides.length)}
              role="button"
              aria-label="Следующий кадр"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIdx}
                  className="slide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <img className="slide-img" src={slides[slideIdx].src} alt="" />
                  <p className="slide-caption">{slides[slideIdx].caption}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="slide-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`slide-dot ${i === slideIdx ? 'active' : ''}`}
                  onClick={() => setSlideIdx(i)}
                  aria-label={`Кадр ${i + 1}`}
                />
              ))}
            </div>
            <button className="btn-primary" onClick={() => setAct('letter')}>
              Дальше — письмо 💌
            </button>
          </motion.div>
        )}

        {act === 'letter' && (
          <motion.div
            key="letter"
            className="finale-act"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="finale-title">{config.finaleTitle}</h1>
            <div className="letter">
              {config.letterFragments.map((fragment, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.5 }}
                >
                  {fragment}
                </motion.p>
              ))}
              <motion.p
                className="signature"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + config.letterFragments.length * 0.5 }}
              >
                {config.letterSignature}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + config.letterFragments.length * 0.5 }}
            >
              <Polaroid photo={config.finalePhoto} size="large" />
            </motion.div>

            <motion.button
              className="btn-ghost"
              onClick={onBack}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + config.letterFragments.length * 0.5 }}
            >
              ← Вернуться к нашей истории
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
