// src/utils/dateUtils.ts

/**
 * Форматирует дату из ISO (YYYY-MM-DD) в читаемый вид: "16 апр 2025"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const month = date.toLocaleString('ru', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Форматирует дистанцию: если целое число — без десятичных, иначе с одним знаком.
 */
export function formatDistance(km: number): string {
  if (typeof km !== 'number' || isNaN(km)) return '0';
  return km % 1 === 0 ? km.toString() : km.toFixed(1);
}

/**
 * Парсит русскую дату формата "16 апр 2025" в ISO "2025-04-16"
 */
export function parseRussianDateToISO(dateStr: string): string | null {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const months: Record<string, number> = {
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
  return dateStr;
}