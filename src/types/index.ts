// src/types/index.ts

export interface Workout {
  id: number;
  date: string;        // ISO формат: "2025-04-16"
  distance: number;    // км
  time: string;        // "1:02:30"
  pace: string;        // "5:12"
  mood: string;        // эмодзи
  shoe: string;        // полное название: "Nike Pegasus 40"
  shoeId: number;
  demo?: boolean;      // опциональное поле — только у демо-тренировок
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
  photo: string | null;  // base64-строка или null
}

export type Period = 'week' | 'month' | 'year' | 'all';

export type PresetId = '10km' | 'half' | 'marathon';

export interface WorkoutPreset {
  id: PresetId;
  label: string;
  value: number;
}