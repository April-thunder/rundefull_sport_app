import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import UserCard from '../components/UserCard';
import UserDetails from '../components/UserDetails';
import StatsPanel from '../components/StatsPanel';
import WorkoutList from '../components/WorkoutList';
import ShoesSection from '../components/ShoesSection';
import RaceSection from '../components/RaceSection';
import RecordsList from '../components/RecordsList';
import AddWorkoutModal from '../components/AddWorkoutModal';
import EditWorkoutModal from '../components/EditWorkoutModal';
import WorkoutDetailModal from '../components/WorkoutDetailModal';
import AddShoeModal from '../components/AddShoeModal';

function HomePage() {
  const {
    workouts,
    shoes,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addShoe,
    period,
    setPeriod,
    filterByPeriod,
  } = useApp();

  // Модалки (единое состояние)
  const [modal, setModal] = useState(null);

  // Пагинация (для всех тренировок)
  const [currentPage, setCurrentPage] = useState(1);
  const workoutsPerPage = 3;
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = sortedWorkouts.slice(indexOfFirstWorkout, indexOfLastWorkout);
  const totalPages = Math.ceil(sortedWorkouts.length / workoutsPerPage);

  // Данные для статистики (фильтрация по периоду)
  const filteredWorkouts = filterByPeriod(period);
  const filteredTotalWorkouts = filteredWorkouts.length;
  const filteredTotalDistance = filteredWorkouts
    .reduce((sum, w) => sum + w.distance, 0)
    .toFixed(1);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToPage = (page) => setCurrentPage(page);

  const openAddWorkout = () => setModal({ type: 'add' });
  const openDetailWorkout = (workout) => setModal({ type: 'detail', data: workout });
  const openAddShoe = () => setModal({ type: 'addShoe' });
  const closeModal = () => setModal(null);

  return (
    <>
      <section className="user-stats-row" aria-label="Информация о пользователе и статистика">
        <UserCard />
        <UserDetails />
        <StatsPanel
          totalWorkouts={filteredTotalWorkouts}
          totalDistance={filteredTotalDistance}
          period={period}
          onPeriodChange={setPeriod}
        />
      </section>

      <div className="two-columns">
        <section className="left-column" aria-label="Тренировки и обувь">
          <div className="section-header">
            <h2 className="section-title">Тренировки</h2>
            <button className="add-icon-btn" onClick={openAddWorkout}>+</button>
          </div>

          <WorkoutList
            workouts={currentWorkouts}
            onWorkoutClick={openDetailWorkout}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />

          <ShoesSection shoes={shoes} onAddShoe={openAddShoe} />
        </section>

        <section className="right-column" aria-label="Соревнования и рекорды">
          <RaceSection />
          <RecordsList />
        </section>
      </div>

      {modal?.type === 'add' && (
        <AddWorkoutModal
          shoes={shoes}
          onClose={closeModal}
          onAdd={addWorkout}
        />
      )}
      {modal?.type === 'edit' && (
        <EditWorkoutModal
          workout={modal.data}
          shoes={shoes}
          onClose={closeModal}
          onUpdate={updateWorkout}
        />
      )}
      {modal?.type === 'detail' && (
        <WorkoutDetailModal
          workout={modal.data}
          shoes={shoes}
          onClose={closeModal}
          onUpdate={updateWorkout}
          onDelete={deleteWorkout}
        />
      )}
      {modal?.type === 'addShoe' && (
        <AddShoeModal
          onClose={closeModal}
          onAdd={addShoe}
        />
      )}
    </>
  );
}

export default HomePage;