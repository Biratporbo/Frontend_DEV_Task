import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      setWeatherData(null);

      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
          throw new Error(
            'API Key is missing! To get real-time data, please sign up for a free key at openweathermap.org and paste it into your .env file.'
          );
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`City "${city}" not found. Please check the spelling.`);
          }
          throw new Error('Failed to fetch weather data. Please try again later.');
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearch = (searchCity) => {
    setCity(searchCity);
  };

  // Determine background class based on weather condition
  const getBackgroundClass = () => {
    if (!weatherData) return 'app-container default-bg';
    const mainWeather = weatherData.weather[0].main.toLowerCase();
    
    if (mainWeather.includes('clear')) return 'app-container clear-bg';
    if (mainWeather.includes('cloud')) return 'app-container cloud-bg';
    if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) return 'app-container rain-bg';
    if (mainWeather.includes('snow')) return 'app-container snow-bg';
    if (mainWeather.includes('thunderstorm')) return 'app-container storm-bg';
    return 'app-container default-bg';
  };

  return (
    <div className={getBackgroundClass()}>
      <div className="dashboard-overlay">
        <header className="app-header">
          <h1>SkyCast Dashboard</h1>
          <p>Real-time meteorological insights</p>
        </header>

        <main className="main-content">
          <SearchBar onSearch={handleSearch} />
          
          {isLoading && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error} />}
          
          {!isLoading && !error && weatherData && (
            <WeatherCard data={weatherData} />
          )}

          {!isLoading && !error && !weatherData && (
            <div className="empty-state glass-panel">
              <p>Enter a city name above to view its current weather.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
