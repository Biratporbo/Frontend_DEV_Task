import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectOrdersList,
  selectIsHistoryOpen,
  setHistoryOpen
} from '../../features/orders/ordersSlice';
import { IconPackage, IconClose } from '../common/Icons';

export function OrderHistoryModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsHistoryOpen);
  const orders = useAppSelector(selectOrdersList);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setHistoryOpen(false));
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="orders-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="orders-modal-header">
          <div className="orders-title-wrap">
            <IconPackage size={22} />
            <h3 className="orders-modal-title">Your Order History</h3>
            <span className="orders-count-badge">{orders.length} orders</span>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={handleClose}
            aria-label="Close orders"
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="orders-modal-body">
          {orders.length === 0 ? (
            <div className="orders-empty-state">
              <IconPackage size={48} className="empty-package-icon" />
              <h4>No Orders Yet</h4>
              <p>When you place an order, it will appear here with full receipt details.</p>
            </div>
          ) : (
            <div className="orders-timeline">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card">
                  <div className="order-card-header">
                    <div className="order-header-left">
                      <span className="order-id-label">{order.id}</span>
                      <span className="order-date-text">Placed on {formatDate(order.date)}</span>
                    </div>

                    <div className="order-header-right">
                      <span className={`order-status-badge ${order.status?.toLowerCase()}`}>
                        {order.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>

                  <div className="order-card-items-list">
                    {order.items?.map((item) => (
                      <div key={item.id} className="history-item-row">
                        <img src={item.image} alt={item.title} className="history-item-img" />
                        <div className="history-item-info">
                          <span className="history-item-title">{item.title}</span>
                          <span className="history-item-qty">
                            Qty: {item.quantity} &times; ${item.price?.toFixed(2)}
                          </span>
                        </div>
                        <span className="history-item-line-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span className="order-tracking-text">
                      Tracking: <strong>{order.trackingId || 'TRK-US-PENDING'}</strong>
                    </span>
                    <span className="order-total-paid">
                      Total Paid: <strong>${order.financials?.finalPrice?.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryModal;
