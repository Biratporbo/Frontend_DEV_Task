import { ORDER_STATUSES, STATUS_COLORS } from '../data/mockOrders';

/**
 * Format numeric amount to standard USD currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
}

/**
 * Format YYYY-MM-DD into a short readable label e.g. "Nov 12"
 */
export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Filter orders based on Date Range, Category, Status, and Search Keyword
 */
export function filterOrders(orders, filters) {
  const { dateRange, startDate, endDate, category, status, search } = filters;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  let cutoffDate = null;
  if (dateRange === '7d') {
    cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    cutoffDate.setHours(0, 0, 0, 0);
  } else if (dateRange === '30d') {
    cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    cutoffDate.setHours(0, 0, 0, 0);
  } else if (dateRange === '90d') {
    cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    cutoffDate.setHours(0, 0, 0, 0);
  }

  const trimmedQuery = (search || '').trim().toLowerCase();

  return orders.filter((order) => {
    // 1. Category filter
    if (category && category !== 'all' && order.category !== category) {
      return false;
    }

    // 2. Status filter
    if (status && status !== 'all' && order.status !== status) {
      return false;
    }

    // 3. Date range filter
    const orderDate = new Date(`${order.date}T12:00:00`);
    if (dateRange === 'custom') {
      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);
        if (orderDate < start) return false;
      }
      if (endDate) {
        const end = new Date(`${endDate}T23:59:59`);
        if (orderDate > end) return false;
      }
    } else if (cutoffDate) {
      if (orderDate < cutoffDate || orderDate > today) {
        return false;
      }
    }

    // 4. Search keyword filter
    if (trimmedQuery) {
      const hay = `${order.id} ${order.customerName} ${order.productName} ${order.category}`.toLowerCase();
      if (!hay.includes(trimmedQuery)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Compute summary metrics for Revenue, Sales, Orders, and Customers KPI widgets
 */
export function computeKpiMetrics(filteredOrders, activeStatusFilter) {
  const effectiveOrders =
    activeStatusFilter === 'Cancelled'
      ? filteredOrders
      : filteredOrders.filter((o) => o.status !== 'Cancelled');

  const revenue = effectiveOrders.reduce((sum, item) => sum + item.amount, 0);
  const sales = effectiveOrders.reduce((sum, item) => sum + item.quantity, 0);
  const ordersCount = filteredOrders.length;
  const customersCount = new Set(filteredOrders.map((o) => o.customerId)).size;

  const avgOrderValue = effectiveOrders.length > 0 ? revenue / effectiveOrders.length : 0;

  return {
    revenue,
    sales,
    ordersCount,
    customersCount,
    avgOrderValue
  };
}

/**
 * Group orders chronologically by date to build Recharts LineChart series
 * Tracks both Revenue ($) and Sales (Units Sold) over time
 */
export function buildRevenueSalesTrend(filteredOrders) {
  const grouped = {};

  filteredOrders.forEach((order) => {
    if (!grouped[order.date]) {
      grouped[order.date] = {
        rawDate: order.date,
        dateLabel: formatShortDate(order.date),
        revenue: 0,
        sales: 0,
        orders: 0
      };
    }

    // Include value for revenue/sales unless order is cancelled
    if (order.status !== 'Cancelled') {
      grouped[order.date].revenue += order.amount;
      grouped[order.date].sales += order.quantity;
    }
    grouped[order.date].orders += 1;
  });

  // Sort chronologically ascending
  return Object.values(grouped)
    .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
    .map((entry) => ({
      ...entry,
      revenue: Math.round(entry.revenue * 100) / 100
    }));
}

/**
 * Aggregate order counts and values per status for Recharts PieChart
 */
export function buildOrderStatusBreakdown(filteredOrders) {
  const counts = {};
  ORDER_STATUSES.forEach((status) => {
    counts[status] = { count: 0, value: 0 };
  });

  filteredOrders.forEach((order) => {
    if (counts[order.status]) {
      counts[order.status].count += 1;
      counts[order.status].value += order.amount;
    }
  });

  const total = filteredOrders.length;

  return ORDER_STATUSES.map((status) => ({
    name: status,
    count: counts[status].count,
    amount: Math.round(counts[status].value * 100) / 100,
    percentage: total > 0 ? Math.round((counts[status].count / total) * 100) : 0,
    color: STATUS_COLORS[status].chartColor
  }));
}

/**
 * Trigger CSV file download of currently filtered orders
 */
export function exportOrdersToCsv(orders) {
  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'City',
    'Product',
    'Category',
    'Quantity',
    'Amount (USD)',
    'Status',
    'Payment Method'
  ];

  const escapeCsv = (val) => `"${String(val).replace(/"/g, '""')}"`;

  const rows = orders.map((o) =>
    [
      o.id,
      o.date,
      o.customerName,
      o.customerCity,
      o.productName,
      o.category,
      o.quantity,
      o.amount.toFixed(2),
      o.status,
      o.paymentMethod
    ]
      .map(escapeCsv)
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `order-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
