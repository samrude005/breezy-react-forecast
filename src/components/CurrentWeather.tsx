
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherData } from "@/services/weatherService";
import WeatherIcon from "./WeatherIcon";
import { formatDate, formatTime } from "@/services/weatherService";
import { Droplets, Wind, Thermometer, Eye, Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const isMobile = useIsMobile();
  
  if (!data) return null;

  // Wind direction as compass point
  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg">
      <CardContent className="pt-4 md:pt-6">
        <div className="flex flex-col items-center mb-3 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-1">{data.name}, {data.sys.country}</h2>
          <p className="text-xs md:text-sm text-gray-500">{formatDate(data.dt)}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mb-4 md:mb-6">
          <div className="flex flex-row md:flex-col items-center mb-2 md:mb-0">
            <WeatherIcon 
              weatherCode={data.weather[0].id} 
              size={isMobile ? 48 : 64} 
              className="text-primary animate-float" 
            />
            <p className="ml-2 md:ml-0 md:mt-2 text-base md:text-lg capitalize">{data.weather[0].description}</p>
          </div>
          <div className="text-4xl md:text-5xl font-bold mx-4 md:mx-6">{Math.round(data.main.temp)}°C</div>
          <div className="flex flex-col text-xs md:text-sm">
            <div className="flex items-center mb-1">
              <Thermometer size={16} className="mr-2 text-orange-500" />
              <span>Feels like: {Math.round(data.main.feels_like)}°C</span>
            </div>
            <div className="flex items-center mb-1">
              <Wind size={16} className="mr-2 text-blue-500" />
              <span>Wind: {data.wind.speed} m/s {getWindDirection(data.wind.deg)}</span>
            </div>
            <div className="flex items-center">
              <Droplets size={16} className="mr-2 text-blue-400" />
              <span>Humidity: {data.main.humidity}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
          <div className="flex items-center">
            <Gauge size={16} className="mr-1 md:mr-2 text-gray-500" />
            <div>
              <div className="text-xs md:text-sm text-gray-500">Pressure</div>
              <div className="text-sm md:font-medium">{data.main.pressure} hPa</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Eye size={16} className="mr-1 md:mr-2 text-gray-500" />
            <div>
              <div className="text-xs md:text-sm text-gray-500">Visibility</div>
              <div className="text-sm md:font-medium">{data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A'}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Sunrise size={16} className="mr-1 md:mr-2 text-yellow-500" />
            <div>
              <div className="text-xs md:text-sm text-gray-500">Sunrise</div>
              <div className="text-sm md:font-medium">{formatTime(data.sys.sunrise)}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Sunset size={16} className="mr-1 md:mr-2 text-orange-500" />
            <div>
              <div className="text-xs md:text-sm text-gray-500">Sunset</div>
              <div className="text-sm md:font-medium">{formatTime(data.sys.sunset)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs md:text-sm text-gray-500 border-t pt-2 md:pt-4">
          <div>
            <p>Min: {Math.round(data.main.temp_min)}°C</p>
          </div>
          <div>
            <p>Max: {Math.round(data.main.temp_max)}°C</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
