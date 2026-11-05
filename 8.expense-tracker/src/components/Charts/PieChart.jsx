import React, { useState } from 'react';
import { EXPENSE_CATEGORIES, getCategoryMeta } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';

export default function PieChart({ transactions = [] }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Filter only expenses
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  // Aggregate by category
  const categoryTotals = {};
  let grandTotal = 0;

  expenseTransactions.forEach((t) => {
    const cat = t.category || 'Other Expense';
    const amt = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount || 0);
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    grandTotal += amt;
  });

  const categoriesData = Object.entries(categoryTotals)
    .map(([name, total]) => {
      const meta = getCategoryMeta(null, name);
      const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
      return {
        name,
        total,
        percentage,
        color: meta.color || '#64748b',
        icon: meta.icon || '🏷️'
      };
    })
    .sort((a, b) => b.total - a.total);

  if (categoriesData.length === 0 || grandTotal === 0) {
    return (
      <div className="chart-empty-state">
        <div className="chart-empty-icon">📊</div>
        <h4>No Expense Data Available</h4>
        <p>Add some expenses or adjust filters to view category distribution.</p>
      </div>
    );
  }

  // Calculate SVG circle segments
  // Circumference for r=70 is 2 * pi * 70 = ~439.82
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-title">Expenses by Category</h3>
          <p className="chart-subtitle">Distribution breakdown of your total spending</p>
        </div>
        <span className="chart-badge">
          Total: <strong>{formatCurrency(grandTotal)}</strong>
        </span>
      </div>

      <div className="pie-chart-container">
        {/* SVG Donut / Pie */}
        <div className="pie-svg-wrapper">
          <svg viewBox="0 0 200 200" className="pie-svg">
            {categoriesData.map((cat, idx) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += cat.percentage;

              const isHovered = hoveredCategory === cat.name;

              return (
                <circle
                  key={cat.name}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? '28' : '22'}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="pie-segment"
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '100px 100px'
                  }}
                />
              );
            })}
          </svg>

          {/* Donut Center Display */}
          <div className="pie-center-text">
            {hoveredCategory ? (
              (() => {
                const item = categoriesData.find((c) => c.name === hoveredCategory);
                if (!item) return null;
                return (
                  <>
                    <span className="pie-center-icon">{item.icon}</span>
                    <span className="pie-center-label">{item.name}</span>
                    <span className="pie-center-amount">{formatCurrency(item.total)}</span>
                    <span className="pie-center-pct">{item.percentage.toFixed(1)}%</span>
                  </>
                );
              })()
            ) : (
              <>
                <span className="pie-center-count">{categoriesData.length}</span>
                <span className="pie-center-label">Categories</span>
                <span className="pie-center-hint">Hover for details</span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="pie-legend-list">
          {categoriesData.map((cat) => {
            const isHovered = hoveredCategory === cat.name;
            return (
              <div
                key={cat.name}
                className={`pie-legend-item ${isHovered ? 'is-active' : ''}`}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="pie-legend-left">
                  <span
                    className="pie-legend-color"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="pie-legend-icon">{cat.icon}</span>
                  <span className="pie-legend-name">{cat.name}</span>
                </div>
                <div className="pie-legend-right">
                  <span className="pie-legend-amt">{formatCurrency(cat.total)}</span>
                  <span className="pie-legend-pct">({cat.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

