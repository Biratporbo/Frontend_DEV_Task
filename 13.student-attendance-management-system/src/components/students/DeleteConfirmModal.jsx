import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectIsDeleteModalOpen,
  selectStudentToDelete,
  closeDeleteModal,
  deleteStudent
} from '../../features/students/studentsSlice';
import { purgeStudentAttendance } from '../../features/attendance/attendanceSlice';
import { showToast } from '../../features/filters/filtersSlice';
import { IconAlert, IconTrash } from '../common/Icons';

export function DeleteConfirmModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsDeleteModalOpen);
  const student = useAppSelector(selectStudentToDelete);

  if (!isOpen || !student) return null;

  const handleDelete = () => {
    dispatch(deleteStudent(student.id));
    dispatch(purgeStudentAttendance(student.id));
    dispatch(showToast({ message: `Student ${student.name} deleted successfully`, type: 'info' }));
    dispatch(closeDeleteModal());
  };

  return (
    <div className="modal-backdrop" onClick={() => dispatch(closeDeleteModal())} role="dialog" aria-modal="true">
      <div className="modal-box modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-body">
          <div className="delete-icon-wrap">
            <IconAlert size={32} />
          </div>
          <h3 className="delete-modal-title">Delete Student Record?</h3>
          <p className="delete-modal-desc">
            Are you sure you want to remove <strong>{student.name}</strong> ({student.id})? All past attendance records associated with this student will also be purged.
          </p>

          <div className="delete-actions-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => dispatch(closeDeleteModal())}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              <IconTrash size={16} />
              <span>Confirm Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
