import WorkoutItem from './WorkoutItem';

function WorkoutList({ 
  workouts, 
  onWorkoutClick,
  currentPage, 
  totalPages, 
  onPageChange,
  onPrevPage,
  onNextPage 
}) {
  return (
    <>
      <ul className="workouts-list">
        {workouts.map(workout => (
          <WorkoutItem
            key={workout.id}
            workout={workout}
            onClick={onWorkoutClick}
          />
        ))}
      </ul>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Навигация по тренировкам">
          <button className="page-arrow" onClick={onPrevPage} disabled={currentPage === 1}>
            ←
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-num ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button className="page-arrow" onClick={onNextPage} disabled={currentPage === totalPages}>
            →
          </button>
        </nav>
      )}
    </>
  );
}

export default WorkoutList;