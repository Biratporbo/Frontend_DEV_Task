export const EXPENSE_CATEGORIES = [
  { id: 'groceries', name: 'Groceries', color: '#10b981', icon: '🛒' },
  { id: 'food-dining', name: 'Food & Dining', color: '#f59e0b', icon: '🍔' },
  { id: 'transportation', name: 'Transportation', color: '#3b82f6', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: '🛍️' },
  { id: 'housing', name: 'Housing & Rent', color: '#8b5cf6', icon: '🏠' },
  { id: 'utilities', name: 'Utilities & Bills', color: '#06b6d4', icon: '💡' },
  { id: 'entertainment', name: 'Entertainment', color: '#f97316', icon: '🎬' },
  { id: 'healthcare', name: 'Healthcare & Medical', color: '#ef4444', icon: '💊' },
  { id: 'education', name: 'Education', color: '#6366f1', icon: '📚' },
  { id: 'travel', name: 'Travel & Vacation', color: '#14b8a6', icon: '✈️' },
  { id: 'other-expense', name: 'Other Expense', color: '#64748b', icon: '📦' }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', color: '#10b981', icon: '💼' },
  { id: 'freelance', name: 'Freelance & Contract', color: '#06b6d4', icon: '💻' },
  { id: 'investment', name: 'Investment & Dividends', color: '#8b5cf6', icon: '📈' },
  { id: 'business', name: 'Business Income', color: '#f59e0b', icon: '🏢' },
  { id: 'bonus', name: 'Bonus & Awards', color: '#eab308', icon: '🎁' },
  { id: 'other-income', name: 'Other Income', color: '#64748b', icon: '💰' }
];

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI / Online',
  'Bank Transfer'
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryMeta = (categoryId, categoryName) => {
  const found = ALL_CATEGORIES.find(
    (c) => c.id === categoryId || c.name.toLowerCase() === (categoryName || '').toLowerCase()
  );
  if (found) return found;
  return { id: 'other', name: categoryName || 'Other', color: '#64748b', icon: '🏷️' };
};

