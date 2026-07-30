export const initialWorkouts = [
  {
    id: 1,
    date: "2025-04-16",
    distance: 12,
    time: "1:02:30",
    pace: "5:12",
    mood: "😁",
    shoe: "Nike Pegasus 40",
    shoeId: 1,
    demo: true,
  },
  {
    id: 2,
    date: "2025-04-13",
    distance: 8,
    time: "44:20",
    pace: "5:32",
    mood: "🙂",
    shoe: "Adidas Adios 7",
    shoeId: 2,
    demo: true,
  },
  {
    id: 3,
    date: "2025-04-10",
    distance: 21.1,
    time: "1:48:10",
    pace: "5:07",
    mood: "😄",
    shoe: "Hoka Clifton 9",
    shoeId: 3,
    demo: true,
  },
];

export const initialShoes = [
  { id: 1, model: 'Pegasus 40', brand: 'Nike', mileage: 12, maxMileage: 800 },
  { id: 2, model: 'Adios 7', brand: 'Adidas', mileage: 8, maxMileage: 800 },
  { id: 3, model: 'Clifton 9', brand: 'Hoka', mileage: 21.1, maxMileage: 800 },
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