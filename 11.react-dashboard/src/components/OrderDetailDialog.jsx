import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StatusChip from './StatusChip';
import { ORDER_STATUSES, STATUS_COLORS } from '../data/mockOrders';
import { formatCurrency } from '../utils/analyticsHelpers';

export function OrderDetailDialog({ order, open, onClose, onStatusUpdate }) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Order {order.id}
          </Typography>
          <StatusChip status={order.status} />
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        {/* Product showcase */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            mb: 2.5
          }}
        >
          <Avatar
            src={order.productImage}
            alt={order.productName}
            variant="rounded"
            sx={{
              width: 72,
              height: 72,
              backgroundColor: '#e2e8f0',
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            {order.productName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {order.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Category: <strong>{order.category}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.quantity} &times; {formatCurrency(order.unitPrice)} ={' '}
              <strong style={{ color: '#0f172a' }}>{formatCurrency(order.amount)}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Order & Customer Details Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              CUSTOMER
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
              {order.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {order.customerEmail}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              SHIPPING CITY
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
              {order.customerCity}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              ORDER DATE
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
              {order.date}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              PAYMENT METHOD
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
              {order.paymentMethod}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Interactive Status Update */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#0f172a' }}>
              Update Order Status
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Changing status updates dashboard charts &amp; revenue immediately
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 165 }}>
            <Select
              value={order.status}
              onChange={(e) => onStatusUpdate(order.id, e.target.value)}
            >
              {ORDER_STATUSES.map((st) => (
                <MenuItem key={st} value={st}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: STATUS_COLORS[st].chartColor
                      }}
                    />
                    <span>{st}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f8fafc' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDetailDialog;
