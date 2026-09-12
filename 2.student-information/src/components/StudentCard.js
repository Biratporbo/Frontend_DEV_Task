// src/components/StudentCard.js
import React, { useState } from 'react';
import './StudentCard.css';

/**
 * StudentCard Component
 * Displays individual student details: Name, Roll Number, Department, Semester, CGPA, and Photo.
 * ALL student details are strictly received via Props.
 */
function StudentCard(props) {
  const {
    name,
    rollNumber,
    department,
    semester,
    cgpa,
    photo,
    rank,
    email
  } = props;

  // Fallback state if the image URL fails to load
  const [imageError, setImageError] = useState(false);

  // Derive initials for avatar fallback
  const getInitials = (fullName) => {
    if (!fullName) return 'ST';
    return fullName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Determine CGPA styling tier
  const getCgpaTier = (score) => {
    if (score >= 9.0) {
      return { className: 'tier-outstanding', label: 'Outstanding', color: '#059669' };
    } else if (score >= 8.0) {
      return { className: 'tier-excellent', label: 'Very Good', color: '#2563eb' };
    } else if (score >= 7.0) {
      return { className: 'tier-good', label: 'Good', color: '#7c3aed' };
    }
    return { className: 'tier-average', label: 'Satisfactory', color: '#d97706' };
  };

  const tier = getCgpaTier(cgpa);
  const percentage = Math.min(Math.max((cgpa / 10) * 100, 0), 100);

  return (
    <article className={`student-card ${tier.className}`}>
      {/* Top badges: Rank (if sorted) & Academic Standing */}
      <div className="card-top-bar">
        {rank !== undefined && rank !== null && (
          <span className="rank-badge" title={`Ranked #${rank} by CGPA`}>
            Rank #{rank}
          </span>
        )}
        {cgpa >= 9.0 && (
          <span className="badge-honor">
            ★ Dean's List
          </span>
        )}
      </div>

      {/* Student Photo with fallback */}
      <div className="card-avatar-wrapper">
        {!imageError && photo ? (
          <img
            src={photo}
            alt={`${name}'s portrait`}
            className="student-avatar"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="student-avatar-fallback" aria-label={name}>
            <span>{getInitials(name)}</span>
          </div>
        )}
      </div>

      {/* Primary Info */}
      <div className="card-header-info">
        <h2 className="student-name">{name}</h2>
        <span className="roll-number-badge">
          <span className="roll-label">Roll No:</span>
          <strong>{rollNumber}</strong>
        </span>
      </div>

      {/* Metadata Grid */}
      <div className="student-details-grid">
        <div className="detail-item">
          <span className="detail-label">Department</span>
          <span className="detail-value department" title={department}>
            🏛️ {department}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Semester</span>
          <span className="detail-value">
            📅 {semester}
          </span>
        </div>

        {email && (
          <div className="detail-item full-width">
            <span className="detail-label">Contact</span>
            <span className="detail-value email" title={email}>
              ✉️ {email}
            </span>
          </div>
        )}
      </div>

      {/* CGPA Display Section */}
      <div className="cgpa-section">
        <div className="cgpa-header">
          <span className="cgpa-title">Cumulative GPA</span>
          <div className="cgpa-value-container">
            <span className="cgpa-number">{Number(cgpa).toFixed(2)}</span>
            <span className="cgpa-max">/ 10.0</span>
          </div>
        </div>

        {/* CGPA Meter Bar */}
        <div
          className="cgpa-progress-track"
          role="progressbar"
          aria-valuenow={cgpa}
          aria-valuemin="0"
          aria-valuemax="10"
          title={`CGPA: ${cgpa} out of 10.0`}
        >
          <div
            className="cgpa-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="cgpa-tier-indicator">
          <span className={`status-pill ${tier.className}`}>
            {tier.label}
          </span>
        </div>
      </div>
    </article>
  );
}

export default StudentCard;

