# Color Splash Web Application

A beautiful web application featuring a vibrant landing page with 3D gradients and rainbow colors along with a functional weather application.

## Features

### Landing Page
- Animated rainbow gradient backgrounds
- 3D perspective text and interactive elements
- Feature boxes with 3D transformations and gradient backgrounds
- Portfolio section with hover effects
- Mobile responsive design
- SVG graphics and icons
- Parallax scrolling effects
- Reveal animations on scroll

### Weather App
- Real-time weather data using OpenWeatherMap API
- Search for weather conditions in any city
- Display of current temperature, feels like, min/max temps
- Additional weather data including wind speed, humidity, pressure
- Recent search history

## Technologies Used

- HTML5
- CSS3 (with advanced animations and 3D effects)
- JavaScript (vanilla JS for interactive elements)
- Flask (Python web framework)
- SQLAlchemy for database management
- OpenWeatherMap API for weather data

## Setup and Installation

1. Clone this repository:
```
git clone https://github.com/yourusername/color-splash.git
cd color-splash
```

2. Set up a virtual environment (optional but recommended):
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the required dependencies:
```
pip install -r requirements.txt
```

4. Environment variables:
Create a `.env` file with the following:
```
OPENWEATHER_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
SESSION_SECRET=your_secret_key
```

5. Run the application:
```
python main.py
```

The application will be available at `http://localhost:5000`.

## Project Structure

- `app.py` - Main application logic and routes
- `main.py` - Application entry point
- `static/` - Static assets (CSS, JavaScript, images)
- `templates/` - HTML templates
- `README.md` - Project documentation

## API Usage

This project uses the OpenWeatherMap API to fetch weather data. You'll need to sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api).

## License

MIT License

## Credits

Created by Color Splash Team
