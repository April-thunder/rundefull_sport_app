// src/utils/dateUtils.js

/**
 * Форматирует дату из ISO (YYYY-MM-DD) в читаемый вид: "16 апр 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // fallback для некорректных дат
  const day = date.getDate();
  const month = date.toLocaleString('ru', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Парсит русскую дату формата "16 апр 2025" в ISO "2025-04-16"
 * Используется для миграции старых данных из localStorage
 */
export function parseRussianDateToISO(dateStr) {
  if (!dateStr) return null;
  // Если уже ISO (YYYY-MM-DD) – возвращаем как есть
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const months = {
    'янв': 0, 'фев': 1, 'мар': 2, 'апр': 3, 'мая': 4, 'май': 4,
    'июн': 5, 'июл': 6, 'авг': 7, 'сен': 8, 'окт': 9, 'ноя': 10, 'дек': 11,
  };
  const parts = dateStr.trim().split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1].toLowerCase()];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  // Если не удалось распарсить – возвращаем исходную строку
  return dateStr;
}