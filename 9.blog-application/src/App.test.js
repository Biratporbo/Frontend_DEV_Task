import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { countWords, isWithinWordLimit, MAX_BLOG_WORDS } from './utils/wordCounter';

test('renders header brand and write article button', async () => {
  render(<App />);
  expect(screen.getByText('BlogVerse')).toBeInTheDocument();
  expect(screen.getByText(/Write Article/i)).toBeInTheDocument();
});

test('renders search input and category filter options', async () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search blogs by keyword/i);
  expect(searchInput).toBeInTheDocument();

  const categoryLabel = screen.getByText(/Category:/i);
  expect(categoryLabel).toBeInTheDocument();
});

test('word counter accurately measures words and enforces 1000-word limit', () => {
  const shortText = 'React is a popular JavaScript library for building user interfaces.';
  expect(countWords(shortText)).toBe(9);
  expect(isWithinWordLimit(shortText)).toBe(true);

  // Generate 1001 words
  const longText = new Array(1001).fill('word').join(' ');
  expect(countWords(longText)).toBe(1001);
  expect(isWithinWordLimit(longText)).toBe(false);

  // Exactly 1000 words
  const exactLimitText = new Array(MAX_BLOG_WORDS).fill('word').join(' ');
  expect(countWords(exactLimitText)).toBe(1000);
  expect(isWithinWordLimit(exactLimitText)).toBe(true);
});
