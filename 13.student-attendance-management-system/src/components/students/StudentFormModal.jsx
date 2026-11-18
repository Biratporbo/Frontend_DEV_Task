import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectIsAddEditModalOpen,
  selectEditingStudent,
  closeAddEditModal,
  addStudent,
  updateStudent
} from '../../features/students/studentsSlice';
import { showToast } from '../../features/filters/filtersSlice';
import { DEPARTMENTS, SEMESTERS, SECTIONS } from '../../features/students/initialStudents';
import { IconClose, IconCheck, IconUser } from '../common/Icons';

export function StudentFormModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsAddEditModalOpen);
  const editingStudent = useAppSelector(selectEditingStudent);

  const isEdit = Boolean(editingStudent);

  const [formData, setFormData] = useState({
    id: '',
    rollNumber: '',
    name: '',
    department: 'Computer Science & Engineering',
    semester: 4,
    section: 'A',
    email: '',
    phone: '',
    avatarBg: '#2563eb'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        id: editingStudent.id,
        rollNumber: editingStudent.rollNumber || '',
        name: editingStudent.name || '',
        department: editingStudent.department || 'Computer Science & Engineering',
        semester: editingStudent.semester || 4,
        section: editingStudent.section || 'A',
        email: editingStudent.email || '',
        phone: editingStudent.phone || '',
        avatarBg: editingStudent.avatarBg || '#2563eb'
      });
      setErrors({});
    } else {
      setFormData({
        id: `STU-2024-${String(Math.floor(20 + Math.random() * 80)).padStart(3, '0')}`,
        rollNumber: `CS-${Math.floor(20 + Math.random() * 80)}`,
        name: '',
        department: 'Computer Science & Engineering',
        semester: 4,
        section: 'A',
        email: '',
        phone: '',
        avatarBg: '#2563eb'
      });
      setErrors({});
    }
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Student Name is required';
    if (!formData.id.trim()) newErrors.id = 'Student ID is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      dispatch(updateStudent(formData));
      dispatch(showToast({ message: `Student ${formData.name} updated successfully` }));
    } else {
      dispatch(addStudent(formData));
      dispatch(showToast({ message: `Student ${formData.name} enrolled successfully` }));
    }
    dispatch(closeAddEditModal());
  };

  return (
    <div className="modal-backdrop" onClick={() => dispatch(closeAddEditModal())} role="dialog" aria-modal="true">
      <div className="modal-box modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <IconUser size={20} />
            </div>
            <div>
              <h3 className="modal-title">{isEdit ? 'Edit Student Record' : 'Enroll New Student'}</h3>
              <p className="modal-subtitle">
                {isEdit ? 'Update student academic details and profile information' : 'Add student credentials to the central database'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={() => dispatch(closeAddEditModal())}
            aria-label="Close modal"
          >
            <IconClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="student-id" className="form-label">Student ID *</label>
              <input
                id="student-id"
                type="text"
                name="id"
                className={`form-input ${errors.id ? 'input-error' : ''}`}
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g. STU-2024-001"
                disabled={isEdit}
              />
              {errors.id && <span className="field-error-text">{errors.id}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="student-roll" className="form-label">Roll Number *</label>
              <input
                id="student-roll"
                type="text"
                name="rollNumber"
                className={`form-input ${errors.rollNumber ? 'input-error' : ''}`}
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. CS-01"
              />
              {errors.rollNumber && <span className="field-error-text">{errors.rollNumber}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="student-name" className="form-label">Full Name *</label>
            <input
              id="student-name"
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Aarav Sharma"
            />
            {errors.name && <span className="field-error-text">{errors.name}</span>}
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="student-dept" className="form-label">Department *</label>
              <select
                id="student-dept"
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="student-sem" className="form-label">Semester *</label>
              <select
                id="student-sem"
                name="semester"
                className="form-select"
                value={formData.semester}
                onChange={handleChange}
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="student-sec" className="form-label">Section *</label>
              <select
                id="student-sec"
                name="section"
                className="form-select"
                value={formData.section}
                onChange={handleChange}
              >
                {SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="student-email" className="form-label">Email Address *</label>
              <input
                id="student-email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@campus.edu"
              />
              {errors.email && <span className="field-error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="student-phone" className="form-label">Phone Number (Optional)</label>
              <input
                id="student-phone"
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 00000"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => dispatch(closeAddEditModal())}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <IconCheck size={18} />
              <span>{isEdit ? 'Save Changes' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentFormModal;
