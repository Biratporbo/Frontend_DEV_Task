import React from 'react';
import { IconStar } from './Icons';

export function StarRating({ rate = 0, count = 0, showCount = true }) {
  const rounded = Math.round((rate || 0) * 10) / 10;

  return (
    <div className="star-rating-wrap" aria-label={`Rating: ${rounded} out of 5 stars`}>
      <div className="star-icons-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <IconStar
            key={star}
            size={14}
            fill={star <= Math.round(rounded) ? '#f59e0b' : '#cbd5e1'}
          />
        ))}
      </div>
      <span className="rating-score">{rounded.toFixed(1)}</span>
      {showCount && count > 0 && (
        <span className="rating-count">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

export default StarRating;
