import React, { useEffect } from 'react';
import { IconTrash, IconX } from '../Icons';
import { formatCurrency } from '../../utils/formatters';

export default function DeleteConfirmModal({ transaction, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  if (!transaction) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-container modal-delete-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-delete-icon-box">
          <IconTrash size={28} />
        </div>

        <h3 className="modal-confirm-title">Delete Transaction?</h3>
        <p className="modal-confirm-desc">
          Are you sure you want to permanently delete this record? This action cannot be undone.
        </p>

        <div className="delete-target-preview">
          <span className="target-title">{transaction.title}</span>
          <span className="target-amount">{formatCurrency(transaction.amount)}</span>
        </div>

        <div className="modal-actions-row">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(transaction.id)}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

