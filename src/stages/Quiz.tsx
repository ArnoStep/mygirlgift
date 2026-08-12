import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizStage } from '../content';

interface Props {
  stage: QuizStage;
  onComplete: () => void;
}

export default function Quiz({ stage, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const question = stage.questions[index];
  const isLast = index === stage.questions.length - 1;

  const pick = (i: number) => {
    if (solved) return;
    setPicked(i);
    if (i === question.correctIndex) setSolved(true);
  };

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    setSolved(false);
  };

  return (
    <div>
      <div className="quiz-progress">
        {stage.questions.map((_, i) => (
          <span key={i} className={`dot ${i === index ? 'active' : i < index ? 'passed' : ''}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <p className="quiz-question">{question.question}</p>
          <div className="quiz-options">
            {question.options.map((option, i) => {
              let cls = 'quiz-option';
              if (picked === i) cls += i === question.correctIndex ? ' correct' : ' wrong';
              if (solved && i === question.correctIndex) cls += ' correct';
              return (
                <button key={i} className={cls} onClick={() => pick(i)} disabled={solved}>
                  {option}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {solved && question.afterText && (
              <motion.div
                className="quiz-after"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {question.afterText}
              </motion.div>
            )}
          </AnimatePresence>
          {solved && (
            <motion.button
              className="btn-primary"
              style={{ marginTop: 16 }}
              onClick={next}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isLast ? 'Завершить этап' : 'Дальше'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
