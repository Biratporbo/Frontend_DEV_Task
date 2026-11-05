/**
 * Exports transaction records to a CSV file and triggers native browser download.
 */
export const exportToCSV = (transactions, customFilename) => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export.');
    return;
  }

  const headers = [
    'ID',
    'Date',
    'Type',
    'Title',
    'Category',
    'Amount ($)',
    'Payment Method',
    'Notes',
    'Has Attached Picture'
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = transactions.map((t) => [
    escapeCSV(t.id),
    escapeCSV(t.date),
    escapeCSV(t.type.toUpperCase()),
    escapeCSV(t.title),
    escapeCSV(t.category),
    escapeCSV(typeof t.amount === 'number' ? t.amount.toFixed(2) : parseFloat(t.amount || 0).toFixed(2)),
    escapeCSV(t.paymentMethod || 'N/A'),
    escapeCSV(t.notes || ''),
    escapeCSV(t.image ? 'Yes' : 'No')
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', customFilename || `expenses_report_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

