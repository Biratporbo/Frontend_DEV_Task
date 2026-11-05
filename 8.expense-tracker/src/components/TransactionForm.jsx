import React, { useState, useEffect } from 'react';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS
} from '../data/categories';
import { PRESET_PRODUCT_IMAGES } from '../data/presetImages';
import {
  IconPlus,
  IconEdit,
  IconX,
  IconImage,
  IconCheck,
  IconRefresh
} from './Icons';

export default function TransactionForm({
  onSaveTransaction,
  editingTransaction = null,
  onCancelEdit = null,
  isModal = false
}) {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Controlled form state
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: EXPENSE_CATEGORIES[0].name,
    date: getTodayString(),
    paymentMethod: 'Credit Card',
    image: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageMode, setImageMode] = useState('preset'); // 'preset', 'upload', 'url'
  const [urlInput, setUrlInput] = useState('');

  // Sync state when entering or exiting edit mode
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title || '',
        amount: editingTransaction.amount ? String(editingTransaction.amount) : '',
        type: editingTransaction.type || 'expense',
        category: editingTransaction.category || (editingTransaction.type === 'income' ? INCOME_CATEGORIES[0].name : EXPENSE_CATEGORIES[0].name),
        date: editingTransaction.date || getTodayString(),
        paymentMethod: editingTransaction.paymentMethod || 'Credit Card',
        image: editingTransaction.image || '',
        notes: editingTransaction.notes || ''
      });
      if (editingTransaction.image && !editingTransaction.image.startsWith('data:')) {
        setUrlInput(editingTransaction.image);
      }
      setErrors({});
      setTouched({});
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  // Validation function
  const validate = (dataToValidate = formData) => {
    const errs = {};
    if (!dataToValidate.title || !dataToValidate.title.trim()) {
      errs.title = 'Title / description is required';
    } else if (dataToValidate.title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }

    const parsedAmount = parseFloat(dataToValidate.amount);
    if (!dataToValidate.amount || isNaN(parsedAmount)) {
      errs.amount = 'Valid numerical amount is required';
    } else if (parsedAmount <= 0) {
      errs.amount = 'Amount must be greater than zero';
    }

    if (!dataToValidate.category) {
      errs.category = 'Please select a category';
    }

    if (!dataToValidate.date) {
      errs.date = 'Date is required';
    }

    return errs;
  };

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle type switch (Expense vs Income)
  const handleTypeChange = (newType) => {
    const defaultCat =
      newType === 'income' ? INCOME_CATEGORIES[0].name : EXPENSE_CATEGORIES[0].name;
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCat
    }));
  };

  // Blur handler for touched validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validate();
    setErrors(currentErrors);
  };

  // Image Upload handler (converts file to Base64 data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Selected image exceeds 2MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Preset picture selector
  const handleSelectPresetImage = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  // URL input apply
  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setFormData((prev) => ({ ...prev, image: urlInput.trim() }));
    }
  };

  // Remove attached picture
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setUrlInput('');
  };

  // Reset form to pristine state
  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: EXPENSE_CATEGORIES[0].name,
      date: getTodayString(),
      paymentMethod: 'Credit Card',
      image: '',
      notes: ''
    });
    setErrors({});
    setTouched({});
    setUrlInput('');
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        title: true,
        amount: true,
        category: true,
        date: true
      });
      return;
    }

    const transactionPayload = {
      id: editingTransaction ? editingTransaction.id : `tx-${Date.now()}`,
      title: formData.title.trim(),
      amount: parseFloat(parseFloat(formData.amount).toFixed(2)),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      image: formData.image || '',
      notes: formData.notes.trim()
    };

    onSaveTransaction(transactionPayload);

    if (!editingTransaction) {
      resetForm();
    }
  };

  const isEditing = Boolean(editingTransaction);
  const categoriesList = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className={`form-card-container ${isModal ? 'in-modal' : ''}`}>
      <div className="form-card-header">
        <div>
          <h3 className="form-title">
            {isEditing ? (
              <>
                <IconEdit size={20} className="icon-title" /> Edit Transaction
              </>
            ) : (
              <>
                <IconPlus size={20} className="icon-title" /> Record New Transaction
              </>
            )}
          </h3>
          <p className="form-subtitle">
            {isEditing
              ? 'Modify details and update your transaction entry'
              : 'Add an income or expense with category and optional product picture'}
          </p>
        </div>

        {isModal && onCancelEdit && (
          <button type="button" className="modal-close-btn" onClick={onCancelEdit}>
            <IconX size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="transaction-form">
        {/* Type Selector (Controlled Toggle) */}
        <div className="form-row type-selector-row">
          <label className="field-label">Transaction Type</label>
          <div className="type-toggle-group">
            <button
              type="button"
              className={`type-toggle-btn btn-expense ${
                formData.type === 'expense' ? 'is-selected' : ''
              }`}
              onClick={() => handleTypeChange('expense')}
            >
              Expense (-)
            </button>
            <button
              type="button"
              className={`type-toggle-btn btn-income ${
                formData.type === 'income' ? 'is-selected' : ''
              }`}
              onClick={() => handleTypeChange('income')}
            >
              Income (+)
            </button>
          </div>
        </div>

        {/* Title & Amount (2 Columns) */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="tx-title" className="field-label">
              Description / Title <span className="req">*</span>
            </label>
            <input
              id="tx-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={formData.type === 'income' ? 'e.g. Monthly Salary, Freelance Gig' : 'e.g. Supermarket Groceries, Coffee'}
              className={`form-input ${touched.title && errors.title ? 'has-error' : ''}`}
            />
            {touched.title && errors.title && (
              <span className="error-text">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tx-amount" className="field-label">
              Amount ($ USD) <span className="req">*</span>
            </label>
            <div className="input-currency-wrapper">
              <span className="currency-symbol">$</span>
              <input
                id="tx-amount"
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                className={`form-input input-with-symbol ${
                  touched.amount && errors.amount ? 'has-error' : ''
                }`}
              />
            </div>
            {touched.amount && errors.amount && (
              <span className="error-text">{errors.amount}</span>
            )}
          </div>
        </div>

        {/* Category & Payment Method (2 Columns) */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="tx-category" className="field-label">
              Category <span className="req">*</span>
            </label>
            <select
              id="tx-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${touched.category && errors.category ? 'has-error' : ''}`}
            >
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {touched.category && errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tx-payment" className="field-label">
              Payment Method
            </label>
            <select
              id="tx-payment"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="form-select"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="tx-date" className="field-label">
            Transaction Date <span className="req">*</span>
          </label>
          <input
            id="tx-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.date && errors.date ? 'has-error' : ''}`}
          />
          {touched.date && errors.date && (
            <span className="error-text">{errors.date}</span>
          )}
        </div>

        {/* Product / Receipt Picture Attachment */}
        <div className="form-group attachment-section">
          <div className="attachment-header">
            <label className="field-label">
              <IconImage size={16} /> Attach Product / Receipt Picture (Optional)
            </label>
            {formData.image && (
              <button
                type="button"
                className="btn-link text-danger"
                onClick={handleRemoveImage}
              >
                Remove Picture
              </button>
            )}
          </div>

          {/* Active Preview if attached */}
          {formData.image ? (
            <div className="image-active-preview">
              <img
                src={formData.image}
                alt="Product / Receipt Attachment"
                className="preview-img-thumb"
              />
              <div className="preview-meta">
                <span className="preview-status-pill">
                  <IconCheck size={14} /> Picture Attached
                </span>
                <span className="preview-hint">This image will appear in your transaction history and reports.</span>
              </div>
            </div>
          ) : (
            <div className="image-attachment-card">
              <div className="image-mode-tabs">
                <button
                  type="button"
                  className={`subtab-btn ${imageMode === 'preset' ? 'is-active' : ''}`}
                  onClick={() => setImageMode('preset')}
                >
                  Quick Presets
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${imageMode === 'upload' ? 'is-active' : ''}`}
                  onClick={() => setImageMode('upload')}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${imageMode === 'url' ? 'is-active' : ''}`}
                  onClick={() => setImageMode('url')}
                >
                  Web URL
                </button>
              </div>

              {imageMode === 'preset' && (
                <div className="preset-images-grid">
                  {PRESET_PRODUCT_IMAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className="preset-img-btn"
                      onClick={() => handleSelectPresetImage(preset.url)}
                      title={`Select ${preset.label}`}
                    >
                      <img src={preset.url} alt={preset.label} className="preset-thumb" />
                      <span className="preset-name">{preset.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {imageMode === 'upload' && (
                <div className="file-upload-box">
                  <input
                    type="file"
                    id="receipt-file-input"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-hidden-input"
                  />
                  <label htmlFor="receipt-file-input" className="file-upload-label">
                    <IconImage size={24} />
                    <span>Click to select an image from your computer</span>
                    <span className="file-subtext">Supports PNG, JPG, WebP (Max 2MB)</span>
                  </label>
                </div>
              )}

              {imageMode === 'url' && (
                <div className="url-input-box">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/receipt-or-product.jpg"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleApplyUrl}
                  >
                    Apply URL
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes / Remarks */}
        <div className="form-group">
          <label htmlFor="tx-notes" className="field-label">
            Notes & Remarks (Optional)
          </label>
          <textarea
            id="tx-notes"
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any extra details, invoice number, or reminder..."
            className="form-textarea"
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions-footer">
          <button
            type="button"
            className="btn btn-secondary btn-reset"
            onClick={resetForm}
          >
            <IconRefresh size={15} /> Reset Form
          </button>

          {isEditing && onCancelEdit && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              Cancel Edit
            </button>
          )}

          <button type="submit" className="btn btn-primary btn-submit">
            {isEditing ? (
              <>
                <IconCheck size={16} /> Save Changes
              </>
            ) : (
              <>
                <IconPlus size={16} /> Add {formData.type === 'income' ? 'Income' : 'Expense'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

