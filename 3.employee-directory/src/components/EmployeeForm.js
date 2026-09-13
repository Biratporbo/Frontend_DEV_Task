import React, { useState, useEffect } from 'react';
import './EmployeeForm.css';

const DEFAULT_DEPARTMENTS = [
  'Crop Production',
  'Dairy & Livestock',
  'Farm Machinery',
  'Horticulture',
  'Harvesting & Storage',
  'Administration'
];

function EmployeeForm({
  onSave,
  onCancel,
  editingEmployee,
  existingIds = []
}) {
  // Form input state using useState
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: 'Crop Production',
    gender: 'Male',
    phone: '',
    localAddress: '',
    permanentAddress: ''
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [errors, setErrors] = useState({});

  // When editing, populate form with employee data
  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        id: editingEmployee.id || '',
        name: editingEmployee.name || '',
        department: editingEmployee.department || 'Crop Production',
        gender: editingEmployee.gender || 'Male',
        phone: editingEmployee.phone || '',
        localAddress: editingEmployee.localAddress || '',
        permanentAddress: editingEmployee.permanentAddress || ''
      });
      setSameAddress(
        editingEmployee.localAddress === editingEmployee.permanentAddress &&
        editingEmployee.localAddress !== ''
      );
      setErrors({});
    } else {
      // Clear form when in add mode
      setFormData({
        id: '',
        name: '',
        department: 'Crop Production',
        gender: 'Male',
        phone: '',
        localAddress: '',
        permanentAddress: ''
      });
      setSameAddress(false);
      setErrors({});
    }
  }, [editingEmployee]);

  // Handle text & select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If same address checkbox is checked, mirror local to permanent
      if (name === 'localAddress' && sameAddress) {
        updated.permanentAddress = value;
      }
      return updated;
    });

    // Clear error for the field being typed into
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle "Same Address" checkbox
  const handleSameAddressToggle = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: prev.localAddress
      }));
      if (errors.permanentAddress) {
        setErrors((prev) => ({ ...prev, permanentAddress: '' }));
      }
    }
  };

  // Validate form fields before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Employee ID is required';
    } else if (
      !editingEmployee &&
      existingIds.includes(formData.id.trim().toUpperCase())
    ) {
      newErrors.id = 'This Employee ID already exists';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.localAddress.trim()) {
      newErrors.localAddress = 'Local address is required';
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Permanent address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission event
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanedData = {
      ...formData,
      id: formData.id.trim().toUpperCase(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      localAddress: formData.localAddress.trim(),
      permanentAddress: formData.permanentAddress.trim()
    };

    onSave(cleanedData, Boolean(editingEmployee));
  };

  const isEditing = Boolean(editingEmployee);

  return (
    <div className="form-card">
      <div className="form-header">
        <h2 className="form-title">
          {isEditing ? `Edit Employee Details (${formData.id})` : 'Add New Farm Employee'}
        </h2>
        <p className="form-subtitle">
          {isEditing
            ? 'Update the required employee information below and click Save Changes.'
            : 'Fill out the form below to register a new farm staff member.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="employee-form" noValidate>
        <div className="form-grid">
          {/* Employee ID */}
          <div className="form-field">
            <label htmlFor="emp-id" className="form-label">
              Employee ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="emp-id"
              name="id"
              className={`form-input ${errors.id ? 'input-error' : ''}`}
              placeholder="e.g. EMP-109"
              value={formData.id}
              onChange={handleChange}
              disabled={isEditing}
            />
            {errors.id && <span className="error-text">{errors.id}</span>}
          </div>

          {/* Full Name */}
          <div className="form-field">
            <label htmlFor="emp-name" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="emp-name"
              name="name"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Harpreet Singh"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Department Name */}
          <div className="form-field">
            <label htmlFor="emp-dept" className="form-label">
              Department Name <span className="required">*</span>
            </label>
            <select
              id="emp-dept"
              name="department"
              className={`form-select ${errors.department ? 'input-error' : ''}`}
              value={formData.department}
              onChange={handleChange}
            >
              {DEFAULT_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>

          {/* Gender */}
          <div className="form-field">
            <label className="form-label">
              Gender <span className="required">*</span>
            </label>
            <div className="gender-radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                />
                <span>Male</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                />
                <span>Female</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleChange}
                />
                <span>Other</span>
              </label>
            </div>
          </div>

          {/* Phone Number */}
          <div className="form-field">
            <label htmlFor="emp-phone" className="form-label">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="emp-phone"
              name="phone"
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              placeholder="10-digit number e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="address-section">
          {/* Local Address */}
          <div className="form-field full-width">
            <label htmlFor="emp-local" className="form-label">
              Local Address <span className="required">*</span>
            </label>
            <textarea
              id="emp-local"
              name="localAddress"
              rows="2"
              className={`form-textarea ${errors.localAddress ? 'input-error' : ''}`}
              placeholder="Current residence / farm staff quarter..."
              value={formData.localAddress}
              onChange={handleChange}
            />
            {errors.localAddress && (
              <span className="error-text">{errors.localAddress}</span>
            )}
          </div>

          {/* Same address checkbox */}
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={handleSameAddressToggle}
              />
              <span>Permanent address is same as local address</span>
            </label>
          </div>

          {/* Permanent Address */}
          <div className="form-field full-width">
            <label htmlFor="emp-permanent" className="form-label">
              Permanent Address <span className="required">*</span>
            </label>
            <textarea
              id="emp-permanent"
              name="permanentAddress"
              rows="2"
              className={`form-textarea ${errors.permanentAddress ? 'input-error' : ''}`}
              placeholder="Home town / permanent residential address..."
              value={formData.permanentAddress}
              onChange={handleChange}
              disabled={sameAddress}
            />
            {errors.permanentAddress && (
              <span className="error-text">{errors.permanentAddress}</span>
            )}
          </div>
        </div>

        {/* Buttons: Submit & Cancel */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;

