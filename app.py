import os
import logging
import requests
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the database model base class
class Base(DeclarativeBase):
    pass

# Create the SQLAlchemy database instance
db = SQLAlchemy(model_class=Base)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET") or "a secret key"

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)

# Define the model within app.py to avoid circular imports
class WeatherSearch(db.Model):
    """Model for storing weather search history."""
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), nullable=False)
    country_code = db.Column(db.String(2), nullable=True)
    temperature = db.Column(db.Float, nullable=True)
    weather_condition = db.Column(db.String(100), nullable=True)
    search_time = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<WeatherSearch {self.city}, {self.search_time}>'

# Create all tables
with app.app_context():
    db.create_all()

# OpenWeatherMap API key and base URL
OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY", "")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

@app.route('/weather-app')
def weather_app():
    """Render the main page of the weather app."""
    # Get the 5 most recent searches
    recent_searches = []
    with app.app_context():
        recent_searches = WeatherSearch.query.order_by(WeatherSearch.search_time.desc()).limit(5).all()
    return render_template('index.html', recent_searches=recent_searches)

@app.route('/')
def color_splash():
    """Render the Color Splash landing page."""
    return render_template('color_splash.html')

@app.route('/weather')
def get_weather():
    """
    Proxy endpoint to fetch weather data from OpenWeatherMap API.
    This keeps the API key secure on the server side.
    """
    city = request.args.get('city')
    
    if not city:
        return jsonify({"error": "City name is required"}), 400
    
    if not OPENWEATHER_API_KEY:
        return jsonify({"error": "Weather API key is not configured"}), 500

    try:
        # Make request to OpenWeatherMap API
        params = {
            'q': city,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'  # Use metric units (Celsius)
        }
        
        response = requests.get(OPENWEATHER_BASE_URL, params=params)
        
        # Check if the request was successful
        if response.status_code == 200:
            weather_data = response.json()
            
            # Save search to database
            with app.app_context():
                search = WeatherSearch()
                search.city = weather_data.get('name', city)
                search.country_code = weather_data.get('sys', {}).get('country')
                search.temperature = weather_data.get('main', {}).get('temp')
                search.weather_condition = weather_data.get('weather', [{}])[0].get('main')
                db.session.add(search)
                db.session.commit()
                
            return jsonify(weather_data)
        elif response.status_code == 404:
            return jsonify({"error": f"City '{city}' not found"}), 404
        else:
            return jsonify({"error": f"Weather service error: {response.status_code}"}), response.status_code
            
    except Exception as e:
        logging.error(f"Error fetching weather data: {str(e)}")
        return jsonify({"error": "Failed to fetch weather data"}), 500

@app.route('/history')
def get_history():
    """Return the search history as JSON."""
    with app.app_context():
        history = WeatherSearch.query.order_by(WeatherSearch.search_time.desc()).limit(10).all()
        history_data = [{
            'city': search.city,
            'country_code': search.country_code,
            'temperature': search.temperature,
            'weather_condition': search.weather_condition,
            'search_time': search.search_time.strftime('%Y-%m-%d %H:%M:%S')
        } for search in history]
        return jsonify(history_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
