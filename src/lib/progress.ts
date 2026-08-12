const KEY = 'dasha-quest-progress-v1';

export interface Progress {
  completedStages: string[];
  started: boolean;
}

const empty: Progress = { completedStages: [], started: false };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Progress;
    if (!Array.isArray(parsed.completedStages)) return empty;
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // localStorage может быть недоступен (приватный режим) — игра продолжит работать без сохранения
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
