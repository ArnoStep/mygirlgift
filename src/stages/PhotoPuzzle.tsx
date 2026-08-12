import { useEffect, useMemo, useState } from 'react';
import type { PuzzleStage } from '../content';

interface Props {
  stage: PuzzleStage;
  onComplete: () => void;
}

const SIZE = 3;
const TILES = SIZE * SIZE;

function shuffledOrder(): number[] {
  const order = Array.from({ length: TILES }, (_, i) => i);
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((v, i) => v === i));
  return order;
}

export default function PhotoPuzzle({ stage, onComplete }: Props) {
  /** order[позиция в сетке] = индекс фрагмента картинки */
  const [order, setOrder] = useState<number[]>(shuffledOrder);
  const [selected, setSelected] = useState<number | null>(null);
  const [photoOk, setPhotoOk] = useState(false);

  useEffect(() => {
    if (!stage.photo) return;
    const img = new Image();
    img.onload = () => setPhotoOk(true);
    img.src = stage.photo;
  }, [stage.photo]);

  const solved = useMemo(() => order.every((v, i) => v === i), [order]);

  useEffect(() => {
    if (solved) {
      const timer = setTimeout(onComplete, 900);
      return () => clearTimeout(timer);
    }
  }, [solved, onComplete]);

  const tap = (pos: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(pos);
      return;
    }
    if (selected === pos) {
      setSelected(null);
      return;
    }
    const next = [...order];
    [next[selected], next[pos]] = [next[pos], next[selected]];
    setOrder(next);
    setSelected(null);
  };

  return (
    <div className="card">
      <div className="puzzle-grid">
        {order.map((piece, pos) => {
          const row = Math.floor(piece / SIZE);
          const col = piece % SIZE;
          const mediaStyle: React.CSSProperties = {
            left: `${-col * 100}%`,
            top: `${-row * 100}%`,
          };
          return (
            <button
              key={pos}
              className={`puzzle-tile ${selected === pos ? 'selected' : ''}`}
              onClick={() => tap(pos)}
              aria-label={`Фрагмент ${piece + 1}`}
            >
              {photoOk && stage.photo ? (
                <img className="tile-media" src={stage.photo} alt="" style={{ ...mediaStyle, objectFit: 'cover' }} />
              ) : (
                <div
                  className="tile-media"
                  style={{
                    ...mediaStyle,
                    background: 'linear-gradient(135deg, #ffd3e3 0%, #ff9ec4 50%, #f96ba4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18vw',
                  }}
                >
                  🍓💗🍇
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="puzzle-caption">{stage.caption}</p>
      {!solved && <p className="puzzle-help">Нажми на два фрагмента, чтобы поменять их местами</p>}
    </div>
  );
}
