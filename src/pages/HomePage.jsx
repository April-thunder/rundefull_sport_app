import { useState } from 'react'; // это хук React. Он позволяет добавить локальное состояние в функциональный компонент.
import { useApp } from '../hooks/useApp'; // это кастомный хук, который возвращает данные и функции из контекста (AppContext). Он использует хук useContext под капотом.
import UserCard from '../components/UserCard'; // этот и ниже - мои компоненты. Каждый из них — это тоже функции, которые возвращают JSX.
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

function HomePage() { //это функциональный компонент. Он принимает пропсы (здесь их нет, всё берётся из контекста).
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
  } = useApp(); //возвращает объект с данными и функциями. Мы деструктурируем его, чтобы получить нужные поля

  // Модалки (единое состояние)
  const [modal, setModal] = useState(null); // useState — хук для создания локального состояния.
// modal — текущее состояние модального окна. Изначально null (ничего не открыто).
// setModal — функция для изменения этого состояния.

  // Пагинация (для всех тренировок)
  const [currentPage, setCurrentPage] = useState(1); // currentPage — номер текущей страницы (по умолчанию 1).
  const workoutsPerPage = 3; //workoutsPerPage — сколько тренировок на одной странице (3).
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date)); //создаётся копия массива workouts ([...workouts]), затем сортируется по дате (от новых к старым). 
  //Важно: sort мутирует массив, поэтому мы сначала создаём копию.
  const indexOfLastWorkout = currentPage * workoutsPerPage; //индексы для slice.
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = sortedWorkouts.slice(indexOfFirstWorkout, indexOfLastWorkout); //подмассив тренировок для текущей страницы.
  const totalPages = Math.ceil(sortedWorkouts.length / workoutsPerPage); // общее количество страниц.

  // Данные для статистики (фильтрация по периоду)
  const filteredWorkouts = filterByPeriod(period); //функция из контекста, которая возвращает только те тренировки, которые попадают в выбранный период (Неделя, Месяц, Год, Всё время).
  const filteredTotalWorkouts = filteredWorkouts.length; //количество тренировок за период.
  const filteredTotalDistance = filteredWorkouts //общая дистанция за период, суммируется через reduce, округляется до одного знака после запятой (toFixed(1)).
    .reduce((sum, w) => sum + w.distance, 0)
    .toFixed(1);

  const goToNextPage = () => { //Это (и goToPrevPage и goToPage) обработчики событий, которые вызываются при нажатии на кнопки пагинации.
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); //Они проверяют границы и обновляют currentPage через setCurrentPage, что вызывает перерендер компонента с новыми данными.
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToPage = (page) => setCurrentPage(page);


  //Эти функции изменяют состояние modal. Вместо передачи данных напрямую мы передаём объект с типом и (если нужно) данными.
//Например, при открытии деталей тренировки мы передаём объект тренировки в поле data.
//При закрытии устанавливаем null, чтобы модалка исчезла.
  const openAddWorkout = () => setModal({ type: 'add' });
  const openDetailWorkout = (workout) => setModal({ type: 'detail', data: workout });
  const openAddShoe = () => setModal({ type: 'addShoe' });
  const closeModal = () => setModal(null);

  //Рендеринг (JSX)
  return (
    <>
      <section className="user-stats-row" aria-label="Информация о пользователе и статистика">
        {/* ниже компоненты, которые сами получают данные из контекста (они используют useApp() внутри). */}
        <UserCard /> 
        <UserDetails />
        <StatsPanel
        // получает пропсы: количество тренировок, дистанцию, текущий период и функцию для его изменения. 
        // Это пример управляемого компонента — он получает данные от родителя и сообщает об изменениях через колбэк.
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
    shoes={shoes}   
    onClose={closeModal}
    onAdd={addShoe}
  />
)}
    </>
  );
}

export default HomePage;