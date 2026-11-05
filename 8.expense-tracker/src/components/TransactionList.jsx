import React from 'react';
import TransactionItem from './TransactionItem';
import { IconFilter, IconPlus } from './Icons';

export default function TransactionList({
  transactions = [],
  totalCount = 0,
  onEdit,
  onDelete,
  onViewImage,
  onOpenAddModal
}) {
  if (transactions.length === 0) {
    return (
      <div className="transaction-empty-card">
        <div className="empty-icon-circle">
          <IconFilter size={32} />
        </div>
        <h4 className="empty-title">No Transactions Found</h4>
        <p className="empty-desc">
          {totalCount === 0
            ? "You haven't recorded any income or expenses yet. Start by adding your first transaction!"
            : 'No records match your active search and filter criteria. Try clearing or relaxing filters.'}
        </p>
        {totalCount === 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <IconPlus size={16} /> Add First Transaction
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <div className="transactions-stack">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewImage={onViewImage}
          />
        ))}
      </div>
    </div>
  );
}

