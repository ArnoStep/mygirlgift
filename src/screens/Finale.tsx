import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { config } from '../content';

const CONFETTI_COLORS = ['#f96ba4', '#ffc9de', '#ffffff', '#e94e8a', '#f0b84c'];

interface Props {
  onBack: () => void;
}

export default function Finale({ onBack }: Props) {
  const [showLetter, setShowLetter] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Фейерверк из обеих сторон экрана в течение трёх секунд
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: CONFETTI_COLORS,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: CONFETTI_COLORS,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    const timer = setTimeout(() => setShowLetter(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="screen finale-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
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

      {showLetter && (
        <motion.div
          className="letter"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
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
        </motion.div>
      )}

      {showLetter && (
        <motion.button
          className="btn-ghost"
          onClick={onBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 + config.letterFragments.length * 0.5 }}
        >
          ← Вернуться к нашей истории
        </motion.button>
      )}
    </motion.div>
  );
}
