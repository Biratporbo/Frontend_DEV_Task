import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function LineChart({ transactions = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Filter only expenses with valid dates
  const expenses = transactions.filter((t) => t.type === 'expense' && t.date);

  // Group expenses by date
  const dailyMap = {};
  expenses.forEach((t) => {
    const d = t.date;
    const amt = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount || 0);
    if (!dailyMap[d]) {
      dailyMap[d] = { date: d, amount: 0, count: 0 };
    }
    dailyMap[d].amount += amt;
    dailyMap[d].count += 1;
  });

  const sortedDates = Object.keys(dailyMap).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="chart-empty-state">
        <div className="chart-empty-icon">📈</div>
        <h4>No Daily Expense Data</h4>
        <p>Add daily expenses to see your spending curve over time.</p>
      </div>
    );
  }

  // Find max daily expense for Y-axis
  let maxDaily = Math.max(...sortedDates.map((d) => dailyMap[d].amount), 10);
  const yCeiling = Math.ceil(maxDaily * 1.2 / 50) * 50;

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 260;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate points
  const points = sortedDates.map((d, index) => {
    const x =
      sortedDates.length === 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft + (index / (sortedDates.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (dailyMap[d].amount / yCeiling) * chartHeight;
    return {
      x,
      y,
      date: d,
      amount: dailyMap[d].amount,
      count: dailyMap[d].count
    };
  });

  // SVG path for line
  const linePathD = points.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  // SVG path for gradient area under line
  const areaPathD =
    points.length > 1
      ? `${linePathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : '';

  // Generate 4 Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    value: Math.round(yCeiling * pct),
    y: paddingTop + chartHeight * (1 - pct)
  }));

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-title">Daily Expense Trend</h3>
          <p className="chart-subtitle">Day-by-day spending curve and fluctuations</p>
        </div>
        <span className="chart-badge">
          Active Days: <strong>{sortedDates.length}</strong>
        </span>
      </div>

      <div className="line-chart-container">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="line-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
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
                ${tick.value}
              </text>
            </g>
          ))}

          {/* Shaded Area */}
          {areaPathD && <path d={areaPathD} fill="url(#areaGradient)" />}

          {/* Connected Polyline */}
          <path
            d={linePathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredPoint && hoveredPoint.date === pt.date;
            return (
              <g key={pt.date}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#4338ca' : '#ffffff'}
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  className="line-point"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Date labels on X-axis (display first, last, and every few) */}
                {(sortedDates.length <= 7 ||
                  idx === 0 ||
                  idx === sortedDates.length - 1 ||
                  idx % Math.ceil(sortedDates.length / 5) === 0) && (
                  <text
                    x={pt.x}
                    y={svgHeight - 16}
                    textAnchor="middle"
                    className="axis-label-date"
                  >
                    {pt.date.slice(5)} {/* MM-DD */}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover details badge */}
        {hoveredPoint && (
          <div className="chart-tooltip-panel">
            <span className="tooltip-title">{formatDate(hoveredPoint.date)}</span>
            <div className="tooltip-row">
              Spent: <strong className="text-red">{formatCurrency(hoveredPoint.amount)}</strong>
            </div>
            <div className="tooltip-row">
              Transactions: <strong>{hoveredPoint.count} items</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

