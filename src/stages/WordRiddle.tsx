import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RiddleStage } from '../content';
import PhotoPuzzle from './PhotoPuzzle';

interface Props {
  stage: RiddleStage;
  onComplete: () => void;
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/ё/g, 'е');

export default function WordRiddle({ stage, onComplete }: Props) {
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [phase, setPhase] = useState<'riddle' | 'puzzle'>('riddle');

  const check = () => {
    if (normalize(value) === normalize(stage.answer)) {
      if (stage.puzzle) {
        setPhase('puzzle');
      } else {
        onComplete();
      }
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 450);
    }
  };

  if (phase === 'puzzle' && stage.puzzle) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {stage.puzzle.intro && (
          <div className="card" style={{ marginBottom: 14 }}>
            <p className="stage-intro-text">{stage.puzzle.intro}</p>
          </div>
        )}
        <PhotoPuzzle
          photo={stage.puzzle.photo}
          caption={stage.puzzle.caption}
          onComplete={onComplete}
        />
      </motion.div>
    );
  }

  return (
    <div className="card">
      <p className="riddle-text">{stage.riddle}</p>
      <input
        className={`riddle-input ${wrong ? 'wrong' : ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && check()}
        placeholder="Твой ответ…"
        autoComplete="off"
        autoCapitalize="off"
      />
      <AnimatePresence>
        {stage.hints.slice(0, hintsShown).map((hint, i) => (
          <motion.div
            key={i}
            className="riddle-hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Подсказка {i + 1}: {hint}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="riddle-actions">
        <button className="btn-primary" onClick={check} disabled={!value.trim()}>
          Проверить
        </button>
        {hintsShown < stage.hints.length && (
          <button className="btn-ghost" onClick={() => setHintsShown(hintsShown + 1)}>
            Нужна подсказка 💡
          </button>
        )}
      </div>
    </div>
  );
}
