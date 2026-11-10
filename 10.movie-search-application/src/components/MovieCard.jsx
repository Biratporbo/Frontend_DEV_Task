import React, { useState } from 'react';
import { IconHeart, IconHeartOutline, IconStar, IconFilm } from './Icons';
import { isValidPoster } from '../api/omdbApi';

export function MovieCard({ movie, isFavorite, onToggleFavorite, onSelectMovie }) {
  const [imageError, setImageError] = useState(false);

  const hasValidPoster = isValidPoster(movie.Poster) && !imageError;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  const formattedType = (movie.Type || 'movie').charAt(0).toUpperCase() + (movie.Type || 'movie').slice(1);

  return (
    <article
      className="movie-card"
      onClick={() => onSelectMovie(movie.imdbID)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectMovie(movie.imdbID);
        }
      }}
    >
      <div className="card-poster-wrapper">
        {hasValidPoster ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            className="card-poster-img"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="card-poster-fallback">
            <IconFilm size={44} className="fallback-icon" />
            <span className="fallback-title">{movie.Title}</span>
            <span className="fallback-note">Poster Not Available</span>
          </div>
        )}

        <button
          type="button"
          className={`favorite-toggle-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <IconHeart size={18} fill="#ef4444" />
          ) : (
            <IconHeartOutline size={18} />
          )}
        </button>

        <span className="card-type-badge">{formattedType}</span>
      </div>

      <div className="card-info">
        <div className="card-meta-row">
          <span className="card-year">{movie.Year}</span>
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <span className="card-rating">
              <IconStar size={13} fill="#f59e0b" />
              <span>{movie.imdbRating}</span>
            </span>
          )}
        </div>

        <h3 className="card-title" title={movie.Title}>
          {movie.Title}
        </h3>

        <button
          type="button"
          className="card-details-link"
          onClick={(e) => {
            e.stopPropagation();
            onSelectMovie(movie.imdbID);
          }}
        >
          View Details →
        </button>
      </div>
    </article>
  );
}

export default MovieCard;
