import { useState, useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#1e4a76', '#2c6e9e', '#4a8db7', '#7ab0d4', '#a8cce0', '#c9dce8'];

function StatisticsPage() {
  const { workouts, shoes } = useApp();
  const [aggregation, setAggregation] = useState('months');

  // ------ 1. Агрегация данных для графиков ------
  const aggregatedData = useMemo(() => {
    if (!workouts || workouts.length === 0) return [];

    const groups = {};

    workouts.forEach((w) => {
      const date = new Date(w.date);
      if (isNaN(date.getTime())) return; // защита от некорректной даты

      let key;
      switch (aggregation) {
        case 'years':
          key = date.getFullYear().toString();
          break;
        case 'months':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'weeks': {
          const d = new Date(date); // копируем, чтобы не мутировать
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          d.setDate(diff);
          d.setHours(0, 0, 0, 0);
          key = d.toISOString().slice(0, 10);
          break;
        }
        case 'days':
          key = date.toISOString().slice(0, 10);
          break;
        default:
          key = date.toISOString().slice(0, 7);
      }

      if (!groups[key]) {
        groups[key] = { key, totalDistance: 0, totalTime: 0, count: 0 };
      }
      groups[key].totalDistance += w.distance;
      groups[key].count += 1;

      // парсим время
      const timeStr = w.time;
      let minutes = 0;
      if (timeStr && timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length === 3) minutes = +parts[0] * 60 + +parts[1] + +parts[2] / 60;
        else if (parts.length === 2) minutes = +parts[0] + +parts[1] / 60;
      } else if (timeStr) {
        minutes = parseFloat(timeStr);
      }
      groups[key].totalTime += minutes;
    });

    const result = Object.values(groups).map((g) => ({
      ...g,
      avgPace: g.totalDistance > 0 ? (g.totalTime / g.totalDistance) : 0,
    }));
    result.sort((a, b) => a.key.localeCompare(b.key));
    return result;
  }, [workouts, aggregation]);

  // ------ 2. Распределение по дистанциям ------
  const distanceDistribution = useMemo(() => {
    if (!workouts || workouts.length === 0) return [];
    const categories = {
      'до 5 км': 0,
      '5–10 км': 0,
      '10–15 км': 0,
      '15–21 км': 0,
      '>21 км': 0,
    };
    workouts.forEach((w) => {
      const d = w.distance;
      if (d < 5) categories['до 5 км'] += 1;
      else if (d < 10) categories['5–10 км'] += 1;
      else if (d < 15) categories['10–15 км'] += 1;
      else if (d < 21) categories['15–21 км'] += 1;
      else categories['>21 км'] += 1;
    });
    return Object.entries(categories)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [workouts]);

  // ------ 3. Распределение пробега по обуви ------
  const shoeDistribution = useMemo(() => {
    if (!shoes || shoes.length === 0) return [];
    return shoes.map((shoe) => ({
      name: `${shoe.brand} ${shoe.model}`,
      value: shoe.mileage || 0,
    }));
  }, [shoes]);

  // ------ 4. Общие метрики ------
  const totalDistance = workouts.reduce((sum, w) => sum + w.distance, 0);
  const totalWorkouts = workouts.length;
  const avgPace = totalDistance > 0 ? (workouts.reduce((sum, w) => sum + parseFloat(w.pace || 0), 0) / totalWorkouts) : 0;
  const avgDistance = totalWorkouts > 0 ? totalDistance / totalWorkouts : 0;

  return (
    <div className="statistics-page">
      <h2 className="page-title">Статистика</h2>

      {/* Карточки метрик */}
      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-card-label">Всего км</span>
          <span className="stat-card-value">{totalDistance.toFixed(1)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Тренировок</span>
          <span className="stat-card-value">{totalWorkouts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Средний темп</span>
          <span className="stat-card-value">{avgPace.toFixed(2)} мин/км</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Средняя дистанция</span>
          <span className="stat-card-value">{avgDistance.toFixed(1)} км</span>
        </div>
      </div>

      {/* Переключатель агрегации */}
      <div className="aggregation-switch">
        <button
          className={aggregation === 'years' ? 'active' : ''}
          onClick={() => setAggregation('years')}
        >
          Годы
        </button>
        <button
          className={aggregation === 'months' ? 'active' : ''}
          onClick={() => setAggregation('months')}
        >
          Месяцы
        </button>
        <button
          className={aggregation === 'weeks' ? 'active' : ''}
          onClick={() => setAggregation('weeks')}
        >
          Недели
        </button>
        <button
          className={aggregation === 'days' ? 'active' : ''}
          onClick={() => setAggregation('days')}
        >
          Дни
        </button>
      </div>

      {/* График объёма */}
      <div className="chart-container">
        <h3>Пробег по периодам</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="key" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalDistance" fill="#1e4a76" name="Километры" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* График темпа */}
      <div className="chart-container">
        <h3>Средний темп по периодам</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="key" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgPace" stroke="#ff7300" name="Темп (мин/км)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Круговые диаграммы */}
      <div className="charts-row">
        <div className="chart-container half">
          <h3>Распределение по дистанциям</h3>
          {distanceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-message">Нет данных для отображения</p>
          )}
        </div>

        <div className="chart-container half">
          <h3>Пробег по обуви</h3>
          {shoeDistribution.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={shoeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {shoeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-message">Нет данных по обуви</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;