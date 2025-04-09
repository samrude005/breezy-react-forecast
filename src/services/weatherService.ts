// OpenWeatherMap API configuration
const API_KEY = "4d8fb5b93d4af21d66a2948710284366"; // Free API key for demo purposes
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  visibility?: number;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

export interface PollutionData {
  list: {
    dt: number;
    main: {
      aqi: number; // 1-5 scale (1: Good, 2: Fair, 3: Moderate, 4: Poor, 5: Very Poor)
    };
    components: {
      co: number;    // Carbon monoxide (μg/m3)
      no: number;    // Nitrogen monoxide (μg/m3)
      no2: number;   // Nitrogen dioxide (μg/m3)
      o3: number;    // Ozone (μg/m3)
      so2: number;   // Sulphur dioxide (μg/m3)
      pm2_5: number; // Fine particles (μg/m3)
      pm10: number;  // Coarse particles (μg/m3)
      nh3: number;   // Ammonia (μg/m3)
    };
  }[];
}

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Weather data not found");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Forecast data not found");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};

export const getAirPollutionByCoords = async (lat: number, lon: number): Promise<PollutionData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Air pollution data not found");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching air pollution data:", error);
    throw error;
  }
};

// Helper function to get weather condition based on weather code
export const getWeatherCondition = (code: number): "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" => {
  if (code >= 200 && code < 300) return "stormy";  // Thunderstorm
  if (code >= 300 && code < 600) return "rainy";   // Drizzle and Rain
  if (code >= 600 && code < 700) return "snowy";   // Snow
  if (code >= 700 && code < 800) return "cloudy";  // Atmosphere (fog, etc)
  if (code === 800) return "sunny";                // Clear sky
  return "cloudy";                                 // Clouds
};

// Helper function to convert temperature
export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

// Helper function to format date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to format time
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get day from timestamp
export const getDayFromTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    weekday: 'short'
  });
};

// Helper function to get air quality text based on AQI value
export const getAirQualityText = (aqi: number): string => {
  switch(aqi) {
    case 1: return "Good";
    case 2: return "Fair";
    case 3: return "Moderate";
    case 4: return "Poor";
    case 5: return "Very Poor";
    default: return "Unknown";
  }
};

// Helper function to get air quality color based on AQI value
export const getAirQualityColor = (aqi: number): string => {
  switch(aqi) {
    case 1: return "text-green-500";
    case 2: return "text-green-300";
    case 3: return "text-yellow-500";
    case 4: return "text-orange-500";
    case 5: return "text-red-500";
    default: return "text-gray-500";
  }
};
