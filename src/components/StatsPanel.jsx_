function StatsPanel({ totalWorkouts, totalDistance, period, onPeriodChange }) {
  return (
    <div className="stats-block">
      <div className="stat-item">
        <span className="stat-label">Количество тренировок</span>
        <span className="stat-number">{totalWorkouts}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Дистанция</span>
        <span className="stat-number">{totalDistance} <span className="stat-unit">км</span></span>
      </div>
      <select
        className="period-select"
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
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