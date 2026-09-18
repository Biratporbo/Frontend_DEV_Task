# Weather Dashboard

A simple, responsive, and beautiful glassmorphism Weather Dashboard built with React. This application demonstrates the use of `fetch`, `async/await`, and the `useEffect` hook to integrate with the OpenWeatherMap API and display live weather data.



## Features

- **Live Weather Data**: Displays accurate Temperature, Humidity, Wind Speed, Sunrise, and Sunset times.
- **City Search**: Allows users to dynamically search for weather conditions in any city worldwide.
- **Weather Icons**: Fetches and displays the corresponding weather representation directly from OpenWeatherMap.
- **Loading State**: Displays a clean CSS loading spinner while data is being fetched.
- **Error Handling**: Provides clear user feedback for missing cities, network issues, or missing API keys.

## Component Architecture

- `App`: Main container handling state (`city`, `weatherData`, `isLoading`, `error`) and the `useEffect` hook for API integration.
- `SearchBar`: A controlled form component for capturing the user's city query.
- `WeatherCard`: A display component that formats and presents the fetched weather metrics (including Unix timestamp conversion for sunrise/sunset).
- `LoadingSpinner`: A visual indicator during asynchronous API calls.
- `ErrorMessage`: A reusable banner for displaying API or validation errors.

## API Integration

This project uses the [OpenWeatherMap Current Weather Data API](https://openweathermap.org/current). 
Data fetching is managed inside a `useEffect` hook that triggers whenever the `city` state changes. It utilizes the native browser `fetch` API wrapped in an `async/await` pattern.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- An OpenWeatherMap API key (Free tier is sufficient).

### Setup

1. **Clone the repository and navigate to the project directory**:
   ```bash
   cd 4.weather-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your API Key**:
   - Open the `.env` file located in the root of `4.weather-dashboard`.
   - Replace the placeholder with your actual OpenWeatherMap API key:
     ```env
     REACT_APP_WEATHER_API_KEY=your_actual_api_key_here
     ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

