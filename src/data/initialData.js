export const initialWorkouts = [
  {
    id: 1,
    date: "2025-04-16",   // было "16 апр 2025"
    distance: 12,
    time: "1:02:30",
    pace: "5:12",
    mood: "😁",
    shoe: "Nike VF",
  },
  {
    id: 2,
    date: "2025-04-13",
    distance: 8,
    time: "44:20",
    pace: "5:32",
    mood: "🙂",
    shoe: "Adidas SL",
  },
  {
    id: 3,
    date: "2025-04-10",
    distance: 21.1,
    time: "1:48:10",
    pace: "5:07",
    mood: "😄",
    shoe: "Hoka Mach",
  },
];

export const initialShoes = [
  { id: 1, model: 'Pegasus 40', brand: 'Nike', mileage: 245, maxMileage: 800 },
  { id: 2, model: 'Adios 7', brand: 'Adidas', mileage: 98, maxMileage: 800 },
  { id: 3, model: 'Clifton 9', brand: 'Hoka', mileage: 312, maxMileage: 800 },
];

export const initialUser = {
  id: 1,
  name: 'Алексей Алексеев',
  age: 34,
  weight: 72,
  height: 178,
  restingHeartRate: 58,
  maxHeartRate: 185,
  goal: 'sub-3:30 марафон',
  photo: null,
};