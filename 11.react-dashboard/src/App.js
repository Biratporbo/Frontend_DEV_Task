import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Container, Grid, Box, Typography } from '@mui/material';
import theme from './theme';
import { INITIAL_ORDERS } from './data/mockOrders';
import {
  filterOrders,
  computeKpiMetrics,
  buildRevenueSalesTrend,
  buildOrderStatusBreakdown,
  exportOrdersToCsv
} from './utils/analyticsHelpers';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KpiWidgets from './components/KpiWidgets';
import RevenueSalesChart from './components/RevenueSalesChart';
import OrderStatusChart from './components/OrderStatusChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import OrderDetailDialog from './components/OrderDetailDialog';
import './App.css';

const DEFAULT_FILTERS = {
  dateRange: 'all',
  startDate: '',
  endDate: '',
  category: 'all',
  status: 'all',
  search: ''
};

export function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleStatusPieClick = (statusName) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === statusName ? 'all' : statusName
    }));
  };

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Filtered dataset & analytics computations
  const filteredOrders = useMemo(
    () => filterOrders(orders, filters),
    [orders, filters]
  );

  const kpiMetrics = useMemo(
    () => computeKpiMetrics(filteredOrders, filters.status),
    [filteredOrders, filters.status]
  );

  const trendData = useMemo(
    () => buildRevenueSalesTrend(filteredOrders),
    [filteredOrders]
  );

  const statusBreakdown = useMemo(
    () => buildOrderStatusBreakdown(filteredOrders),
    [filteredOrders]
  );

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header
          totalFilteredCount={filteredOrders.length}
          onExportCsv={() => exportOrdersToCsv(filteredOrders)}
        />

        <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
          {/* Filters Toolbar (Date Range / Category / Status) */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* KPI Widgets: Revenue, Sales, Orders, Customers */}
          <KpiWidgets metrics={kpiMetrics} />

          {/* Charts Section: Line Chart (Revenue/Sales Trend) & Pie Chart (Order Status) */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={8}>
              <RevenueSalesChart data={trendData} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <OrderStatusChart
                data={statusBreakdown}
                activeStatusFilter={filters.status}
                onStatusClick={handleStatusPieClick}
              />
            </Grid>
          </Grid>

          {/* Recent Orders Data Table */}
          <RecentOrdersTable
            orders={filteredOrders}
            onSelectOrder={(order) => setSelectedOrderId(order.id)}
          />
        </Container>

        {/* Order Details & Status Update Dialog */}
        <OrderDetailDialog
          order={selectedOrder}
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrderId(null)}
          onStatusUpdate={handleOrderStatusUpdate}
        />

        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            textAlign: 'center',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            OrderPulse &mdash; Order Management Analytics Dashboard built with React, Material UI &amp; Recharts.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
