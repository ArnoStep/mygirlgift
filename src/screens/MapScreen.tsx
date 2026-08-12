import { motion } from 'framer-motion';
import { config, stages } from '../content';

interface Props {
  completed: string[];
  onOpenStage: (stageId: string) => void;
  onFinale: () => void;
}

export default function MapScreen({ completed, onOpenStage, onFinale }: Props) {
  const allDone = stages.every((s) => completed.includes(s.id));
  const firstUnlockedIndex = stages.findIndex((s) => !completed.includes(s.id));

  return (
    <motion.div className="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="map-header">
        <h1>{config.mapTitle}</h1>
        <p>{config.mapSubtitle}</p>
      </header>

      <div className="letter-progress">
        Собрано фрагментов послания: {completed.length} из {stages.length}
        <span className="hearts">
          {stages.map((s) => (completed.includes(s.id) ? '💗' : '🤍')).join('')}
        </span>
      </div>

      <div className="map-path">
        {stages.map((stage, i) => {
          const done = completed.includes(stage.id);
          const locked = !done && i !== firstUnlockedIndex;
          return (
            <motion.button
              key={stage.id}
              className={`map-node ${done ? 'done' : ''} ${locked ? 'locked' : ''}`}
              disabled={locked}
              onClick={() => onOpenStage(stage.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <span className="node-emoji">{stage.emoji}</span>
              <span className="node-info">
                <span className="node-title">
                  {i + 1}. {stage.title}
                </span>
                <br />
                <span className="node-subtitle">{stage.subtitle}</span>
              </span>
              <span className="node-status">{done ? '✅' : locked ? '🔒' : '✨'}</span>
            </motion.button>
          );
        })}

        {allDone && (
          <motion.button
            className="btn-primary"
            onClick={onFinale}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ marginTop: 8 }}
          >
            Открыть послание 💌
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
