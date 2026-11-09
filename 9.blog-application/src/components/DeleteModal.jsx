import React, { useEffect } from 'react';
import { IconTrash, IconX } from './Icons';

export default function DeleteModal({ blog, onConfirm, onCancel, isDeleting }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  if (!blog) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box delete-confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-danger-icon">
          <IconTrash size={28} />
        </div>

        <h3 className="modal-heading">Delete Blog Post?</h3>
        <p className="modal-subtext">
          Are you sure you want to permanently delete this article from the database? This action cannot be undone.
        </p>

        <div className="target-blog-preview">
          <span className="target-title">{blog.title}</span>
          <span className="target-author">By {blog.author} &bull; {blog.category}</span>
        </div>

        <div className="modal-btn-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(blog.id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
