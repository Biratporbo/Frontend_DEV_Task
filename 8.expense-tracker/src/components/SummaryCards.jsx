import React from 'react';
import { formatCurrency, getShortMonthLabel } from '../utils/formatters';
import {
  IconWallet,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCalendar
} from './Icons';

export default function SummaryCards({
  transactions = [],
  selectedMonth,
  onMonthChange,
  availableMonths = []
}) {
  // Compute totals
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  transactions.forEach((t) => {
    const amt = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount || 0);
    if (t.type === 'income') {
      totalIncome += amt;
      incomeCount += 1;
    } else {
      totalExpenses += amt;
      expenseCount += 1;
    }
  });

  const netBalance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <section className="summary-section">
      <div className="summary-header-row">
        <div>
          <h2 className="section-title">Financial Summary Overview</h2>
          <p className="section-subtitle">Real-time calculations based on your active transactions</p>
        </div>

        {/* Quick Month Selector */}
        <div className="summary-month-selector">
          <IconCalendar size={15} />
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="month-inline-select"
            aria-label="Filter summary by month"
          >
            <option value="all">Summary: All Time</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                Summary: {getShortMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="summary-cards-grid">
        {/* Card 1: Net Balance */}
        <div className={`summary-card card-balance ${netBalance >= 0 ? 'is-positive' : 'is-negative'}`}>
          <div className="summary-card-top">
            <span className="card-label">Net Balance</span>
            <div className="card-icon-bubble bubble-balance">
              <IconWallet size={20} />
            </div>
          </div>
          <div className="card-value-box">
            <span className="card-main-value">{formatCurrency(netBalance)}</span>
            <span className="card-sub-pill">
              {netBalance >= 0 ? 'Surplus / In Profit' : 'Deficit / Over Budget'}
            </span>
          </div>
        </div>

        {/* Card 2: Total Income */}
        <div className="summary-card card-income">
          <div className="summary-card-top">
            <span className="card-label">Total Income</span>
            <div className="card-icon-bubble bubble-income">
              <IconArrowUpRight size={20} />
            </div>
          </div>
          <div className="card-value-box">
            <span className="card-main-value text-green">{formatCurrency(totalIncome)}</span>
            <span className="card-sub-detail">{incomeCount} recorded credits</span>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="summary-card card-expense">
          <div className="summary-card-top">
            <span className="card-label">Total Expenses</span>
            <div className="card-icon-bubble bubble-expense">
              <IconArrowDownLeft size={20} />
            </div>
          </div>
          <div className="card-value-box">
            <span className="card-main-value text-red">{formatCurrency(totalExpenses)}</span>
            <span className="card-sub-detail">{expenseCount} recorded debits</span>
          </div>
        </div>

        {/* Card 4: Savings Rate */}
        <div className="summary-card card-savings">
          <div className="summary-card-top">
            <span className="card-label">Net Savings Rate</span>
            <div className="card-icon-bubble bubble-savings">
              %
            </div>
          </div>
          <div className="card-value-box">
            <span className="card-main-value">{savingsRate}%</span>
            <span className="card-sub-detail">
              {totalIncome > 0 ? 'Of total earnings saved' : 'No income registered'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

