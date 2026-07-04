// src/context/AppContext.jsx
import { useState, useEffect } from 'react';
import { AppContext } from './context';
import { initialWorkouts, initialShoes, initialUser } from '../data/initialData';
import { parseRussianDateToISO } from '../utils/dateUtils';

export function AppProvider({ children }) {
  // Тренировки с миграцией дат
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('rundefull_workouts');
    let parsed = saved ? JSON.parse(saved) : initialWorkouts;
    const migrated = parsed.map(w => {
      if (w.date && typeof w.date === 'string' && w.date.match(/[а-я]/i)) {
        const iso = parseRussianDateToISO(w.date);
        if (iso) {
          return { ...w, date: iso };
        }
      }
      return w;
    });
    return migrated;
  });
  useEffect(() => {
    localStorage.setItem('rundefull_workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Обувь с миграцией
  const [shoes, setShoes] = useState(() => {
    const saved = localStorage.getItem('rundefull_shoes');
    if (saved) {
      const parsed = JSON.parse(saved);
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

  const [period, setPeriod] = useState('month');

  const addWorkout = (workout) => setWorkouts(prev => [workout, ...prev]);
  const updateWorkout = (updated) => setWorkouts(prev => prev.map(w => w.id === updated.id ? updated : w));
  const deleteWorkout = (id) => setWorkouts(prev => prev.filter(w => w.id !== id));
  const addShoe = (shoe) => setShoes(prev => [shoe, ...prev]);
  const updateUser = (newData) => setUser(prev => ({ ...prev, ...newData }));

  const filterByPeriod = (periodValue) => {
    if (periodValue === 'all') return workouts;

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