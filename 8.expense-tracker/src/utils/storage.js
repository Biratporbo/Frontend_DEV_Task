import { INITIAL_TRANSACTIONS } from '../data/initialData';

const STORAGE_KEY = 'spendwise_expense_tracker_data_v1';

export const loadTransactionsFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time loading - seed with realistic demo data
      saveTransactionsToStorage(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TRANSACTIONS;
  } catch (err) {
    console.error('Failed to load transactions from localStorage:', err);
    return INITIAL_TRANSACTIONS;
  }
};

export const saveTransactionsToStorage = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to persist transactions to localStorage:', err);
  }
};

export const resetTransactionsToDefault = () => {
  saveTransactionsToStorage(INITIAL_TRANSACTIONS);
  return INITIAL_TRANSACTIONS;
};

export const clearAllTransactions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
  return [];
};

