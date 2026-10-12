import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Shoe, Workout, PresetId, WorkoutPreset } from '../types';

interface EditWorkoutModalProps {
  workout: Workout;
  shoes: Shoe[];
  onClose: () => void;
  onUpdate: (workout: Workout) => void;
}

function EditWorkoutModal({ workout, shoes, onClose, onUpdate }: EditWorkoutModalProps) {
  const [date, setDate] = useState<string>(workout.date);
  const [distance, setDistance] = useState<string>(workout.distance.toString());
  const [time, setTime] = useState<string>(workout.time);
  const [mood, setMood] = useState<string>(workout.mood);
  const [shoeId, setShoeId] = useState<number>(workout.shoeId || shoes[0]?.id || 0);

  const presets: WorkoutPreset[] = [
    { id: '10km', label: '10 км', value: 10 },
    { id: 'half', label: 'Полумарафон', value: 21.0975 },
    { id: 'marathon', label: 'Марафон', value: 42.195 },
  ];

  // Определяем, соответствует ли текущая дистанция одному из пресетов
  const matchedPreset = presets.find(
    (p) => Math.abs(workout.distance - p.value) < 0.01
  );
  const [selectedPreset, setSelectedPreset] = useState<PresetId | ''>(
    matchedPreset ? matchedPreset.id : ''
  );

  const handlePresetChange = (presetId: PresetId) => {
    setSelectedPreset(presetId);
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setDistance(preset.value.toString());
    }
  };

  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDistance(value);
    const matched = presets.find(
      (p) => Math.abs(parseFloat(value) - p.value) < 0.01
    );
    setSelectedPreset(matched ? matched.id : '');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    const selectedShoe = shoes.find((shoe) => shoe.id === shoeId);
    let fullShoeName = '';
    if (selectedShoe) {
      fullShoeName = selectedShoe.brand
        ? `${selectedShoe.brand} ${selectedShoe.model}`
        : selectedShoe.model;
    }

    const updatedWorkout: Workout = {
      ...workout,
      date,
      distance: parseFloat(distance),
      time,
      pace,
      mood,
      shoe: fullShoeName,
      shoeId,
    };

    onUpdate(updatedWorkout);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Редактировать тренировку</h2>
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
            <select
              value={shoeId}
              onChange={(e) => setShoeId(parseInt(e.target.value, 10))}
            >
              {shoes.map((shoe) => (
                <option key={shoe.id} value={shoe.id}>
                  {shoe.brand} {shoe.model} (пробег: {shoe.mileage} км)
                </option>
              ))}
            </select>
          </label>

          <div className="modal-buttons">
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWorkoutModal;