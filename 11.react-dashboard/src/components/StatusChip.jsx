import React from 'react';
import { Chip, Box } from '@mui/material';
import { STATUS_COLORS } from '../data/mockOrders';

/**
 * Colored status indicator badge for Completed, Processing, Pending, and Cancelled states
 */
export function StatusChip({ status, size = 'small' }) {
  const meta = STATUS_COLORS[status] || {
    color: '#475569',
    bg: '#f1f5f9',
    chartColor: '#64748b'
  };

  return (
    <Chip
      size={size}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: meta.chartColor,
              display: 'inline-block',
              flexShrink: 0
            }}
          />
          <span>{status}</span>
        </Box>
      }
      sx={{
        backgroundColor: meta.bg,
        color: meta.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: size === 'small' ? 26 : 30,
        border: `1px solid ${meta.chartColor}30`
      }}
    />
  );
}

export default StatusChip;
