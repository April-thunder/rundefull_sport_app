import { useState } from 'react';
import { initialShoes } from '../data/initialData';

function AddWorkoutModal({ onClose, onAdd }) {
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [mood, setMood] = useState('😐');
  const [shoeId, setShoeId] = useState(initialShoes[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Расчёт темпа: время в минутах / дистанция
    let totalMinutes = 0;
    if (time.includes(':')) {
      const parts = time.split(':');
      if (parts.length === 3) {
        totalMinutes = +parts[0] * 60 + +parts[1] + +parts[2] / 60;
      } else if (parts.length === 2) {
        totalMinutes = +parts[0] + +parts[1] / 60;
      }
    } else {
      totalMinutes = parseFloat(time);
    }
    const pace = (totalMinutes / parseFloat(distance)).toFixed(2);

    const selectedShoe = initialShoes.find(shoe => shoe.id === parseInt(shoeId));
    const newWorkout = {
      id: Date.now(),
      date,
      distance: parseFloat(distance),
      time,
      pace,
      mood,
      shoe: selectedShoe ? selectedShoe.model : '',
      shoeId: parseInt(shoeId),
    };
    onAdd(newWorkout);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Добавить тренировку</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Дата:
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </label>
          <label>
            Дистанция (км):
            <input type="number" step="0.1" value={distance} onChange={e => setDistance(e.target.value)} required />
          </label>
          <label>
            Время (ч:мм:сс или мм:сс):
            <input value={time} onChange={e => setTime(e.target.value)} required />
          </label>
          <label>
            Самочувствие:
            <select value={mood} onChange={e => setMood(e.target.value)}>
              <option>😁</option>
              <option>🙂</option>
              <option>😐</option>
              <option>😔</option>
            </select>
          </label>
          <label>
            Обувь:
            <select value={shoeId} onChange={e => setShoeId(e.target.value)}>
              {initialShoes.map(shoe => (
                <option key={shoe.id} value={shoe.id}>{shoe.model} (пробег: {shoe.mileage} км)</option>
              ))}
            </select>
          </label>
          <div className="modal-buttons">
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWorkoutModal;