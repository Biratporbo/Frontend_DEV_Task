import React from 'react';
import './WeatherCard.css';

function WeatherCard({ data }) {
  if (!data) return null;

  // Convert unix timestamp to readable time string
  const formatTime = (unixTime, timezoneOffset) => {
    // OpenWeatherMap returns timezone offset in seconds.
    // Creating a date object based on the local time of the searched city.
    const date = new Date((unixTime + timezoneOffset) * 1000);
    // Use UTC methods to get the correct time for that specific timezone
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const {
    name,
    sys,
    main,
    wind,
    weather,
    timezone
  } = data;

  const weatherDetails = weather && weather.length > 0 ? weather[0] : null;
  const iconUrl = weatherDetails 
    ? `http://openweathermap.org/img/wn/${weatherDetails.icon}@2x.png` 
    : '';

  return (
    <div className="weather-card glass-panel">
      <div className="weather-header">
        <h2 className="city-name">{name}, {sys.country}</h2>
        <p className="weather-description">
          {weatherDetails ? weatherDetails.description : 'Unknown'}
        </p>
      </div>

      <div className="weather-main">
        {iconUrl && (
          <img 
            src={iconUrl} 
            alt="Weather representation" 
            className="weather-icon" 
          />
        )}
        <div className="temperature-box">
          <span className="temperature">{Math.round(main.temp)}</span>
          <span className="unit">°C</span>
        </div>
      </div>

      <div className="weather-details-grid">
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Sunrise</span>
          <span className="detail-value">{formatTime(sys.sunrise, timezone)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Sunset</span>
          <span className="detail-value">{formatTime(sys.sunset, timezone)}</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;

