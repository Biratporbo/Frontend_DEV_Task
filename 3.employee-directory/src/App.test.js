import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders directory header and initial employees', () => {
  render(<App />);
  expect(screen.getByText(/GreenField Farm/i)).toBeInTheDocument();
  expect(screen.getByText(/Employee Information Directory/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Employees:/i)).toBeInTheDocument();
  expect(screen.getByText('Ramesh Sharma')).toBeInTheDocument();
  expect(screen.getByText('EMP-101')).toBeInTheDocument();
});

test('filters employees by search term', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search by name, ID, or phone/i);

  // Search by name
  fireEvent.change(searchInput, { target: { value: 'Sunita' } });
  expect(screen.getByText('Sunita Verma')).toBeInTheDocument();
  expect(screen.queryByText('Ramesh Sharma')).not.toBeInTheDocument();

  // Search by ID
  fireEvent.change(searchInput, { target: { value: 'EMP-103' } });
  expect(screen.getByText('Kuldeep Singh')).toBeInTheDocument();
  expect(screen.queryByText('Sunita Verma')).not.toBeInTheDocument();
});

test('filters employees by department dropdown', () => {
  render(<App />);
  const deptSelect = screen.getByLabelText(/Department Filter:/i);

  fireEvent.change(deptSelect, { target: { value: 'Dairy & Livestock' } });
  expect(screen.getByText('Sunita Verma')).toBeInTheDocument();
  expect(screen.getByText('Priya Nair')).toBeInTheDocument();
  expect(screen.queryByText('Ramesh Sharma')).not.toBeInTheDocument();
});

test('opens and closes add employee form', () => {
  render(<App />);
  const toggleBtn = screen.getByRole('button', { name: /\+ Add New Employee/i });

  fireEvent.click(toggleBtn);
  expect(screen.getByText(/Add New Farm Employee/i)).toBeInTheDocument();

  const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
  fireEvent.click(cancelBtn);
  expect(screen.queryByText(/Add New Farm Employee/i)).not.toBeInTheDocument();
});

