import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectIsAuthModalOpen,
  selectAuthRedirectReason,
  closeAuthModal,
  login,
  loginWithDemo
} from '../../features/auth/authSlice';
import { IconClose, IconUser, IconShield, IconCheck } from '../common/Icons';

export function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsAuthModalOpen);
  const redirectReason = useAppSelector(selectAuthRedirectReason);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (email.trim()) {
      dispatch(login({ email: email.trim() }));
    }
  };

  const handleDemoLogin = () => {
    dispatch(loginWithDemo());
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-icon-btn"
          onClick={handleClose}
          aria-label="Close sign in"
        >
          <IconClose size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-icon-wrap">
            <IconUser size={28} />
          </div>
          <h3 className="auth-title">Welcome to ApexCart</h3>
          <p className="auth-subtitle">
            Sign in to access your cart, order history, and express checkout.
          </p>
        </div>

        {redirectReason && (
          <div className="auth-reason-banner">
            <IconShield size={16} />
            <span>{redirectReason}</span>
          </div>
        )}

        <div className="demo-login-pane">
          <button
            type="button"
            className="demo-signin-btn"
            onClick={handleDemoLogin}
          >
            <IconCheck size={18} />
            <div className="demo-btn-text">
              <strong>Quick Demo Sign-In</strong>
              <span>Sign in instantly as Alex Turner</span>
            </div>
          </button>
        </div>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleCustomLogin} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign In with Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
