import React from 'react';
import { getCategoryMeta } from '../data/categories';
import { formatCurrency, formatDate } from '../utils/formatters';
import { IconTrash, IconEdit, IconEye, IconCalendar, IconTag } from './Icons';

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  onViewImage
}) {
  const isIncome = transaction.type === 'income';
  const catMeta = getCategoryMeta(null, transaction.category);

  return (
    <div className={`transaction-row-card item-${transaction.type}`}>
      {/* Product Picture Thumbnail or Fallback Category Icon */}
      <div className="item-visual-col">
        {transaction.image ? (
          <div
            className="item-product-thumb-wrap"
            onClick={() => onViewImage(transaction)}
            title="Click to view full product / receipt picture"
          >
            <img
              src={transaction.image}
              alt={transaction.title}
              className="item-product-thumb"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="thumb-hover-overlay">
              <IconEye size={14} />
            </div>
          </div>
        ) : (
          <div
            className="item-category-avatar"
            style={{
              backgroundColor: `${catMeta.color}18`,
              borderColor: `${catMeta.color}35`,
              color: catMeta.color
            }}
          >
            <span>{catMeta.icon}</span>
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="item-info-col">
        <div className="item-title-row">
          <h4 className="item-title">{transaction.title}</h4>
          {transaction.image && (
            <button
              type="button"
              className="btn-view-picture-tag"
              onClick={() => onViewImage(transaction)}
              title="View attached picture"
            >
              📷 Picture Attached
            </button>
          )}
        </div>

        <div className="item-meta-row">
          <span
            className="item-cat-badge"
            style={{
              backgroundColor: `${catMeta.color}15`,
              color: catMeta.color,
              borderColor: `${catMeta.color}30`
            }}
          >
            {catMeta.icon} {catMeta.name}
          </span>

          <span className="meta-text">
            <IconCalendar size={13} /> {formatDate(transaction.date)}
          </span>

          {transaction.paymentMethod && (
            <span className="meta-text">
              <IconTag size={13} /> {transaction.paymentMethod}
            </span>
          )}
        </div>

        {transaction.notes && (
          <p className="item-notes-snippet">{transaction.notes}</p>
        )}
      </div>

      {/* Amount & Actions */}
      <div className="item-amount-actions-col">
        <div className={`item-amount-tag ${isIncome ? 'amt-income' : 'amt-expense'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </div>

        <div className="item-action-btns">
          {transaction.image && (
            <button
              type="button"
              className="action-btn-mini btn-view"
              onClick={() => onViewImage(transaction)}
              title="Inspect attached picture"
            >
              <IconEye size={15} />
            </button>
          )}

          <button
            type="button"
            className="action-btn-mini btn-edit"
            onClick={() => onEdit(transaction)}
            title="Edit transaction"
          >
            <IconEdit size={15} />
          </button>

          <button
            type="button"
            className="action-btn-mini btn-delete"
            onClick={() => onDelete(transaction)}
            title="Delete transaction"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

