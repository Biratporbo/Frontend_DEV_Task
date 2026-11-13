import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectLatestOrder,
  clearLatestOrder,
  setHistoryOpen
} from '../../features/orders/ordersSlice';
import { IconCheck, IconPackage, IconClose } from '../common/Icons';

export function OrderConfirmation() {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectLatestOrder);

  if (!order) return null;

  const handleClose = () => {
    dispatch(clearLatestOrder());
  };

  const handleViewHistory = () => {
    dispatch(clearLatestOrder());
    dispatch(setHistoryOpen(true));
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="confirmation-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-icon-btn"
          onClick={handleClose}
          aria-label="Close confirmation"
        >
          <IconClose size={20} />
        </button>

        <div className="confirmation-icon-badge">
          <IconCheck size={36} />
        </div>

        <h3 className="confirmation-title">Order Confirmed!</h3>
        <p className="confirmation-subtitle">
          Thank you for your purchase. We have received your order and are preparing it for shipment.
        </p>

        <div className="confirmation-meta-card">
          <div className="meta-pair">
            <span className="pair-label">Order Number:</span>
            <strong className="pair-value highlight">{order.id}</strong>
          </div>
          <div className="meta-pair">
            <span className="pair-label">Tracking ID:</span>
            <span className="pair-value">{order.trackingId}</span>
          </div>
          <div className="meta-pair">
            <span className="pair-label">Estimated Delivery:</span>
            <span className="pair-value">3 - 5 Business Days</span>
          </div>
          <div className="meta-pair">
            <span className="pair-label">Total Amount Paid:</span>
            <strong className="pair-value">${order.financials?.finalPrice?.toFixed(2)}</strong>
          </div>
        </div>

        <div className="confirmation-items-summary">
          <h4 className="summary-items-title">Purchased Items ({order.items?.length})</h4>
          <div className="summary-items-scroll">
            {order.items?.map((item) => (
              <div key={item.id} className="confirm-item-row">
                <img src={item.image} alt={item.title} className="confirm-thumb" />
                <div className="confirm-item-details">
                  <span className="confirm-item-name">{item.title}</span>
                  <span className="confirm-item-meta">
                    {item.quantity} &times; ${item.price?.toFixed(2)}
                  </span>
                </div>
                <span className="confirm-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            type="button"
            className="view-orders-btn"
            onClick={handleViewHistory}
          >
            <IconPackage size={16} />
            <span>View All Orders</span>
          </button>

          <button
            type="button"
            className="continue-shopping-btn"
            onClick={handleClose}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
