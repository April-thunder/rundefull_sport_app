import { createContext } from 'react';
import type { Workout, Shoe, User, Period } from '../types';

export interface AppContextValue {
  workouts: Workout[];
  shoes: Shoe[];
  user: User;
  period: Period;
  isAuthenticated: boolean;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: number) => void;
  addShoe: (shoe: Shoe) => void;
  updateUser: (data: Partial<User>) => void;
  setPeriod: (period: Period) => void;
  filterByPeriod: (period: Period) => Workout[];
  login: () => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);