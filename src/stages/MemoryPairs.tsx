import { useEffect, useMemo, useRef, useState } from 'react';
import type { MemoryStage } from '../content';

interface Props {
  stage: MemoryStage;
  onComplete: () => void;
}

interface CardState {
  key: number;
  pairIndex: number;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MemoryPairs({ stage, onComplete }: Props) {
  const cards = useMemo<CardState[]>(
    () =>
      shuffle(
        stage.pairs.flatMap((_, pairIndex) => [
          { key: pairIndex * 2, pairIndex },
          { key: pairIndex * 2 + 1, pairIndex },
        ]),
      ),
    [stage.pairs],
  );

  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const lock = useRef(false);

  const flip = (cardIdx: number) => {
    if (lock.current) return;
    const card = cards[cardIdx];
    if (matched.has(card.pairIndex) || open.includes(cardIdx)) return;

    const nextOpen = [...open, cardIdx];
    setOpen(nextOpen);

    if (nextOpen.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpen.map((i) => cards[i]);
      if (a.pairIndex === b.pairIndex) {
        setMatched((prev) => new Set(prev).add(a.pairIndex));
        setOpen([]);
      } else {
        lock.current = true;
        setTimeout(() => {
          setOpen([]);
          lock.current = false;
        }, 750);
      }
    }
  };

  const allMatched = matched.size === stage.pairs.length;

  useEffect(() => {
    if (allMatched) {
      const timer = setTimeout(onComplete, 900);
      return () => clearTimeout(timer);
    }
  }, [allMatched, onComplete]);

  return (
    <div className="card">
      <div className="memory-grid">
        {cards.map((card, i) => {
          const isFlipped = open.includes(i) || matched.has(card.pairIndex);
          const pair = stage.pairs[card.pairIndex];
          return (
            <button
              key={card.key}
              className={`memory-card ${isFlipped ? 'flipped' : ''} ${matched.has(card.pairIndex) ? 'matched' : ''}`}
              onClick={() => flip(i)}
              aria-label={isFlipped ? pair.label : 'Закрытая карточка'}
            >
              <div className="card-inner">
                <div className="face back">💗</div>
                <div className="face front">
                  <span>{pair.emoji}</span>
                  <span className="pair-label">{pair.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="memory-stats">
        Найдено пар: {matched.size} из {stage.pairs.length} · Ходов: {moves}
      </p>
    </div>
  );
}
