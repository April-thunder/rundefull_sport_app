import { useState } from 'react';
import EditWorkoutModal from './EditWorkoutModal';
import mapImg from '../assets/road-map.png';
import temp from '../assets/temp.png';
import heartRate from '../assets/heart-rate.png';
import { formatDate, formatDistance } from '../utils/dateUtils';

function WorkoutDetailModal({ workout, shoes, onClose, onUpdate, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить тренировку от ${formatDate(workout.date)}?`)) {
      onDelete(workout.id);
      onClose();
    }
  };

  const avgHeartRate = workout.avgHeartRate || '—';
  const maxHeartRate = workout.maxHeartRate || '—';

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content workout-detail-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            ✖
          </button>

          <div className="detail-header">
            <div className="detail-field">
              <span className="detail-label">Дата</span>
              <span className="detail-value">{formatDate(workout.date)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Дистанция</span>
              <span className="detail-value">{formatDistance(workout.distance)} км</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Время</span>
              <span className="detail-value">{workout.time}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Темп</span>
              <span className="detail-value">{workout.pace} мин/км</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Самочувствие</span>
              <span className="detail-value">{workout.mood}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Обувь</span>
              <span className="detail-value">{workout.shoe}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Ср. пульс</span>
              <span className="detail-value">{avgHeartRate}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Макс. пульс</span>
              <span className="detail-value">{maxHeartRate}</span>
            </div>
          </div>

          <div className="detail-map-and-charts">
            <div className="detail-map">
              <img src={mapImg} alt="Карта маршрута" />
            </div>
            <div className="detail-charts-stack">
              <div className="chart">
                <div className="chart-title">Темп по дистанции</div>
                <img src={temp} alt="График темпа" />
              </div>
              <div className="chart">
                <div className="chart-title">Пульс по дистанции</div>
                <img src={heartRate} alt="График пульса" />
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button className="detail-edit" onClick={handleEdit}>
              ✎ Редактировать
            </button>
            <button className="detail-delete" onClick={handleDelete}>
              ✖ Удалить
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditWorkoutModal
          workout={workout}
          shoes={shoes}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updated) => {
            onUpdate(updated);
            setShowEditModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

export default WorkoutDetailModal;