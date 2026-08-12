import { useEffect, useRef, useState } from 'react';
import { stages } from './content';
import { loadProgress, saveProgress } from './lib/progress';
import Intro from './screens/Intro';
import MapScreen from './screens/MapScreen';
import StageScreen from './screens/StageScreen';
import Finale from './screens/Finale';

type View = { name: 'intro' } | { name: 'map' } | { name: 'stage'; id: string } | { name: 'finale' };

const MUSIC_SRC = './audio/theme.mp3';

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState<View>({ name: 'intro' });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicAvailable, setMusicAvailable] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    audio.addEventListener('canplaythrough', () => setMusicAvailable(true), { once: true });
    audioRef.current = audio;
    return () => audio.pause();
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      void audio.play().catch(() => setMusicAvailable(false));
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  };

  const start = () => {
    const next = { ...progress, started: true };
    setProgress(next);
    saveProgress(next);
    setView({ name: 'map' });
    // Первый клик — удобный момент запустить музыку (браузер требует жеста)
    if (musicAvailable && muted) toggleMusic();
  };

  const completeStage = (stageId: string) => {
    if (!progress.completedStages.includes(stageId)) {
      const next = { ...progress, completedStages: [...progress.completedStages, stageId] };
      setProgress(next);
      saveProgress(next);
    }
    setView({ name: 'map' });
  };

  const currentStage =
    view.name === 'stage' ? stages.find((s) => s.id === view.id) ?? null : null;

  return (
    <div className="app">
      {musicAvailable && view.name !== 'intro' && (
        <button
          className="icon-btn"
          onClick={toggleMusic}
          aria-label={muted ? 'Включить музыку' : 'Выключить музыку'}
          style={{
            position: 'fixed',
            top: 'max(12px, env(safe-area-inset-top))',
            right: 12,
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 4px 18px rgba(143, 42, 85, 0.12)',
            fontSize: 20,
          }}
        >
          {muted ? '🔇' : '🎵'}
        </button>
      )}

      {view.name === 'intro' && (
        <Intro onStart={start} hasProgress={progress.completedStages.length > 0} />
      )}

      {view.name === 'map' && (
        <MapScreen
          completed={progress.completedStages}
          onOpenStage={(id) => setView({ name: 'stage', id })}
          onFinale={() => setView({ name: 'finale' })}
        />
      )}

      {view.name === 'stage' && currentStage && (
        <StageScreen
          stage={currentStage}
          onDone={() => completeStage(currentStage.id)}
          onBack={() => setView({ name: 'map' })}
        />
      )}

      {view.name === 'finale' && <Finale onBack={() => setView({ name: 'map' })} />}
    </div>
  );
}
