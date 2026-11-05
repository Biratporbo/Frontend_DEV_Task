import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock localStorage for test environment
beforeEach(() => {
  localStorage.clear();
});

test('renders header and initial summary cards', () => {
  render(<App />);
  expect(screen.getByText('SpendWise')).toBeInTheDocument();
  expect(screen.getByText(/Financial Summary Overview/i)).toBeInTheDocument();
  expect(screen.getByText(/Net Balance/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Income/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Expenses/i)).toBeInTheDocument();
});

test('filters transactions by search query', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search by title, category/i);

  // Search for keyboard
  fireEvent.change(searchInput, { target: { value: 'Keyboard' } });
  expect(screen.getByText(/Ergonomic Mechanical Keyboard/i)).toBeInTheDocument();
  expect(screen.queryByText(/Italian Bistro Dinner/i)).not.toBeInTheDocument();
});

test('opens add transaction modal and displays controlled form', () => {
  render(<App />);
  const addBtn = screen.getAllByRole('button', { name: /\+ Add/i })[0];
  fireEvent.click(addBtn);

  expect(screen.getByText(/Record New Transaction/i)).toBeInTheDocument();
  expect(screen.getByText(/Transaction Type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description \/ Title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
});
