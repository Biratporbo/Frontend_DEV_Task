import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StatusChip from './StatusChip';
import { formatCurrency } from '../utils/analyticsHelpers';

export function RecentOrdersTable({ orders, onSelectOrder }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [orderBy, setOrderBy] = useState('date');
  const [orderDirection, setOrderDirection] = useState('desc');

  // Reset pagination when filtered orders list changes size significantly
  useEffect(() => {
    setPage(0);
  }, [orders.length]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      let comparison = 0;
      if (orderBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (orderBy === 'quantity') {
        comparison = a.quantity - b.quantity;
      } else if (orderBy === 'date') {
        comparison = a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
      } else {
        comparison = String(a[orderBy] || '').localeCompare(String(b[orderBy] || ''));
      }
      return orderDirection === 'asc' ? comparison : -comparison;
    });
  }, [orders, orderBy, orderDirection]);

  const paginatedOrders = sortedOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2.5,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.05rem', color: '#0f172a' }}>
              Recent Orders
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click any order row to inspect full product &amp; customer details
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Total: <strong>{orders.length}</strong> orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ py: 6, px: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            No matching orders found
          </Typography>
          <Typography variant="body2">
            Try adjusting your Date Range, Category, or Order Status filter criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 820 }} size="medium" aria-label="recent orders table">
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? orderDirection : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      Order ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                    <TableSortLabel
                      active={orderBy === 'customerName'}
                      direction={orderBy === 'customerName' ? orderDirection : 'asc'}
                      onClick={() => handleSort('customerName')}
                    >
                      Customer
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                    <TableSortLabel
                      active={orderBy === 'category'}
                      direction={orderBy === 'category' ? orderDirection : 'asc'}
                      onClick={() => handleSort('category')}
                    >
                      Category
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                    <TableSortLabel
                      active={orderBy === 'date'}
                      direction={orderBy === 'date' ? orderDirection : 'asc'}
                      onClick={() => handleSort('date')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>
                    <TableSortLabel
                      active={orderBy === 'quantity'}
                      direction={orderBy === 'quantity' ? orderDirection : 'asc'}
                      onClick={() => handleSort('quantity')}
                    >
                      Qty
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>
                    <TableSortLabel
                      active={orderBy === 'amount'}
                      direction={orderBy === 'amount' ? orderDirection : 'asc'}
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? orderDirection : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => onSelectOrder(order)}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#2563eb', whiteSpace: 'nowrap' }}>
                      {order.id}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={order.productImage}
                          alt={order.productName}
                          variant="rounded"
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#e2e8f0',
                            color: '#334155',
                            fontSize: '0.875rem',
                            fontWeight: 700
                          }}
                        >
                          {order.productName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                          {order.productName}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#dbeafe',
                            color: '#1d4ed8'
                          }}
                        >
                          {order.customerName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customerCity}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {order.category}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap', color: '#475569' }}>
                      <Typography variant="body2">{order.date}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.quantity}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {formatCurrency(order.amount)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusChip status={order.status} />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Inspect Order Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(order);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 8, 15, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
}

export default RecentOrdersTable;
