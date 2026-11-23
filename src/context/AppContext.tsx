// src/context/AppContext.tsx
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './context';
import { initialWorkouts, initialShoes, initialUser } from '../data/initialData';
import { parseRussianDateToISO } from '../utils/dateUtils';
import type { Workout, Shoe, User, Period } from '../types';
import { isWorkoutArray, isShoeArray, isUser } from '../types';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // ---------- Аутентификация ----------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  const saved = localStorage.getItem('rundefull_auth');
  if (!saved) return true;
  const parsed: unknown = JSON.parse(saved);
  return typeof parsed === 'boolean' ? parsed : true;
});
  useEffect(() => {
    localStorage.setItem('rundefull_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('rundefull_auth', JSON.stringify(true));
  };
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('rundefull_auth', JSON.stringify(false));
  };

  // ---------- Тренировки ----------
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
  const saved = localStorage.getItem('rundefull_workouts');
  const parsed: unknown = saved ? JSON.parse(saved) : initialWorkouts;
  const safeWorkouts: Workout[] = isWorkoutArray(parsed) ? parsed : initialWorkouts;
  const migrated = safeWorkouts.map((w) => {
    if (w.date && typeof w.date === 'string' && w.date.match(/[а-я]/i)) {
      const iso = parseRussianDateToISO(w.date);
      if (iso) return { ...w, date: iso };
    }
    return w;
  });
  return migrated;
});
  useEffect(() => {
    localStorage.setItem('rundefull_workouts', JSON.stringify(workouts));
  }, [workouts]);

  // ---------- Обувь ----------
  const [shoes, setShoes] = useState<Shoe[]>(() => {
  const saved = localStorage.getItem('rundefull_shoes');
  if (saved) {
    const parsed: unknown = JSON.parse(saved);
    if (isShoeArray(parsed)) {
      return parsed.map((shoe) => ({
        ...shoe,
        maxMileage: shoe.maxMileage ?? 800,
      }));
    }
  }
  return initialShoes;
});
  useEffect(() => {
    localStorage.setItem('rundefull_shoes', JSON.stringify(shoes));
  }, [shoes]);

  // ---------- Пользователь ----------
  const [user, setUser] = useState<User>(() => {
  const saved = localStorage.getItem('rundefull_user');
  if (!saved) return initialUser;
  const parsed: unknown = JSON.parse(saved);
  return isUser(parsed) ? parsed : initialUser;
});
  useEffect(() => {
    localStorage.setItem('rundefull_user', JSON.stringify(user));
  }, [user]);

  const [period, setPeriod] = useState<Period>('month');

  // ---------- Функция обновления пробега обуви ----------
  const updateShoeMileage = (shoeId: number, delta: number) => {
    if (!shoeId) return;
    setShoes((prev) => {
      const updated = prev.map((shoe) =>
        shoe.id === shoeId
          ? { ...shoe, mileage: Math.max(0, shoe.mileage + delta) }
          : shoe
      );
      return updated;
    });
  };

  // ---------- CRUD тренировок с обновлением пробега ----------
  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [workout, ...prev]);
    updateShoeMileage(workout.shoeId, workout.distance);
  };

  const updateWorkout = (updated: Workout) => {
    const old = workouts.find((w) => w.id === updated.id);
    if (old) {
      // Вычитаем старую дистанцию из старой обуви
      if (old.shoeId) updateShoeMileage(old.shoeId, -old.distance);
      // Обновляем тренировку
      setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      // Прибавляем новую дистанцию к новой обуви
      if (updated.shoeId) updateShoeMileage(updated.shoeId, updated.distance);
    } else {
      setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    }
  };

  const deleteWorkout = (id: number) => {
    const workout = workouts.find((w) => w.id === id);
    if (workout) {
      if (workout.shoeId) updateShoeMileage(workout.shoeId, -workout.distance);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    }
  };

  // ---------- CRUD обуви ----------
  const addShoe = (shoe: Shoe) => setShoes((prev) => [shoe, ...prev]);

  // ---------- Обновление пользователя ----------
  const updateUser = (newData: Partial<User>) =>
    setUser((prev) => ({ ...prev, ...newData }));

  // ---------- Фильтрация ----------
  const filterByPeriod = (periodValue: Period): Workout[] => {
    if (periodValue === 'all') return workouts;
    const now = new Date();
    let startDate: Date;
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
    return workouts.filter((w) => new Date(w.date) >= startDate);
  };

  return (
    <AppContext.Provider
      value={{
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
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}