function StatsPanel({ totalWorkouts, totalDistance }) {
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
      <label className="visually-hidden" htmlFor="period-select">
        Период статистики
      </label>
      <select id="period-select" className="period-select" defaultValue="Месяц">
        <option>Неделя</option>
        <option>Месяц</option>
        <option>Год</option>
      </select>
    </div>
  );
}

export default StatsPanel;