import React from 'react';
import { IconWallet, IconPlus, IconDownload, IconRefresh } from './Icons';

export default function Header({
  onOpenAddModal,
  onExportCSV,
  onResetDemoData,
  totalTransactions
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand-wrap">
          <div className="brand-logo-icon">
            <IconWallet size={24} />
          </div>
          <div className="brand-titles">
            <h1 className="brand-name">SpendWise</h1>
            <span className="brand-badge">Expense & Finance Tracker</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-header-action"
            onClick={onResetDemoData}
            title="Restore default sample transactions"
          >
            <IconRefresh size={15} />
            <span className="btn-label-desktop">Sample Data</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-header-action"
            onClick={onExportCSV}
            title="Export filtered records as CSV file"
          >
            <IconDownload size={15} />
            <span className="btn-label-desktop">Export CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-add-main"
            onClick={onOpenAddModal}
          >
            <IconPlus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
}

