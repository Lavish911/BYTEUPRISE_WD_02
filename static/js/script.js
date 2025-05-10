// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorContainer = document.getElementById('errorContainer');
const weatherContainer = document.getElementById('weatherContainer');
const recentSearchesContainer = document.getElementById('recentSearches');

// Weather Data Elements
const cityNameElement = document.getElementById('cityName');
const dateTimeElement = document.getElementById('dateTime');
const temperatureElement = document.getElementById('temperature');
const feelsLikeElement = document.getElementById('feelsLike');
const minMaxTempElement = document.getElementById('minMaxTemp');
const weatherIconElement = document.getElementById('weatherIcon');
const weatherDescriptionElement = document.getElementById('weatherDescription');
const windSpeedElement = document.getElementById('windSpeed');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const visibilityElement = document.getElementById('visibility');
const sunriseElement = document.getElementById('sunrise');
const sunsetElement = document.getElementById('sunset');
const coordinatesElement = document.getElementById('coordinates');

// Event Listeners
searchButton.addEventListener('click', () => getWeather());
cityInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    getWeather();
  }
});

// Initialize the app
function init() {
  cityInput.focus();
  // Refresh recent searches every 30 seconds
  setInterval(refreshRecentSearches, 30000);
}

// Function to search for a city (can be called from recent searches)
function searchCity(cityName) {
  cityInput.value = cityName;
  getWeather();
}

// Get weather data for the entered city
async function getWeather() {
  const city = cityInput.value.trim();
  
  if (!city) {
    showError('Please enter a city name');
    return;
  }
  
  // Show loading indicator
  showLoading(true);
  hideError();
  hideWeatherContainer();
  
  try {
    const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch weather data');
    }
    
    // Display weather data
    displayWeatherData(data);
    
    // Refresh recent searches
    refreshRecentSearches();
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

// Display weather data in the UI
function displayWeatherData(data) {
  // Set city name and date
  cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
  dateTimeElement.textContent = formatDateTime(new Date());
  
  // Set temperature data
  temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
  feelsLikeElement.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
  minMaxTempElement.textContent = `Min: ${Math.round(data.main.temp_min)}°C / Max: ${Math.round(data.main.temp_max)}°C`;
  
  // Set weather description and icon
  const weatherCondition = data.weather[0];
  weatherDescriptionElement.textContent = capitalizeFirstLetter(weatherCondition.description);
  setWeatherIcon(weatherCondition.icon);
  
  // Set additional weather data
  windSpeedElement.textContent = `${data.wind.speed} m/s`;
  humidityElement.textContent = `${data.main.humidity}%`;
  pressureElement.textContent = `${data.main.pressure} hPa`;
  visibilityElement.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  
  // Set sunrise and sunset times
  sunriseElement.textContent = formatTime(data.sys.sunrise, data.timezone);
  sunsetElement.textContent = formatTime(data.sys.sunset, data.timezone);
  
  // Set coordinates
  coordinatesElement.textContent = `Lat: ${data.coord.lat.toFixed(2)}, Lon: ${data.coord.lon.toFixed(2)}`;
  
  // Show weather container
  showWeatherContainer();
}

// Refresh recent searches from the server
async function refreshRecentSearches() {
  try {
    const response = await fetch('/history');
    if (!response.ok) return;
    
    const historyData = await response.json();
    
    // If we're using server-side rendering for the recent searches,
    // we don't need to update this client-side
    // This function is left here for future enhancements
  } catch (error) {
    console.error('Failed to refresh recent searches:', error);
  }
}

// Set weather icon based on OpenWeatherMap icon code
function setWeatherIcon(iconCode) {
  // Map OpenWeatherMap icon codes to Font Awesome icons
  const iconMap = {
    '01d': 'fa-sun',              // clear sky day
    '01n': 'fa-moon',             // clear sky night
    '02d': 'fa-cloud-sun',        // few clouds day
    '02n': 'fa-cloud-moon',       // few clouds night
    '03d': 'fa-cloud',            // scattered clouds day
    '03n': 'fa-cloud',            // scattered clouds night
    '04d': 'fa-cloud',            // broken clouds day
    '04n': 'fa-cloud',            // broken clouds night
    '09d': 'fa-cloud-showers-heavy', // shower rain day
    '09n': 'fa-cloud-showers-heavy', // shower rain night
    '10d': 'fa-cloud-sun-rain',   // rain day
    '10n': 'fa-cloud-moon-rain',  // rain night
    '11d': 'fa-bolt',             // thunderstorm day
    '11n': 'fa-bolt',             // thunderstorm night
    '13d': 'fa-snowflake',        // snow day
    '13n': 'fa-snowflake',        // snow night
    '50d': 'fa-smog',             // mist day
    '50n': 'fa-smog'              // mist night
  };
  
  // Get the appropriate Font Awesome class
  const iconClass = iconMap[iconCode] || 'fa-question';
  
  // Clear previous classes
  weatherIconElement.className = '';
  // Add new classes
  weatherIconElement.classList.add('fas', iconClass, 'fa-4x', 'mb-2');
}

// Helper function to format date and time
function formatDateTime(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString(undefined, options);
}

// Helper function to format time with timezone
function formatTime(timestamp, timezone) {
  // Convert Unix timestamp to milliseconds and adjust for timezone
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().split(' ')[4].substring(0, 5);
}

// Helper function to capitalize first letter of each word
function capitalizeFirstLetter(string) {
  return string.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// Show/hide loading indicator
function showLoading(isLoading) {
  loadingIndicator.classList.toggle('d-none', !isLoading);
}

// Show error message
function showError(message) {
  errorContainer.textContent = message;
  errorContainer.classList.remove('d-none');
}

// Hide error message
function hideError() {
  errorContainer.classList.add('d-none');
}

// Show weather container
function showWeatherContainer() {
  weatherContainer.classList.remove('d-none');
}

// Hide weather container
function hideWeatherContainer() {
  weatherContainer.classList.add('d-none');
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
