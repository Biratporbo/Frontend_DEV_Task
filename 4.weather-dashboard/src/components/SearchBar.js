import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [cityInput, setCityInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim() !== '') {
      onSearch(cityInput.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Enter city name (e.g. London, Tokyo)..."
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;

