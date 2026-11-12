import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';
import { formatCurrency } from '../utils/analyticsHelpers';

export function KpiWidgets({ metrics }) {
  const cards = [
    {
      title: 'Revenue',
      value: formatCurrency(metrics.revenue),
      subtitle: `Avg. order ${formatCurrency(metrics.avgOrderValue)}`,
      icon: <AttachMoneyIcon fontSize="medium" />,
      color: '#16a34a',
      bg: '#dcfce7'
    },
    {
      title: 'Sales',
      value: `${metrics.sales.toLocaleString()} Units`,
      subtitle: 'Total product items sold',
      icon: <ShoppingBagIcon fontSize="medium" />,
      color: '#2563eb',
      bg: '#dbeafe'
    },
    {
      title: 'Orders',
      value: metrics.ordersCount.toLocaleString(),
      subtitle: 'Filtered transactions count',
      icon: <ReceiptLongIcon fontSize="medium" />,
      color: '#d97706',
      bg: '#fef3c7'
    },
    {
      title: 'Customers',
      value: metrics.customersCount.toLocaleString(),
      subtitle: 'Active unique buyers',
      icon: <GroupIcon fontSize="medium" />,
      color: '#7c3aed',
      bg: '#ede9fe'
    }
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Paper
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
              }
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                {card.title}
              </Typography>
              <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 700, mb: 0.25 }}>
                {card.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {card.subtitle}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                backgroundColor: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {card.icon}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default KpiWidgets;
