// src/pages/HomePage.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  // Получаем данные и функции из контекста
  const {
    workouts,
    shoes,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addShoe,
  } = useApp();

  // Локальные состояния для UI этой страницы
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddShoeModalOpen, setIsAddShoeModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const workoutsPerPage = 3;
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = workouts.slice(indexOfFirstWorkout, indexOfLastWorkout);
  const totalPages = Math.ceil(workouts.length / workoutsPerPage);
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToPage = (page) => setCurrentPage(page);

  // Обработчики
  const openEditModal = (workout) => {
    setEditingWorkout(workout);
    setIsEditModalOpen(true);
  };
  const openWorkoutDetail = (workout) => {
    setSelectedWorkout(workout);
    setIsDetailModalOpen(true);
  };

  // Вычисляем общую статистику для StatsPanel (можно вынести в утилиту)
  const totalWorkouts = workouts.length;
  const totalDistance = workouts.reduce((sum, w) => sum + w.distance, 0).toFixed(1);

  return (
    <>
      {/* Верхняя секция пользователя и статистики */}
      <section className="user-stats-row" aria-label="Информация о пользователе и статистика">
        <UserCard />
        <UserDetails />
        <StatsPanel totalWorkouts={totalWorkouts} totalDistance={totalDistance} />
      </section>

      <div className="two-columns">
        {/* Левая колонка: тренировки и обувь */}
        <section className="left-column" aria-label="Тренировки и обувь">
          <div className="section-header">
            <h2 className="section-title">Тренировки</h2>
            <button className="add-icon-btn" onClick={() => setIsModalOpen(true)}>+</button>
          </div>

          <WorkoutList
            workouts={currentWorkouts}
            onWorkoutClick={openWorkoutDetail}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />

          <ShoesSection shoes={shoes} onAddShoe={() => setIsAddShoeModalOpen(true)} />
        </section>

        {/* Правая колонка: соревнования и рекорды */}
        <section className="right-column" aria-label="Соревнования и рекорды">
          <RaceSection />
          <RecordsList />
        </section>
      </div>

      {/* Модалки */}
      {isModalOpen && (
        <AddWorkoutModal
          shoes={shoes}
          onClose={() => setIsModalOpen(false)}
          onAdd={addWorkout}
        />
      )}
      {isEditModalOpen && editingWorkout && (
        <EditWorkoutModal
          workout={editingWorkout}
          shoes={shoes}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={updateWorkout}
        />
      )}
      {isDetailModalOpen && selectedWorkout && (
        <WorkoutDetailModal
          workout={selectedWorkout}
          shoes={shoes}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdate={updateWorkout}
          onDelete={deleteWorkout}
        />
      )}
      {isAddShoeModalOpen && (
        <AddShoeModal
          onClose={() => setIsAddShoeModalOpen(false)}
          onAdd={addShoe}
        />
      )}
    </>
  );
}

export default HomePage;