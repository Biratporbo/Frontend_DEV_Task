import { render, screen } from '@testing-library/react';
import App from './App';

// Polyfill ResizeObserver for Recharts ResponsiveContainer in JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('OrderPulse Analytics Dashboard', () => {
  test('renders application header and export button', () => {
    render(<App />);
    expect(screen.getByText('OrderPulse')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
  });

  test('renders all four KPI summary widgets', () => {
    render(<App />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
  });

  test('renders chart sections and Recent Orders table', () => {
    render(<App />);
    expect(screen.getByText(/Revenue & Sales Trend/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Status Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Orders/i)).toBeInTheDocument();
  });

  test('renders colored status indicators for all four order states', () => {
    render(<App />);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Processing').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cancelled').length).toBeGreaterThan(0);
  });
});
