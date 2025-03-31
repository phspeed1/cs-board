export function formatDate(date: Date | string): string {
  // 문자열이 전달된 경우 Date 객체로 변환
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
} 