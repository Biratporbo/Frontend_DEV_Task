import React, { useEffect, useState, useCallback } from 'react';
import { getMovieDetails, isValidPoster } from '../api/omdbApi';
import {
  IconClose,
  IconStar,
  IconHeart,
  IconHeartOutline,
  IconFilm,
  IconClock,
  IconCalendar,
  IconExternal
} from './Icons';
import LoadingSpinner from './LoadingSpinner';

export function MovieDetailModal({ imdbID, onClose, isFavorite, onToggleFavorite }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!imdbID) return;
    setLoading(true);
    setError('');
    setImageError(false);

    try {
      const data = await getMovieDetails(imdbID);
      setMovie(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve movie details.');
    } finally {
      setLoading(false);
    }
  }, [imdbID]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const hasValidPoster = movie && isValidPoster(movie.Poster) && !imageError;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-movie-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          <IconClose size={20} />
        </button>

        {loading && (
          <div className="modal-loading-wrapper">
            <LoadingSpinner text="Fetching full movie details..." />
          </div>
        )}

        {error && !loading && (
          <div className="modal-error-box">
            <p className="modal-error-msg">{error}</p>
            <button type="button" className="retry-btn" onClick={fetchDetails}>
              Retry Loading
            </button>
          </div>
        )}

        {movie && !loading && (
          <div className="movie-detail-body">
            <div className="modal-poster-col">
              {hasValidPoster ? (
                <img
                  src={movie.Poster}
                  alt={`${movie.Title} poster`}
                  className="modal-poster-img"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="modal-poster-fallback">
                  <IconFilm size={56} className="modal-fallback-icon" />
                  <span className="modal-fallback-title">{movie.Title}</span>
                  <span className="modal-fallback-sub">No Poster Available</span>
                </div>
              )}

              <div className="modal-side-actions">
                <button
                  type="button"
                  className={`modal-favorite-btn ${isFavorite ? 'favorited' : ''}`}
                  onClick={() => onToggleFavorite(movie)}
                >
                  {isFavorite ? (
                    <>
                      <IconHeart size={18} fill="#ef4444" />
                      <span>In Favorites</span>
                    </>
                  ) : (
                    <>
                      <IconHeartOutline size={18} />
                      <span>Add to Favorites</span>
                    </>
                  )}
                </button>

                {movie.imdbID && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbID}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-imdb-link"
                  >
                    <span>View on IMDb</span>
                    <IconExternal size={14} />
                  </a>
                )}
              </div>
            </div>

            <div className="modal-info-col">
              <div className="modal-header-meta">
                <div className="header-badges">
                  {movie.Rated && movie.Rated !== 'N/A' && (
                    <span className="rated-badge">{movie.Rated}</span>
                  )}
                  {movie.Type && (
                    <span className="type-badge-pill">{movie.Type.toUpperCase()}</span>
                  )}
                </div>

                <h2 id="modal-movie-title" className="modal-title">
                  {movie.Title}
                </h2>

                <div className="meta-subrow">
                  {movie.Year && (
                    <span className="meta-item">
                      <IconCalendar size={14} />
                      {movie.Year}
                    </span>
                  )}
                  {movie.Runtime && movie.Runtime !== 'N/A' && (
                    <span className="meta-item">
                      <IconClock size={14} />
                      {movie.Runtime}
                    </span>
                  )}
                  {movie.Released && movie.Released !== 'N/A' && (
                    <span className="meta-item release-date">
                      Released: {movie.Released}
                    </span>
                  )}
                </div>
              </div>

              {/* Genre Pills */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="genre-pills">
                  {movie.Genre.split(',').map((g) => (
                    <span key={g.trim()} className="genre-pill">
                      {g.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Ratings Section */}
              <div className="ratings-section">
                <h4 className="ratings-heading">Ratings & Critical Reception:</h4>
                <div className="ratings-cards-grid">
                  {/* IMDb Rating */}
                  <div className="rating-card imdb-card">
                    <div className="rating-source">
                      <IconStar size={16} fill="#f59e0b" />
                      <span>IMDb Score</span>
                    </div>
                    <div className="rating-value">
                      <strong>{movie.imdbRating || 'N/A'}</strong>
                      <span className="rating-denom">/10</span>
                    </div>
                    {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                      <span className="rating-votes">{movie.imdbVotes} votes</span>
                    )}
                  </div>

                  {/* Other ratings (Rotten Tomatoes, Metacritic) */}
                  {Array.isArray(movie.Ratings) &&
                    movie.Ratings.map((r) => {
                      if (r.Source === 'Internet Movie Database') return null;
                      return (
                        <div key={r.Source} className="rating-card">
                          <div className="rating-source">
                            <span>{r.Source}</span>
                          </div>
                          <div className="rating-value">
                            <strong>{r.Value}</strong>
                          </div>
                        </div>
                      );
                    })}

                  {(!movie.Ratings || movie.Ratings.length === 0) && (!movie.imdbRating || movie.imdbRating === 'N/A') && (
                    <p className="no-ratings-text">No ratings available for this title.</p>
                  )}
                </div>
              </div>

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div className="plot-section">
                  <h4 className="section-label">Storyline / Plot:</h4>
                  <p className="plot-text">{movie.Plot}</p>
                </div>
              )}

              {/* Cast & Crew details */}
              <div className="details-metadata-table">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div className="meta-row">
                    <span className="meta-label">Director:</span>
                    <span className="meta-value">{movie.Director}</span>
                  </div>
                )}
                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div className="meta-row">
                    <span className="meta-label">Writers:</span>
                    <span className="meta-value">{movie.Writer}</span>
                  </div>
                )}
                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div className="meta-row">
                    <span className="meta-label">Cast / Stars:</span>
                    <span className="meta-value">{movie.Actors}</span>
                  </div>
                )}
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div className="meta-row">
                    <span className="meta-label">Awards:</span>
                    <span className="meta-value">{movie.Awards}</span>
                  </div>
                )}
                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div className="meta-row">
                    <span className="meta-label">Box Office:</span>
                    <span className="meta-value">{movie.BoxOffice}</span>
                  </div>
                )}
                {movie.Language && movie.Language !== 'N/A' && (
                  <div className="meta-row">
                    <span className="meta-label">Language:</span>
                    <span className="meta-value">{movie.Language}</span>
                  </div>
                )}
                {movie.Country && movie.Country !== 'N/A' && (
                  <div className="meta-row">
                    <span className="meta-label">Country:</span>
                    <span className="meta-value">{movie.Country}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetailModal;
