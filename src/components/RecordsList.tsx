import { useMemo } from 'react';
import { useApp } from '../hooks/useApp';

// Ключи рекордов
type RecordKey = '10km' | 'half' | 'marathon';

// Лучшее время в секундах (или null, если нет забегов на эту дистанцию)
type BestRecords = Record<RecordKey, number | null>;

// Отформатированное время
type FormattedRecords = Record<RecordKey, string>;

// Утилиты выносим за пределы компонента — они чистые, не зависят от пропсов/состояния
function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return Infinity;
  let totalSeconds = 0;
  if (timeStr.includes(':')) {
    const parts = timeStr.split(':');
    if (parts.length === 3) {
      totalSeconds = +parts[0] * 3600 + +parts[1] * 60 + +parts[2];
    } else if (parts.length === 2) {
      totalSeconds = +parts[0] * 60 + +parts[1];
    }
  } else {
    totalSeconds = parseFloat(timeStr) * 60;
  }
  return totalSeconds;
}

function formatTime(totalSeconds: number): string {
  if (!totalSeconds || !isFinite(totalSeconds)) return '—';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function isDistance(actual: number, target: number): boolean {
  return Math.abs(actual - target) < 0.2;
}

function RecordsList() {
  const { workouts } = useApp();

  const records = useMemo<FormattedRecords>(() => {
    const best: BestRecords = {
      '10km': null,
      'half': null,
      'marathon': null,
    };

    workouts.forEach((w) => {
      const dist = w.distance;
      const timeSec = parseTimeToSeconds(w.time);
      if (timeSec === Infinity) return;

      if (isDistance(dist, 10)) {
        if (best['10km'] === null || timeSec < best['10km']) {
          best['10km'] = timeSec;
        }
      } else if (isDistance(dist, 21.0975)) {
        if (best['half'] === null || timeSec < best['half']) {
          best['half'] = timeSec;
        }
      } else if (isDistance(dist, 42.195)) {
        if (best['marathon'] === null || timeSec < best['marathon']) {
          best['marathon'] = timeSec;
        }
      }
    });

    return {
      '10km': formatTime(best['10km'] ?? Infinity),
      'half': formatTime(best['half'] ?? Infinity),
      'marathon': formatTime(best['marathon'] ?? Infinity),
    };
  }, [workouts]);

  return (
    <section className="records-section" aria-labelledby="records-heading">
      <h2 id="records-heading" className="section-title" style={{ marginTop: '2rem' }}>
        Мои рекорды
      </h2>
      <ul className="records-list">
        <li className="record-item">
          <span className="record-dist">10 км</span>
          <span className="record-time">{records['10km']}</span>
        </li>
        <li className="record-item">
          <span className="record-dist">Полумарафон</span>
          <span className="record-time">{records['half']}</span>
        </li>
        <li className="record-item">
          <span className="record-dist">Марафон</span>
          <span className="record-time">{records['marathon']}</span>
        </li>
      </ul>
    </section>
  );
}

export default RecordsList;