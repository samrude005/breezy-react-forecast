
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherForecast from "@/components/WeatherForecast";
import TemperatureChart from "@/components/TemperatureChart";
import AirPollution from "@/components/AirPollution";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  getWeatherByCity, 
  getForecastByCity,
  getAirPollutionByCoords,
  getWeatherCondition,
  WeatherData,
  ForecastData,
  PollutionData
} from "@/services/weatherService";
import { Cloud, CloudRain, CloudLightning, Snowflake, Sun } from "lucide-react";

const DEFAULT_CITY = "Nashik";

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [pollutionData, setPollutionData] = useState<PollutionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherCondition, setWeatherCondition] = useState<string>("sunny");

  useEffect(() => {
    fetchWeatherData(DEFAULT_CITY);
  }, []);

  const fetchWeatherData = async (searchCity: string) => {
    setLoading(true);
    try {
      // Fetch current weather data
      const weather = await getWeatherByCity(searchCity);
      setWeatherData(weather);
      setCity(weather.name);

      // Set weather condition for background
      const condition = getWeatherCondition(weather.weather[0].id);
      setWeatherCondition(condition);

      // Fetch forecast data
      const forecast = await getForecastByCity(searchCity);
      setForecastData(forecast);

      // Fetch air pollution data (needs lat/lon from weather data)
      const pollution = await getAirPollutionByCoords(
        weather.coord.lat,
        weather.coord.lon
      );
      setPollutionData(pollution);
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
        return <Sun className="absolute top-5 right-5 md:top-10 md:right-10 text-yellow-300 opacity-20" size={isMobile ? 60 : 100} />;
      case "cloudy":
        return <Cloud className="absolute top-5 right-5 md:top-10 md:right-10 text-gray-300 opacity-20" size={isMobile ? 60 : 100} />;
      case "rainy":
        return <CloudRain className="absolute top-5 right-5 md:top-10 md:right-10 text-blue-300 opacity-20" size={isMobile ? 60 : 100} />;
      case "stormy":
        return <CloudLightning className="absolute top-5 right-5 md:top-10 md:right-10 text-gray-300 opacity-20" size={isMobile ? 60 : 100} />;
      case "snowy":
        return <Snowflake className="absolute top-5 right-5 md:top-10 md:right-10 text-white opacity-20" size={isMobile ? 60 : 100} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-4 md:py-8 px-2 md:px-4 transition-all duration-500 ${getBackgroundClass()}`}>
      <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
        {getWeatherIcon()}
        
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-4 md:mb-8 drop-shadow-md">
          Weather App
        </h1>
        
        <SearchBar onSearch={handleSearch} isLoading={loading} />
        
        <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
          {loading ? (
            <WeatherSkeleton />
          ) : (
            weatherData && (
              <>
                <CurrentWeather data={weatherData} />
                {forecastData && <TemperatureChart data={forecastData} />}
                {pollutionData && <AirPollution data={pollutionData} />}
                {forecastData && <WeatherForecast data={forecastData} />}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
