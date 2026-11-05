import React, { useEffect } from 'react';
import { IconX, IconCalendar, IconTag } from '../Icons';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryMeta } from '../../data/categories';

export default function ImagePreviewModal({ transaction, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!transaction || !transaction.image) return null;

  const catMeta = getCategoryMeta(null, transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-image-preview" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-subtitle">Attached Receipt / Product Picture</span>
            <h3 className="modal-title">{transaction.title}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <IconX size={20} />
          </button>
        </div>

        <div className="modal-image-body">
          <div className="modal-image-frame">
            <img
              src={transaction.image}
              alt={transaction.title}
              className="modal-full-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="modal-image-details">
            <div className="modal-info-pill-row">
              <span
                className="category-badge"
                style={{
                  backgroundColor: `${catMeta.color}15`,
                  color: catMeta.color,
                  borderColor: `${catMeta.color}35`
                }}
              >
                <span>{catMeta.icon}</span> {catMeta.name}
              </span>

              <span className={`type-badge badge-${transaction.type}`}>
                {isIncome ? '+ Income' : '- Expense'}
              </span>

              <span className="amount-display-pill">
                Amount: <strong className={isIncome ? 'text-green' : 'text-red'}>
                  {formatCurrency(transaction.amount)}
                </strong>
              </span>
            </div>

            <div className="modal-meta-grid">
              <div className="meta-item">
                <IconCalendar size={15} />
                <span>Date: <strong>{formatDate(transaction.date)}</strong></span>
              </div>
              <div className="meta-item">
                <IconTag size={15} />
                <span>Payment: <strong>{transaction.paymentMethod || 'N/A'}</strong></span>
              </div>
            </div>

            {transaction.notes && (
              <div className="modal-notes-box">
                <span className="notes-label">Notes & Remarks:</span>
                <p className="notes-content">{transaction.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

