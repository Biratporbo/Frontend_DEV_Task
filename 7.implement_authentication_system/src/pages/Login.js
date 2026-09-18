import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import './Login.css';

const Login = () => {
  const { login, rememberedUsername, sessionExpiredNotice, setSessionExpiredNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState(rememberedUsername || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedUsername));
  const [showPassword, setShowPassword] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, [rememberedUsername]);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (!validateForm()) return;

    login({
      username: username.trim(),
      password,
      rememberMe,
    });

    navigate(from, { replace: true });
  };

  // Quick-fill credentials for reviewers
  const handleQuickLogin = (roleUsername, demoPassword) => {
    setUsername(roleUsername);
    setPassword(demoPassword);
    setErrors({});
    login({
      username: roleUsername,
      password: demoPassword,
      rememberMe,
    });
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-brand-header">
          <div className="login-brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1>AuthGuard System</h1>
          <p>Secure Enterprise Workspace with Simulated JWT Verification</p>
        </div>

        {/* Session Expired Banner */}
        {sessionExpiredNotice && (
          <div className="session-notice-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="session-notice-text">
              <strong>Session Expired / Token Invalidated</strong>
              <span>Your simulated JWT token has expired. Please authenticate to regain access.</span>
            </div>
            <button onClick={() => setSessionExpiredNotice(false)} className="close-notice-btn">
              &times;
            </button>
          </div>
        )}

        {/* Protected Route Redirection Notice */}
        {location.state?.from && !sessionExpiredNotice && (
          <div className="protected-alert-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span><strong>Protected Route:</strong> Sign in to access <code>{location.state.from.pathname}</code>.</span>
          </div>
        )}

        <div className="card login-form-card">
          <form onSubmit={handleSubmit} noValidate className="login-auth-form">
            {/* Username Field (Required) */}
            <div className="form-field-group">
              <label htmlFor="username">
                Username <span className="field-required">*</span>
              </label>
              <div className="input-icon-wrapper">
                <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
                  }}
                  onBlur={() => handleBlur('username')}
                  className={touched.username && errors.username ? 'input-error' : ''}
                  autoComplete="username"
                  required
                />
              </div>
              {touched.username && errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            {/* Password Field (Required + Display Password Strength) */}
            <div className="form-field-group">
              <label htmlFor="password">
                Password <span className="field-required">*</span>
              </label>
              <div className="input-icon-wrapper">
                <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  onBlur={() => handleBlur('password')}
                  className={touched.password && errors.password ? 'input-error' : ''}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}

              {/* Real-time Display Password Strength */}
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Remember User Checkbox */}
            <div className="form-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember User on this browser</span>
              </label>
              <span className="storage-hint">
                {rememberMe ? '(localStorage - persistent)' : '(sessionStorage - active session)'}
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Authenticate & Issue JWT
            </button>
          </form>

          <div className="login-divider">
            <span>QUICK-FILL TEST ACCOUNTS</span>
          </div>

          <div className="demo-accounts-grid">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'AdminPass@2026!')}
              className="btn btn-secondary btn-sm demo-acc-btn"
            >
              <span className="demo-role">Administrator</span>
              <span className="demo-meta">admin / Strong Pass</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('developer', 'DevSecure#789')}
              className="btn btn-secondary btn-sm demo-acc-btn"
            >
              <span className="demo-role">Team Member</span>
              <span className="demo-meta">developer / Good Pass</span>
            </button>
          </div>
        </div>

        <div className="login-info-footer">
          <span>🔒 Protected Routes &bull; 🔑 Simulated JWT (RFC 7519) &bull; 💾 Local / Session Storage</span>
        </div>
      </div>
    </div>
  );
};

export default Login;

