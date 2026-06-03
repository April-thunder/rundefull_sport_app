import { createContext, useContext, useState, useEffect } from 'react';
import { initialWorkouts, initialShoes, initialUser } from '../data/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Тренировки
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('rundefull_workouts');
    return saved ? JSON.parse(saved) : initialWorkouts;
  });
  useEffect(() => {
    localStorage.setItem('rundefull_workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Обувь
  const [shoes, setShoes] = useState(() => {
    const saved = localStorage.getItem('rundefull_shoes');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Миграция для добавления brand (если нет)
      if (parsed.length && parsed[0].brand === undefined) {
        return parsed.map(shoe => {
          let brand = '';
          if (shoe.model.includes('Pegasus')) brand = 'Nike';
          else if (shoe.model.includes('Adios')) brand = 'Adidas';
          else if (shoe.model.includes('Clifton')) brand = 'Hoka';
          else brand = 'Other';
          return { ...shoe, brand, maxMileage: shoe.maxMileage || 800 };
        });
      }
      return parsed;
    }
    return initialShoes;
  });
  useEffect(() => {
    localStorage.setItem('rundefull_shoes', JSON.stringify(shoes));
  }, [shoes]);

  // Пользователь
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rundefull_user');
    return saved ? JSON.parse(saved) : initialUser;
  });
  useEffect(() => {
    localStorage.setItem('rundefull_user', JSON.stringify(user));
  }, [user]);

  // Период для статистики
  const [period, setPeriod] = useState('month');

  // CRUD тренировок
  const addWorkout = (workout) => setWorkouts(prev => [workout, ...prev]);
  const updateWorkout = (updated) => setWorkouts(prev => prev.map(w => w.id === updated.id ? updated : w));
  const deleteWorkout = (id) => setWorkouts(prev => prev.filter(w => w.id !== id));

  // CRUD обуви
  const addShoe = (shoe) => setShoes(prev => [shoe, ...prev]);

  // Обновление пользователя
  const updateUser = (newData) => setUser(prev => ({ ...prev, ...newData }));

  // Фильтрация тренировок по периоду
  const filterByPeriod = (periodValue) => {
    const now = new Date();
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      if (periodValue === 'week') return workoutDate >= new Date(now.setDate(now.getDate() - 7));
      if (periodValue === 'month') return workoutDate >= new Date(now.setMonth(now.getMonth() - 1));
      if (periodValue === 'year') return workoutDate >= new Date(now.setFullYear(now.getFullYear() - 1));
      return true;
    });
  };

  return (
    <AppContext.Provider value={{
      workouts,
      shoes,
      user,
      period,
      setPeriod,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      addShoe,
      updateUser,
      filterByPeriod,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}