import React from 'react';
import { evaluatePasswordStrength } from '../services/passwordStrength';
import './PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password }) => {
  const strength = evaluatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength-container">
      <div className="strength-header">
        <span className="strength-title">Password Strength:</span>
        <span className="strength-label" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      <div className="strength-bar-track">
        <div
          className="strength-bar-fill"
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.color,
          }}
        ></div>
      </div>

      <div className="strength-criteria-list">
        {strength.criteria.map((item) => (
          <div
            key={item.id}
            className={`criterion-item ${item.met ? 'criterion-met' : 'criterion-unmet'}`}
          >
            <span className="criterion-icon">
              {item.met ? '✓' : '○'}
            </span>
            <span className="criterion-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;

