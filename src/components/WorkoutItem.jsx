function WorkoutItem({ workout, onDelete, onEdit }) {
  const handleDelete = () => {
    if (window.confirm(`Удалить тренировку от ${workout.date}?`)) {
      onDelete();
    }
  };
  return (
    <li className="workout-tab">
      <div className="workout-info">
        <span className="date">{workout.date}</span>
        <span className="distance">{workout.distance} км</span>
        <span>{workout.time}</span>
        <span className="pace">{workout.pace} мин/км</span>
        <span aria-label="Настроение">{workout.mood}</span>
        <span>{workout.shoe}</span>
      </div>
      <div className="workout-actions">
        <button
          className="edit-workout"
          onClick={onEdit}
          aria-label="Редактировать тренировку"
        >
          ✎
        </button>
        <button
          className="delete-workout"
          onClick={handleDelete}
          aria-label="Удалить тренировку"
        >
          ✖
        </button>
      </div>
    </li>
  );
}

export default WorkoutItem;
