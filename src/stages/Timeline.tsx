import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { TimelineStage } from '../content';

interface Props {
  stage: TimelineStage;
  onComplete: () => void;
}

function shuffledIndexes(count: number): number[] {
  const arr = Array.from({ length: count }, (_, i) => i);
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (arr.every((v, i) => v === i));
  return arr;
}

export default function Timeline({ stage, onComplete }: Props) {
  /** order[позиция в списке] = индекс события в правильной хронологии */
  const [order, setOrder] = useState<number[]>(() => shuffledIndexes(stage.events.length));
  const [checked, setChecked] = useState(false);
  const solved = useMemo(() => order.every((v, i) => v === i), [order]);

  const move = (pos: number, dir: -1 | 1) => {
    const target = pos + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[pos], next[target]] = [next[target], next[pos]];
    setOrder(next);
    setChecked(false);
  };

  const check = () => {
    setChecked(true);
    if (solved) {
      setTimeout(onComplete, 700);
    }
  };

  return (
    <div className="card">
      <p className="timeline-help">Расставь события в том порядке, как всё было на самом деле</p>
      <div className="timeline-list">
        {order.map((eventIdx, pos) => {
          const wrong = checked && !solved && eventIdx !== pos;
          const right = checked && eventIdx === pos;
          return (
            <motion.div
              key={eventIdx}
              layout
              transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
              className={`timeline-item ${wrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
            >
              <span className="timeline-num">{pos + 1}</span>
              <span className="timeline-text">{stage.events[eventIdx]}</span>
              <span className="timeline-arrows">
                <button
                  className="arrow-btn"
                  onClick={() => move(pos, -1)}
                  disabled={pos === 0}
                  aria-label="Выше"
                >
                  ↑
                </button>
                <button
                  className="arrow-btn"
                  onClick={() => move(pos, 1)}
                  disabled={pos === order.length - 1}
                  aria-label="Ниже"
                >
                  ↓
                </button>
              </span>
            </motion.div>
          );
        })}
      </div>
      {checked && !solved && (
        <p className="timeline-feedback">Почти! Зелёные события уже на месте, красные — пока нет.</p>
      )}
      <button className="btn-primary" style={{ marginTop: 16 }} onClick={check}>
        Проверить
      </button>
    </div>
  );
}
