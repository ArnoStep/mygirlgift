import { motion } from 'framer-motion';
import { config } from '../content';

interface Props {
  onStart: () => void;
  hasProgress: boolean;
}

export default function Intro({ onStart, hasProgress }: Props) {
  return (
    <motion.div
      className="screen intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="intro-heart"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      >
        💗
      </motion.div>
      <h1 className="intro-title">{config.introTitle}</h1>
      <p className="intro-text">{config.introText}</p>
      <motion.button
        className="btn-primary"
        onClick={onStart}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {hasProgress ? 'Продолжить путешествие' : config.introButton}
      </motion.button>
    </motion.div>
  );
}
