function WorkoutItem({ workout, onClick }) {
  return (
    <li className="workout-tab" onClick={() => onClick(workout)}>
      <div className="workout-info">
        <span className="date">{workout.date}</span>
        <span className="distance">{workout.distance} км</span>
        <span>{workout.time}</span>
        <span className="pace">{workout.pace} мин/км</span>
        <span aria-label="Настроение">{workout.mood}</span>
        <span>{workout.shoe}</span>
      </div>
    </li>
  );
}

export default WorkoutItem;