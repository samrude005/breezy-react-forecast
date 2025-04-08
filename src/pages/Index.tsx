
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherForecast from "@/components/WeatherForecast";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import ApiKeyInput from "@/components/ApiKeyInput";
import { 
  getWeatherByCity, 
  getForecastByCity, 
  getWeatherCondition,
  WeatherData,
  ForecastData
} from "@/services/weatherService";
import { Cloud, CloudRain, CloudLightning, Snowflake, Sun } from "lucide-react";

const DEFAULT_CITY = "London";

const Index = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem("weatherApiKey"));
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherCondition, setWeatherCondition] = useState<string>("sunny");

  useEffect(() => {
    if (apiKey) {
      fetchWeatherData(DEFAULT_CITY);
    }
  }, [apiKey]);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem("weatherApiKey", key);
    setApiKey(key);
    fetchWeatherData(DEFAULT_CITY);
  };

  const fetchWeatherData = async (searchCity: string) => {
    if (!apiKey) return;

    setLoading(true);
    try {
      // Update the API key in the code
      const weatherServiceModule = await import("@/services/weatherService");
      const originalGetWeatherByCity = weatherServiceModule.getWeatherByCity;
      const originalGetForecastByCity = weatherServiceModule.getForecastByCity;

      // Override the functions to use the user's API key
      weatherServiceModule.getWeatherByCity = async (city: string) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error("Weather data not found");
        }
        
        return await response.json();
      };

      weatherServiceModule.getForecastByCity = async (city: string) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error("Forecast data not found");
        }
        
        return await response.json();
      };

      // Fetch data with the updated functions
      const weather = await weatherServiceModule.getWeatherByCity(searchCity);
      setWeatherData(weather);
      setCity(weather.name);

      // Set weather condition for background
      const condition = getWeatherCondition(weather.weather[0].id);
      setWeatherCondition(condition);

      // Fetch forecast data
      const forecast = await weatherServiceModule.getForecastByCity(searchCity);
      setForecastData(forecast);

      // Restore original functions
      weatherServiceModule.getWeatherByCity = originalGetWeatherByCity;
      weatherServiceModule.getForecastByCity = originalGetForecastByCity;
    } catch (error) {
      toast({
        title: "Error",
        description: `Could not find weather for "${searchCity}". Please try another city.`,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchCity: string) => {
    fetchWeatherData(searchCity);
  };

  const getBackgroundClass = () => {
    return `weather-bg-${weatherCondition}`;
  };

  const getWeatherIcon = () => {
    switch (weatherCondition) {
      case "sunny":
        return <Sun className="absolute top-10 right-10 text-yellow-300 opacity-20" size={100} />;
      case "cloudy":
        return <Cloud className="absolute top-10 right-10 text-gray-300 opacity-20" size={100} />;
      case "rainy":
        return <CloudRain className="absolute top-10 right-10 text-blue-300 opacity-20" size={100} />;
      case "stormy":
        return <CloudLightning className="absolute top-10 right-10 text-gray-300 opacity-20" size={100} />;
      case "snowy":
        return <Snowflake className="absolute top-10 right-10 text-white opacity-20" size={100} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 ${getBackgroundClass()}`}>
      <div className="relative w-full max-w-md">
        {getWeatherIcon()}
        
        <h1 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-md">
          Weather App
        </h1>
        
        {!apiKey ? (
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
        ) : (
          <>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
            
            <div className="mt-6">
              {loading ? (
                <WeatherSkeleton />
              ) : (
                weatherData && (
                  <>
                    <CurrentWeather data={weatherData} />
                    {forecastData && <WeatherForecast data={forecastData} />}
                  </>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
