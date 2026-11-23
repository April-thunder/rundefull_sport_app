// src/types/index.ts

export interface Workout {
  id: number;
  date: string;
  distance: number;
  time: string;
  pace: string;
  mood: string;
  shoe: string;
  shoeId: number;
  demo?: boolean;
  avgHeartRate?: number;
  maxHeartRate?: number;
}

export interface Shoe {
  id: number;
  brand: string;
  model: string;
  mileage: number;
  maxMileage: number;
}

export interface User {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  restingHeartRate: number;
  maxHeartRate: number;
  goal: string;
  photo: string | null;
}

// ========== Type guards ==========

export function isWorkout(v: unknown): v is Workout {
  if (typeof v !== 'object' || v === null) return false;
  const w = v as Record<string, unknown>;
  return (
    typeof w.id === 'number' &&
    typeof w.date === 'string' &&
    typeof w.distance === 'number' &&
    typeof w.time === 'string' &&
    typeof w.pace === 'string' &&
    typeof w.mood === 'string' &&
    typeof w.shoe === 'string' &&
    typeof w.shoeId === 'number'
  );
}

export function isWorkoutArray(v: unknown): v is Workout[] {
  return Array.isArray(v) && v.every(isWorkout);
}

export function isShoe(v: unknown): v is Shoe {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.id === 'number' &&
    typeof s.brand === 'string' &&
    typeof s.model === 'string' &&
    typeof s.mileage === 'number' &&
    typeof s.maxMileage === 'number'
  );
}

export function isShoeArray(v: unknown): v is Shoe[] {
  return Array.isArray(v) && v.every(isShoe);
}

export function isUser(v: unknown): v is User {
  if (typeof v !== 'object' || v === null) return false;
  const u = v as Record<string, unknown>;
  return (
    typeof u.id === 'number' &&
    typeof u.name === 'string' &&
    typeof u.age === 'number' &&
    typeof u.weight === 'number' &&
    typeof u.height === 'number' &&
    typeof u.restingHeartRate === 'number' &&
    typeof u.maxHeartRate === 'number' &&
    typeof u.goal === 'string' &&
    (u.photo === null || typeof u.photo === 'string')
  );
}

export const PERIODS = ['week', 'month', 'year', 'all'] as const;
export type Period = (typeof PERIODS)[number];

export const PRESET_IDS = ['10km', 'half', 'marathon'] as const;
export type PresetId = (typeof PRESET_IDS)[number];

export interface WorkoutPreset {
  id: PresetId;
  label: string;
  value: number;
}