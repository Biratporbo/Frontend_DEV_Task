import React from 'react';
import { IconCheck, IconAlert } from './Icons';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={`toast-banner toast-${type}`}>
      <span className="toast-icon-circle">
        {isError ? <IconAlert size={14} /> : <IconCheck size={14} />}
      </span>
      <span className="toast-text">{message}</span>
    </div>
  );
}
