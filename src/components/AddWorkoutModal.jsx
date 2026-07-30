import { useState } from 'react';

function AddWorkoutModal({ shoes, onClose, onAdd }) {
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [mood, setMood] = useState('😐');
  const [shoeId, setShoeId] = useState(shoes[0]?.id || '');
  const [selectedPreset, setSelectedPreset] = useState(''); // '10km' | 'half' | 'marathon'

  const presets = [
    { id: '10km', label: '10 км', value: 10 },
    { id: 'half', label: 'Полумарафон', value: 21.0975 },
    { id: 'marathon', label: 'Марафон', value: 42.195 },
  ];

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setDistance(preset.value.toString());
    }
  };

  const handleDistanceChange = (e) => {
    const value = e.target.value;
    setDistance(value);
    // Проверяем, совпадает ли введённая дистанция с одним из пресетов (с точностью до 0.01)
    const matched = presets.find(p => Math.abs(parseFloat(value) - p.value) < 0.01);
    if (matched) {
      setSelectedPreset(matched.id);
    } else {
      setSelectedPreset('');
    }
  };

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

    const selectedShoe = shoes.find(shoe => shoe.id === parseInt(shoeId));
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
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <div className="preset-group">
            <span className="preset-label">Быстрый выбор дистанции:</span>
            <div className="preset-options">
              {presets.map((p) => (
                <label key={p.id} className="preset-option">
                  <input
                    type="radio"
                    name="preset"
                    value={p.id}
                    checked={selectedPreset === p.id}
                    onChange={() => handlePresetChange(p.id)}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <label>
            Дистанция (км):
            <input
              type="number"
              step="0.1"
              value={distance}
              onChange={handleDistanceChange}
              required
            />
          </label>

          <label>
            Время (ч:мм:сс или мм:сс):
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>

          <label>
            Самочувствие:
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              <option>😁</option>
              <option>🙂</option>
              <option>😐</option>
              <option>😔</option>
            </select>
          </label>

          <label>
            Обувь:
            <select value={shoeId} onChange={(e) => setShoeId(e.target.value)}>
              {shoes.map((shoe) => (
                <option key={shoe.id} value={shoe.id}>
                  {shoe.brand} {shoe.model} (пробег: {shoe.mileage} км)
                </option>
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