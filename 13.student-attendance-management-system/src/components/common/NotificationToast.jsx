import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectToast, hideToast } from '../../features/filters/filtersSlice';
import { IconCheck, IconAlert, IconClose } from './Icons';

export function NotificationToast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className={`notification-toast ${isError ? 'toast-error' : 'toast-success'}`} role="alert">
      <div className="toast-icon">
        {isError ? <IconAlert size={20} /> : <IconCheck size={20} />}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={() => dispatch(hideToast())}
        aria-label="Close notification"
      >
        <IconClose size={16} />
      </button>
    </div>
  );
}

export default NotificationToast;
