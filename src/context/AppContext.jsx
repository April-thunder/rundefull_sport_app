// src/context/AppContext.jsx
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

  // ✅ ИСПРАВЛЕННАЯ фильтрация тренировок по периоду (без мутации)
  const filterByPeriod = (periodValue) => {
    const now = new Date();
    let startDate;

    switch (periodValue) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return workouts;
    }

    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startDate;
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