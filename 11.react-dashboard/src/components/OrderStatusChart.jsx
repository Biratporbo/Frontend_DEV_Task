import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { formatCurrency } from '../utils/analyticsHelpers';

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <Paper sx={{ p: 1.5, border: '1px solid #cbd5e1', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: item.color
          }}
        />
        <Typography variant="subtitle2" sx={{ color: '#0f172a' }}>
          {item.name}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Orders: <strong>{item.count}</strong> ({item.percentage}%)
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Value: <strong>{formatCurrency(item.amount)}</strong>
      </Typography>
    </Paper>
  );
}

export function OrderStatusChart({ data, activeStatusFilter, onStatusClick }) {
  const activeSlices = data.filter((item) => item.count > 0);
  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Paper sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <PieChartIcon color="primary" />
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1.05rem', color: '#0f172a' }}>
            Order Status Distribution
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Click any status below to filter
          </Typography>
        </Box>
      </Box>

      {totalOrders === 0 ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2">
            No orders match the current filter.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ width: '100%', height: 215 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeSlices}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={84}
                  paddingAngle={3}
                  onClick={(entry) => onStatusClick && onStatusClick(entry.name)}
                  style={{ cursor: onStatusClick ? 'pointer' : 'default' }}
                >
                  {activeSlices.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Colored Status Indicators Summary */}
          <Stack spacing={1} sx={{ mt: 1 }}>
            {data.map((item) => {
              const isSelected = activeStatusFilter === item.name;
              return (
                <Box
                  key={item.name}
                  onClick={() => onStatusClick && onStatusClick(item.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onStatusClick && onStatusClick(item.name);
                    }
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 1.5,
                    cursor: onStatusClick ? 'pointer' : 'default',
                    backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                    border: isSelected ? `1px solid ${item.color}` : '1px solid #e2e8f0',
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                      backgroundColor: '#f1f5f9'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        display: 'inline-block'
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {item.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {item.count}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: 36,
                        textAlign: 'right',
                        color: 'text.secondary',
                        fontWeight: 600
                      }}
                    >
                      {item.percentage}%
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </>
      )}
    </Paper>
  );
}

export default OrderStatusChart;
