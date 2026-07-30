import { useMemo } from 'react';
import { useApp } from '../hooks/useApp';

function RecordsList() {
  const { workouts } = useApp();

  const records = useMemo(() => {
    const best = {
      '10km': null,
      'half': null,
      'marathon': null,
    };

    // Парсинг времени в секунды
    const parseTimeToSeconds = (timeStr) => {
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
        totalSeconds = parseFloat(timeStr) * 60; // предположим минуты
      }
      return totalSeconds;
    };

    // Форматирование секунд в ч:мм:сс или мм:сс
    const formatTime = (totalSeconds) => {
      if (!totalSeconds || !isFinite(totalSeconds)) return '—';
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    // Функция проверки дистанции с погрешностью 0.2 км
    const isDistance = (actual, target) => Math.abs(actual - target) < 0.2;

    workouts.forEach((w) => {
      const dist = w.distance;
      const timeSec = parseTimeToSeconds(w.time);
      if (timeSec === Infinity) return;

      if (isDistance(dist, 10)) {
        if (best['10km'] === null || timeSec < best['10km']) best['10km'] = timeSec;
      } else if (isDistance(dist, 21.0975)) {
        if (best['half'] === null || timeSec < best['half']) best['half'] = timeSec;
      } else if (isDistance(dist, 42.195)) {
        if (best['marathon'] === null || timeSec < best['marathon']) best['marathon'] = timeSec;
      }
    });

    return {
      '10km': formatTime(best['10km']),
      'half': formatTime(best['half']),
      'marathon': formatTime(best['marathon']),
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