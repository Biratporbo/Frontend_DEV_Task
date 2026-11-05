import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import ChartsSection from './components/Charts/ChartsSection';
import FilterToolbar from './components/FilterToolbar';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import ImagePreviewModal from './components/Modals/ImagePreviewModal';
import DeleteConfirmModal from './components/Modals/DeleteConfirmModal';
import {
  loadTransactionsFromStorage,
  saveTransactionsToStorage,
  resetTransactionsToDefault
} from './utils/storage';
import { exportToCSV } from './utils/csvExport';
import './App.css';

function App() {
  // Main transactions state persisted to localStorage
  const [transactions, setTransactions] = useState(() => loadTransactionsFromStorage());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'expense', 'income'
  const [monthFilter, setMonthFilter] = useState('all'); // 'all' or 'YYYY-MM'
  const [sortBy, setSortBy] = useState('date-desc');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [viewingImageTransaction, setViewingImageTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');

  // Persist to localStorage whenever transactions change
  useEffect(() => {
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  // Show transient toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  // Derive all unique months available in current transactions (e.g. ['2026-11', '2026-10'])
  const availableMonths = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.date && t.date.length >= 7) {
        set.add(t.date.substring(0, 7));
      }
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search query filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = t.title.toLowerCase().includes(q);
          const matchesCategory = t.category.toLowerCase().includes(q);
          const matchesPayment = (t.paymentMethod || '').toLowerCase().includes(q);
          const matchesNotes = (t.notes || '').toLowerCase().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesPayment && !matchesNotes) {
            return false;
          }
        }

        // Type filter
        if (typeFilter !== 'all' && t.type !== typeFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && t.category !== categoryFilter) {
          return false;
        }

        // Month filter
        if (monthFilter !== 'all' && (!t.date || !t.date.startsWith(monthFilter))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date) - new Date(a.date);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, monthFilter, sortBy]);

  // Transactions specifically used for Summary and Charts (scoped to monthFilter if set)
  const scopedTransactions = useMemo(() => {
    if (monthFilter === 'all') return transactions;
    return transactions.filter((t) => t.date && t.date.startsWith(monthFilter));
  }, [transactions, monthFilter]);

  // Handler: Add or Update Transaction
  const handleSaveTransaction = (transactionPayload) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionPayload.id ? transactionPayload : t))
      );
      showToast(`Updated "${transactionPayload.title}" successfully.`);
      setEditingTransaction(null);
    } else {
      setTransactions((prev) => [transactionPayload, ...prev]);
      showToast(`Added ${transactionPayload.type}: "${transactionPayload.title}"`);
    }
    setIsFormModalOpen(false);
  };

  // Handler: Open Add Modal
  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsFormModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleStartEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormModalOpen(true);
  };

  // Handler: Close Form Modal
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingTransaction(null);
  };

  // Handler: Open Delete Dialog
  const handleStartDelete = (tx) => {
    setDeletingTransaction(tx);
  };

  // Handler: Confirm Delete
  const handleConfirmDelete = (id) => {
    const itemToDelete = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDeletingTransaction(null);
    showToast(`Deleted "${itemToDelete ? itemToDelete.title : 'Transaction'}"`);
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    exportToCSV(filteredTransactions);
  };

  // Handler: Reset to initial sample data
  const handleResetDemoData = () => {
    if (window.confirm('Reset all transactions to the default sample dataset? Any unsaved changes will be replaced.')) {
      const defaultData = resetTransactionsToDefault();
      setTransactions([...defaultData]);
      setSearchQuery('');
      setCategoryFilter('all');
      setTypeFilter('all');
      setMonthFilter('all');
      showToast('Sample dataset restored successfully.');
    }
  };

  // Handler: Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setMonthFilter('all');
    setSortBy('date-desc');
  };

  return (
    <div className="app-layout">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification">
          <span className="toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenAddModal={handleOpenAdd}
        onExportCSV={handleExportCSV}
        onResetDemoData={handleResetDemoData}
        totalTransactions={transactions.length}
      />

      <main className="main-content">
        <div className="content-container">
          {/* Monthly Summary Cards */}
          <SummaryCards
            transactions={scopedTransactions}
            selectedMonth={monthFilter}
            onMonthChange={setMonthFilter}
            availableMonths={availableMonths}
          />

          {/* Interactive Charts (Pie, Bar, Line) */}
          <ChartsSection transactions={scopedTransactions} />

          {/* Transaction Management Section */}
          <section className="transactions-section">
            <div className="transactions-header-row">
              <div>
                <h2 className="section-title">Transaction Records & History</h2>
                <p className="section-subtitle">
                  Browse, search, inspect attached product pictures, and manage income & expenses
                </p>
              </div>

              <div className="section-top-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOpenAdd}
                >
                  + Add Expense / Income
                </button>
              </div>
            </div>

            {/* Filter, Search, and Sort Toolbar */}
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              monthFilter={monthFilter}
              onMonthFilterChange={setMonthFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              availableMonths={availableMonths}
              filteredCount={filteredTransactions.length}
              totalCount={transactions.length}
              onClearFilters={handleClearFilters}
            />

            {/* Transaction List */}
            <TransactionList
              transactions={filteredTransactions}
              totalCount={transactions.length}
              onEdit={handleStartEdit}
              onDelete={handleStartDelete}
              onViewImage={setViewingImageTransaction}
              onOpenAddModal={handleOpenAdd}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p className="footer-text">
            SpendWise &copy; {new Date().getFullYear()} &mdash; Responsive Single Page Expense & Income Tracker.
          </p>
          <div className="footer-features-pill">
            <span>• Forms & Controlled Components</span>
            <span>• LocalStorage Sync</span>
            <span>• CSV Data Export</span>
            <span>• Product Picture Attachments</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Transaction Modal */}
      {isFormModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseFormModal}>
          <div
            className="modal-container modal-form-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <TransactionForm
              onSaveTransaction={handleSaveTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCloseFormModal}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Product Picture Full Preview Modal */}
      {viewingImageTransaction && (
        <ImagePreviewModal
          transaction={viewingImageTransaction}
          onClose={() => setViewingImageTransaction(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <DeleteConfirmModal
          transaction={deletingTransaction}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingTransaction(null)}
        />
      )}
    </div>
  );
}

export default App;

