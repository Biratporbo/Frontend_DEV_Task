import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/analyticsHelpers';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <Paper sx={{ p: 1.5, border: '1px solid #cbd5e1', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#0f172a' }}>
        {label}
      </Typography>
      {payload.map((entry) => (
        <Typography
          key={entry.dataKey}
          variant="body2"
          sx={{ color: entry.color, fontWeight: 600 }}
        >
          {entry.name}:{' '}
          {entry.dataKey === 'revenue'
            ? formatCurrency(entry.value)
            : `${entry.value} units`}
        </Typography>
      ))}
    </Paper>
  );
}

export function RevenueSalesChart({ data }) {
  return (
    <Paper sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShowChartIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.05rem', color: '#0f172a' }}>
              Revenue &amp; Sales Trend
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Daily revenue ($) vs. units sold across filtered orders
            </Typography>
          </Box>
        </Box>
      </Box>

      {data.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2">
            No trend data available for the selected filters.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 310 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue ($)"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#2563eb' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sales"
                name="Sales (Units)"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#16a34a' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

export default RevenueSalesChart;
