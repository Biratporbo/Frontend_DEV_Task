import React from 'react';
import './EmployeeDetailModal.css';

function EmployeeDetailModal({ employee, onClose, onEdit }) {
  if (!employee) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">{employee.id}</span>
            <h3 className="modal-title">{employee.name}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{employee.department}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{employee.gender}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Phone Number:</span>
            <span className="detail-value">{employee.phone}</span>
          </div>

          <div className="detail-block">
            <span className="detail-label">Local Address:</span>
            <div className="address-box">{employee.localAddress}</div>
          </div>

          <div className="detail-block">
            <span className="detail-label">Permanent Address:</span>
            <div className="address-box">{employee.permanentAddress}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-edit"
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
          >
            ✏️ Edit Employee
          </button>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetailModal;

