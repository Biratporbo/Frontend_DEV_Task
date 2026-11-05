import React, { useState } from 'react';
import { formatCurrency, getShortMonthLabel } from '../../utils/formatters';

export default function BarChart({ transactions = [] }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Group by year-month (e.g., '2026-10', '2026-11')
  const monthlyDataMap = {};

  transactions.forEach((t) => {
    if (!t.date) return;
    const monthKey = t.date.substring(0, 7);
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = {
        monthKey,
        income: 0,
        expense: 0
      };
    }
    const amt = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount || 0);
    if (t.type === 'income') {
      monthlyDataMap[monthKey].income += amt;
    } else {
      monthlyDataMap[monthKey].expense += amt;
    }
  });

  // Sort chronologically
  const months = Object.keys(monthlyDataMap).sort();

  if (months.length === 0) {
    return (
      <div className="chart-empty-state">
        <div className="chart-empty-icon">📊</div>
        <h4>No Trend Data Available</h4>
        <p>Record both income and expenses to view the monthly trend comparison.</p>
      </div>
    );
  }

  // Calculate maximum value for Y-axis scaling
  let maxVal = 0;
  months.forEach((m) => {
    const d = monthlyDataMap[m];
    if (d.income > maxVal) maxVal = d.income;
    if (d.expense > maxVal) maxVal = d.expense;
  });
  if (maxVal === 0) maxVal = 1000;
  // Round up maxVal to a clean ceiling
  const yCeiling = Math.ceil(maxVal * 1.15 / 500) * 500;

  // Chart dimensions in SVG coordinates
  const svgWidth = 560;
  const svgHeight = 260;
  const paddingLeft = 65;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const groupWidth = chartWidth / months.length;
  const barWidth = Math.min(28, (groupWidth - 20) / 2);

  // Generate 4 horizontal grid ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    value: Math.round(yCeiling * pct),
    y: paddingTop + chartHeight * (1 - pct)
  }));

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-title">Income vs Expenses Trend</h3>
          <p className="chart-subtitle">Monthly financial cash-flow comparison</p>
        </div>
        <div className="chart-legend-inline">
          <span className="legend-indicator">
            <span className="legend-dot dot-income" /> Income
          </span>
          <span className="legend-indicator">
            <span className="legend-dot dot-expense" /> Expense
          </span>
        </div>
      </div>

      <div className="bar-chart-container">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="bar-svg" preserveAspectRatio="xMidYMid meet">
          {/* Background gridlines & Y labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={svgWidth - paddingRight}
                y2={tick.y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="axis-label"
              >
                ${tick.value >= 1000 ? `${(tick.value / 1000).toFixed(1)}k` : tick.value}
              </text>
            </g>
          ))}

          {/* Grouped Bars per Month */}
          {months.map((m, idx) => {
            const data = monthlyDataMap[m];
            const groupCenterX = paddingLeft + idx * groupWidth + groupWidth / 2;

            const incomeHeight = (data.income / yCeiling) * chartHeight;
            const expenseHeight = (data.expense / yCeiling) * chartHeight;

            const incomeX = groupCenterX - barWidth - 3;
            const incomeY = paddingTop + (chartHeight - incomeHeight);

            const expenseX = groupCenterX + 3;
            const expenseY = paddingTop + (chartHeight - expenseHeight);

            const isHovered = hoveredBar && hoveredBar.month === m;

            return (
              <g key={m} className="bar-group">
                {/* Background hover highlight */}
                <rect
                  x={paddingLeft + idx * groupWidth}
                  y={paddingTop}
                  width={groupWidth}
                  height={chartHeight}
                  fill={isHovered ? 'rgba(99, 102, 241, 0.05)' : 'transparent'}
                  rx="6"
                  onMouseEnter={() => setHoveredBar({ month: m, ...data })}
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Income Bar */}
                <rect
                  x={incomeX}
                  y={incomeY}
                  width={barWidth}
                  height={Math.max(2, incomeHeight)}
                  rx="4"
                  fill="#10b981"
                  className="bar-rect"
                  onMouseEnter={() => setHoveredBar({ month: m, ...data, target: 'income' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Expense Bar */}
                <rect
                  x={expenseX}
                  y={expenseY}
                  width={barWidth}
                  height={Math.max(2, expenseHeight)}
                  rx="4"
                  fill="#ef4444"
                  className="bar-rect"
                  onMouseEnter={() => setHoveredBar({ month: m, ...data, target: 'expense' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Month label on X-axis */}
                <text
                  x={groupCenterX}
                  y={svgHeight - 16}
                  textAnchor="middle"
                  className="axis-label-month"
                >
                  {getShortMonthLabel(m)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover details badge */}
        {hoveredBar && (
          <div className="chart-tooltip-panel">
            <span className="tooltip-title">{getShortMonthLabel(hoveredBar.month)}</span>
            <div className="tooltip-row">
              <span className="dot-income" /> Income: <strong>{formatCurrency(hoveredBar.income)}</strong>
            </div>
            <div className="tooltip-row">
              <span className="dot-expense" /> Expense: <strong>{formatCurrency(hoveredBar.expense)}</strong>
            </div>
            <div className="tooltip-row tooltip-net">
              Net Savings: <strong className={hoveredBar.income >= hoveredBar.expense ? 'text-green' : 'text-red'}>
                {formatCurrency(hoveredBar.income - hoveredBar.expense)}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

