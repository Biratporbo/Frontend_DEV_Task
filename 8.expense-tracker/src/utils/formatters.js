export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  const dateObj = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getMonthKey = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.substring(0, 7); // e.g. "2026-11"
};

export const getMonthLabel = (yearMonthStr) => {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

export const getShortMonthLabel = (yearMonthStr) => {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit'
  });
};

