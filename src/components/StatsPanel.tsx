// src/components/StatsPanel.tsx
import type { ChangeEvent } from 'react';
import type { Period } from '../types';

interface StatsPanelProps {
  totalWorkouts: number;
  totalDistance: string;
  period: Period;
  onPeriodChange: (period: Period) => void;
}

function StatsPanel({
  totalWorkouts,
  totalDistance,
  period,
  onPeriodChange,
}: StatsPanelProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onPeriodChange(e.target.value as Period);
  };

  return (
    <div className="stats-block">
      <div className="stat-item">
        <span className="stat-label">Количество тренировок</span>
        <span className="stat-number">{totalWorkouts}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Дистанция</span>
        <span className="stat-number">
          {totalDistance} <span className="stat-unit">км</span>
        </span>
      </div>
      <select
        className="period-select"
        value={period}
        onChange={handleChange}
        aria-label="Период статистики"
      >
        <option value="week">Неделя</option>
        <option value="month">Месяц</option>
        <option value="year">Год</option>
        <option value="all">Все время</option>
      </select>
    </div>
  );
}

export default StatsPanel;