import React from 'react';
import './EmployeeList.css';

function EmployeeList({
  employees,
  onEdit,
  onDelete,
  onViewDetails,
  onClearFilters,
  isFiltered
}) {
  // Conditional rendering for empty state
  if (employees.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-icon">🔍</div>
        <h3 className="empty-title">No Employees Found</h3>
        <p className="empty-text">
          {isFiltered
            ? 'No employee records match your search or filter criteria.'
            : 'There are currently no employees in the directory.'}
        </p>
        {isFiltered && (
          <button type="button" className="btn-clear-empty" onClick={onClearFilters}>
            Clear Search & Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="employee-table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Local Address</th>
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="employee-row">
              <td className="emp-id-cell">
                <span className="id-badge">{emp.id}</span>
              </td>
              <td className="emp-name-cell">
                <strong>{emp.name}</strong>
              </td>
              <td>
                <span className="dept-tag">{emp.department}</span>
              </td>
              <td>{emp.gender}</td>
              <td className="emp-phone-cell">{emp.phone}</td>
              <td className="emp-address-cell" title={emp.localAddress}>
                {emp.localAddress.length > 35
                  ? `${emp.localAddress.substring(0, 35)}...`
                  : emp.localAddress}
              </td>
              <td className="emp-actions-cell">
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn-action btn-view"
                    onClick={() => onViewDetails(emp)}
                    title="View Full Details & Permanent Address"
                  >
                    👁️ View
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-edit"
                    onClick={() => onEdit(emp)}
                    title="Edit Employee"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-delete"
                    onClick={() => onDelete(emp.id, emp.name)}
                    title="Delete Employee"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;

