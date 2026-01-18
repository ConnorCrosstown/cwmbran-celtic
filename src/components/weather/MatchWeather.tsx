'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  windSpeed: number;
  precipitation: number;
  humidity: number;
}

interface MatchWeatherProps {
  matchDate: number; // timestamp
  matchTime?: string; // HH:MM format
  compact?: boolean;
}

// Cwmbran, Wales coordinates
const CWMBRAN_LAT = 51.6538;
const CWMBRAN_LON = -3.0235;

// Weather code mapping to conditions and icons
const weatherCodes: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear', icon: 'sunny' },
  1: { condition: 'Mainly Clear', icon: 'partly-cloudy' },
  2: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
  3: { condition: 'Overcast', icon: 'cloudy' },
  45: { condition: 'Foggy', icon: 'foggy' },
  48: { condition: 'Foggy', icon: 'foggy' },
  51: { condition: 'Light Drizzle', icon: 'drizzle' },
  53: { condition: 'Drizzle', icon: 'drizzle' },
  55: { condition: 'Heavy Drizzle', icon: 'drizzle' },
  56: { condition: 'Freezing Drizzle', icon: 'drizzle' },
  57: { condition: 'Freezing Drizzle', icon: 'drizzle' },
  61: { condition: 'Light Rain', icon: 'rain' },
  63: { condition: 'Rain', icon: 'rain' },
  65: { condition: 'Heavy Rain', icon: 'rain' },
  66: { condition: 'Freezing Rain', icon: 'rain' },
  67: { condition: 'Freezing Rain', icon: 'rain' },
  71: { condition: 'Light Snow', icon: 'snow' },
  73: { condition: 'Snow', icon: 'snow' },
  75: { condition: 'Heavy Snow', icon: 'snow' },
  77: { condition: 'Snow Grains', icon: 'snow' },
  80: { condition: 'Light Showers', icon: 'showers' },
  81: { condition: 'Showers', icon: 'showers' },
  82: { condition: 'Heavy Showers', icon: 'showers' },
  85: { condition: 'Light Snow Showers', icon: 'snow' },
  86: { condition: 'Snow Showers', icon: 'snow' },
  95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
  96: { condition: 'Thunderstorm + Hail', icon: 'thunderstorm' },
  99: { condition: 'Thunderstorm + Hail', icon: 'thunderstorm' },
};

function WeatherIcon({ type, className = 'w-8 h-8' }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    sunny: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
    'partly-cloudy': (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="4" className="text-celtic-yellow" />
        <path d="M8 15a4 4 0 014-4h1a3 3 0 013 3v1a2 2 0 01-2 2H9a3 3 0 01-1-5.83" fill="currentColor" className="text-gray-300" />
      </svg>
    ),
    cloudy: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.5 19a4.5 4.5 0 01-.5-8.97A7 7 0 0119 12a4 4 0 01-1 7.93H6.5z" className="text-gray-300" />
      </svg>
    ),
    foggy: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
        <path d="M5 8h14M5 12h14M5 16h14" />
      </svg>
    ),
    drizzle: (
      <svg className={className} viewBox="0 0 24 24">
        <path d="M6.5 14a4.5 4.5 0 01-.5-8.97A7 7 0 0119 7a4 4 0 01-1 7.93H6.5z" fill="currentColor" className="text-gray-300" />
        <path d="M8 18v2M12 17v2M16 18v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-400" />
      </svg>
    ),
    rain: (
      <svg className={className} viewBox="0 0 24 24">
        <path d="M6.5 12a4.5 4.5 0 01-.5-8.97A7 7 0 0119 5a4 4 0 01-1 7.93H6.5z" fill="currentColor" className="text-gray-400" />
        <path d="M8 15v4M12 14v4M16 15v4M10 19v2M14 19v2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    showers: (
      <svg className={className} viewBox="0 0 24 24">
        <path d="M6.5 12a4.5 4.5 0 01-.5-8.97A7 7 0 0119 5a4 4 0 01-1 7.93H6.5z" fill="currentColor" className="text-gray-400" />
        <path d="M7 15l-1 3M11 15l-1 3M15 15l-1 3M9 19l-1 3M13 19l-1 3" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    snow: (
      <svg className={className} viewBox="0 0 24 24">
        <path d="M6.5 12a4.5 4.5 0 01-.5-8.97A7 7 0 0119 5a4 4 0 01-1 7.93H6.5z" fill="currentColor" className="text-gray-300" />
        <circle cx="8" cy="17" r="1" fill="currentColor" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
        <circle cx="16" cy="17" r="1" fill="currentColor" />
        <circle cx="10" cy="20" r="1" fill="currentColor" />
        <circle cx="14" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
    thunderstorm: (
      <svg className={className} viewBox="0 0 24 24">
        <path d="M6.5 10a4.5 4.5 0 01-.5-8.97A7 7 0 0119 3a4 4 0 01-1 7.93H6.5z" fill="currentColor" className="text-gray-500" />
        <path d="M13 12l-2 5h4l-2 5" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  };

  return icons[type] || icons.cloudy;
}

export default function MatchWeather({ matchDate, matchTime, compact = false }: MatchWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const matchDateObj = new Date(matchDate);
        const now = new Date();
        const daysUntilMatch = Math.ceil((matchDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Open-Meteo forecasts up to 16 days
        if (daysUntilMatch > 16) {
          setError('Forecast not yet available');
          setLoading(false);
          return;
        }

        // Format date for API
        const dateStr = matchDateObj.toISOString().split('T')[0];

        // Determine the hour for forecast (kick-off time or default to 15:00)
        let hour = 15;
        if (matchTime) {
          const [h] = matchTime.split(':').map(Number);
          hour = h;
        }

        // Fetch from Open-Meteo API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${CWMBRAN_LAT}&longitude=${CWMBRAN_LON}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&start_date=${dateStr}&end_date=${dateStr}&timezone=Europe%2FLondon`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather');
        }

        const data = await response.json();

        // Find the forecast for kick-off time
        const hourIndex = data.hourly.time.findIndex((t: string) => {
          const forecastHour = new Date(t).getHours();
          return forecastHour === hour;
        });

        if (hourIndex === -1) {
          throw new Error('Could not find forecast for match time');
        }

        const weatherCode = data.hourly.weather_code[hourIndex];
        const weatherInfo = weatherCodes[weatherCode] || { condition: 'Unknown', icon: 'cloudy' };

        setWeather({
          temperature: Math.round(data.hourly.temperature_2m[hourIndex]),
          condition: weatherInfo.condition,
          icon: weatherInfo.icon,
          windSpeed: Math.round(data.hourly.wind_speed_10m[hourIndex]),
          precipitation: data.hourly.precipitation_probability[hourIndex],
          humidity: data.hourly.relative_humidity_2m[hourIndex],
        });
      } catch {
        setError('Weather unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [matchDate, matchTime]);

  if (loading) {
    return compact ? (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <span>Loading weather...</span>
      </div>
    ) : (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-pulse">
        <div className="h-8 w-8 bg-white/20 rounded mb-2" />
        <div className="h-4 w-20 bg-white/20 rounded" />
      </div>
    );
  }

  if (error || !weather) {
    return compact ? (
      <div className="text-sm text-gray-400">{error || 'Weather unavailable'}</div>
    ) : null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <WeatherIcon type={weather.icon} className="w-5 h-5 text-celtic-yellow" />
        <span className="text-white font-medium">{weather.temperature}°C</span>
        <span className="text-gray-300">{weather.condition}</span>
        {weather.precipitation > 20 && (
          <span className="text-blue-300">{weather.precipitation}% rain</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Match Day Weather</p>
      <div className="flex items-center gap-3">
        <WeatherIcon type={weather.icon} className="w-10 h-10 text-celtic-yellow" />
        <div>
          <p className="text-2xl font-bold text-white">{weather.temperature}°C</p>
          <p className="text-sm text-gray-300">{weather.condition}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-gray-400">Wind</p>
          <p className="text-sm text-white font-medium">{weather.windSpeed} km/h</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Rain</p>
          <p className="text-sm text-white font-medium">{weather.precipitation}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Humidity</p>
          <p className="text-sm text-white font-medium">{weather.humidity}%</p>
        </div>
      </div>
    </div>
  );
}
