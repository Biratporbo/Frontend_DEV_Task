// src/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Student Information Portal', () => {
  test('renders header title and statistics via props', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /Student Information Portal/i })).toBeInTheDocument();
    expect(screen.getByText(/Total Enrolled/i)).toBeInTheDocument();
    expect(screen.getByText(/Average CGPA/i)).toBeInTheDocument();
    expect(screen.getByText(/Top CGPA/i)).toBeInTheDocument();
  });

  test('renders student cards with required fields: Name, Roll No, Department, Semester, and CGPA', () => {
    render(<App />);
    // Check Aarav Sharma and fields
    expect(screen.getByText(/Aarav Sharma/i)).toBeInTheDocument();
    expect(screen.getByText(/CS-2023-014/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Computer Science & Engineering/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/6th Semester/i).length).toBeGreaterThan(0);
    expect(screen.getByText('9.85')).toBeInTheDocument();
  });

  test('sorts students by CGPA High to Low when clicked', () => {
    render(<App />);
    const highToLowBtn = screen.getByRole('button', { name: /high to low/i });
    fireEvent.click(highToLowBtn);

    // After sorting High to Low, Aarav Sharma (9.85) should have Rank #1
    expect(screen.getByTitle(/Ranked #1 by CGPA/i)).toHaveTextContent('Rank #1');
    const studentCards = screen.getAllByRole('article');
    expect(studentCards[0]).toHaveTextContent('Aarav Sharma');
    expect(studentCards[0]).toHaveTextContent('9.85');
  });

  test('sorts students by CGPA Low to High when clicked', () => {
    render(<App />);
    const lowToHighBtn = screen.getByRole('button', { name: /low to high/i });
    fireEvent.click(lowToHighBtn);

    // After sorting Low to High, Kabir Roy (6.95) should be first
    const studentCards = screen.getAllByRole('article');
    expect(studentCards[0]).toHaveTextContent('Kabir Roy');
    expect(studentCards[0]).toHaveTextContent('6.95');
    expect(studentCards[0]).toHaveTextContent('Rank #1');
  });

  test('allows resetting sort to default order', () => {
    render(<App />);
    const lowToHighBtn = screen.getByRole('button', { name: /low to high/i });
    fireEvent.click(lowToHighBtn);

    // Reset button should now be visible
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);

    // Back to default order (first student is Aarav Sharma without rank)
    const studentCards = screen.getAllByRole('article');
    expect(studentCards[0]).toHaveTextContent('Aarav Sharma');
    expect(screen.queryByTitle(/Ranked #1 by CGPA/i)).not.toBeInTheDocument();
  });

  test('filters students by search input', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search by student name or roll number/i);
    fireEvent.change(searchInput, { target: { value: 'Priya' } });

    expect(screen.getByText(/Priya Patel/i)).toBeInTheDocument();
    expect(screen.queryByText(/Aarav Sharma/i)).not.toBeInTheDocument();
  });

  test('renders footer with copyright details via props', () => {
    render(<App />);
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});

