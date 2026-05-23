import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import UserCard from "./components/UserCard";
import UserDetails from "./components/UserDetails";
import StatsPanel from "./components/StatsPanel";
import WorkoutList from "./components/WorkoutList";
import ShoesSection from "./components/ShoesSection";
import RaceSection from "./components/RaceSection";
import RecordsList from "./components/RecordsList";
import Footer from "./components/Footer";
import AddWorkoutModal from "./components/AddWorkoutModal";
import { initialWorkouts } from "./data/initialData";
import EditWorkoutModal from './components/EditWorkoutModal';


function App() {
  // Состояние тренировок с загрузкой из localStorage
  const [workouts, setWorkouts] = useState(() => {
    //getItem читает значение по ключу "rundefull_workouts". Если ключа нет, вернёт null.
    const saved = localStorage.getItem("rundefull_workouts");
    if (saved) {
      return JSON.parse(saved);
    } else {
      return initialWorkouts;
    }
    //Если saved не пустой (то есть есть сохранённые данные), то JSON.parse(saved) превращает
    // строку обратно в массив объектов (потому что в localStorage можно хранить только строки).
    //Если saved === null, то возвращаем initialWorkouts (массив из отдельного файла).
  });

  // Сохранение в localStorage при каждом изменении тренировок
  useEffect(() => {
    console.log('Сохраняю тренировки', workouts);
    localStorage.setItem("rundefull_workouts", JSON.stringify(workouts));
  }, [workouts]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const addWorkout = (newWorkout) => {
    setWorkouts([newWorkout, ...workouts]);
  };
  const totalWorkouts = workouts.length;
  const totalDistance = workouts
    .reduce((sum, w) => sum + w.distance, 0)
    .toFixed(1);

  const deleteWorkout = (id) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.filter((workout) => workout.id !== id),
    );
  };
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (workout) => {
    setEditingWorkout(workout);
    setIsEditModalOpen(true);
  };

  const updateWorkout = (updatedWorkout) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((w) =>
        w.id === updatedWorkout.id ? updatedWorkout : w,
      ),
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
const workoutsPerPage = 3;

// Вычисление индексов и отображаемых тренировок
const indexOfLastWorkout = currentPage * workoutsPerPage;
const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
const currentWorkouts = workouts.slice(indexOfFirstWorkout, indexOfLastWorkout);

// Общее количество страниц
const totalPages = Math.ceil(workouts.length / workoutsPerPage);

// Функции смены страницы
const goToNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};
const goToPrevPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};
const goToPage = (page) => setCurrentPage(page);

  return (
    <>
      <main className="app-container">
        <Header />
        <section
          className="user-stats-row"
          aria-label="Информация о пользователе и статистика"
        >
          <UserCard />
          <UserDetails />
          <StatsPanel
            totalWorkouts={totalWorkouts}
            totalDistance={totalDistance}
          />
        </section>

        <div className="two-columns">
          <section className="left-column" aria-label="Тренировки и обувь">
            <button
              className="add-workout-btn"
              onClick={() => setIsModalOpen(true)}
            >
              + Добавить тренировку
            </button>

            <WorkoutList
              workouts={currentWorkouts} 
  onDeleteWorkout={deleteWorkout} 
  onEditWorkout={openEditModal}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={goToPage}
  onPrevPage={goToPrevPage}
  onNextPage={goToNextPage}
            />
            <ShoesSection />
          </section>

          <section className="right-column" aria-label="Соревнования и рекорды">
            <RaceSection />
            <RecordsList />
          </section>
        </div>

        <Footer />
        {/* Условный рендер модалки */}
        {isModalOpen && (
          <AddWorkoutModal
            onClose={() => setIsModalOpen(false)}
            onAdd={addWorkout}
          />
        )}
        {/* Рендер модалки редактирования */}
        {isEditModalOpen && (
          <EditWorkoutModal
            workout={editingWorkout}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={updateWorkout}
          />
        )}
      </main>
    </>
  );
}

export default App;
