import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Stage } from '../content';
import Quiz from '../stages/Quiz';
import MemoryPairs from '../stages/MemoryPairs';
import WordRiddle from '../stages/WordRiddle';
import PhotoPuzzle from '../stages/PhotoPuzzle';

interface Props {
  stage: Stage;
  onDone: () => void;
  onBack: () => void;
}

type Phase = 'intro' | 'playing' | 'success';

export default function StageScreen({ stage, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');

  const complete = () => {
    setPhase('success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#f96ba4', '#ffc9de', '#ffffff', '#e94e8a'],
    });
  };

  return (
    <div className="screen stage-screen">
      <div className="top-bar">
        <button className="icon-btn" onClick={onBack} aria-label="Назад к карте">
          ←
        </button>
        <span />
      </div>

      <header className="stage-header">
        <div className="stage-emoji">{stage.emoji}</div>
        <h1>{stage.title}</h1>
      </header>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            className="screen"
            style={{ gap: 16 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="card">
              <p className="stage-intro-text">{stage.intro}</p>
            </div>
            <button className="btn-primary" onClick={() => setPhase('playing')}>
              Играем!
            </button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {stage.type === 'quiz' && <Quiz stage={stage} onComplete={complete} />}
            {stage.type === 'memory' && <MemoryPairs stage={stage} onComplete={complete} />}
            {stage.type === 'riddle' && <WordRiddle stage={stage} onComplete={complete} />}
            {stage.type === 'puzzle' && <PhotoPuzzle stage={stage} onComplete={complete} />}
          </motion.div>
        )}

        {phase === 'success' && (
          <motion.div
            key="success"
            className="stage-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-emoji">🎉</div>
            <h2 className="screen-title">Этап пройден!</h2>
            <p className="stage-intro-text">Открылся фрагмент послания:</p>
            <motion.div
              className="fragment-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              «{stage.letterFragment}»
            </motion.div>
            <button className="btn-primary" onClick={onDone}>
              К карте путешествия
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
