import axios from 'axios';
import { INITIAL_FEATURED_MOVIES, FALLBACK_MOVIE_DETAILS } from './fallbackData';

const BASE_URL = 'https://www.omdbapi.com/';
const DEFAULT_KEY = process.env.REACT_APP_OMDB_API_KEY || 'trilogy';

// In-memory cache for search queries and movie details to optimize network requests
const searchCache = new Map();
const detailsCache = new Map();

/**
 * Get current active API key (prioritizes user custom key from localStorage)
 */
export function getActiveApiKey() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('omdb_custom_api_key');
    if (saved && saved.trim()) return saved.trim();
  }
  return DEFAULT_KEY;
}

/**
 * Save user custom API key to localStorage
 */
export function setCustomApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('omdb_custom_api_key', key.trim());
    } else {
      localStorage.removeItem('omdb_custom_api_key');
    }
    // Clear cache when key changes
    searchCache.clear();
    detailsCache.clear();
  }
}

/**
 * Search movies via OMDb API with caching and debounce compatibility
 * @param {string} query - Movie title query
 * @param {number} page - Page number (1-based)
 * @param {string} type - Filter type: 'movie' | 'series' | 'episode' | ''
 * @param {string} year - Release year filter
 * @returns {Promise<{ movies: Array, totalResults: number, totalPages: number }>}
 */
export async function searchMovies(query, page = 1, type = '', year = '') {
  const trimmed = (query || '').trim();

  // If query is empty, return featured movies
  if (!trimmed) {
    return {
      movies: INITIAL_FEATURED_MOVIES,
      totalResults: INITIAL_FEATURED_MOVIES.length,
      totalPages: 1,
      isFeatured: true
    };
  }

  const cacheKey = `${getActiveApiKey()}_${trimmed.toLowerCase()}_${page}_${type}_${year}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const params = {
    apikey: getActiveApiKey(),
    s: trimmed,
    page: page
  };
  if (type) params.type = type;
  if (year) params.y = year;

  try {
    const response = await axios.get(BASE_URL, {
      params,
      timeout: 8000
    });

    const data = response.data;

    if (data.Response === 'True') {
      const total = parseInt(data.totalResults, 10) || 0;
      const result = {
        movies: data.Search || [],
        totalResults: total,
        totalPages: Math.ceil(total / 10),
        isFeatured: false
      };
      searchCache.set(cacheKey, result);
      return result;
    } else {
      // Error from OMDb (e.g. "Movie not found!", "Too many results.")
      throw new Error(data.Error || 'No movies found matching your query.');
    }
  } catch (err) {
    // Check if error is related to rate limiting or invalid key, check local fallback
    const filteredFallback = INITIAL_FEATURED_MOVIES.filter(m =>
      m.Title.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (filteredFallback.length > 0 && page === 1) {
      return {
        movies: filteredFallback,
        totalResults: filteredFallback.length,
        totalPages: 1,
        isFeatured: true,
        notice: 'Displaying offline results. Check your API key or network connection.'
      };
    }

    if (err.message && err.message.includes('No movies found')) {
      throw err;
    }
    throw new Error(err.response?.data?.Error || err.message || 'Failed to fetch movies from OMDb API.');
  }
}

/**
 * Fetch full movie details by IMDb ID
 * @param {string} imdbID - IMDb identifier (e.g. 'tt0468569')
 * @returns {Promise<object>} Full movie object
 */
export async function getMovieDetails(imdbID) {
  if (!imdbID) throw new Error('Valid IMDb ID is required');

  const cacheKey = `${getActiveApiKey()}_${imdbID}`;
  if (detailsCache.has(cacheKey)) {
    return detailsCache.get(cacheKey);
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: getActiveApiKey(),
        i: imdbID,
        plot: 'full'
      },
      timeout: 8000
    });

    const data = response.data;

    if (data.Response === 'True') {
      detailsCache.set(cacheKey, data);
      return data;
    } else {
      // If OMDb fails, check fallback dataset
      if (FALLBACK_MOVIE_DETAILS[imdbID]) {
        return FALLBACK_MOVIE_DETAILS[imdbID];
      }
      throw new Error(data.Error || 'Could not load movie details.');
    }
  } catch (err) {
    if (FALLBACK_MOVIE_DETAILS[imdbID]) {
      return FALLBACK_MOVIE_DETAILS[imdbID];
    }
    throw new Error(err.message || 'Failed to load movie details.');
  }
}

/**
 * Validate whether a poster URL is a legitimate image
 */
export function isValidPoster(url) {
  if (!url || url === 'N/A' || !url.startsWith('http')) return false;
  return true;
}
