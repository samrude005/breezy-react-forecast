
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherData } from "@/services/weatherService";
import WeatherIcon from "./WeatherIcon";
import { formatDate, formatTime } from "@/services/weatherService";
import { Droplets, Wind, Thermometer } from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  if (!data) return null;

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl font-bold mb-1">{data.name}, {data.sys.country}</h2>
          <p className="text-sm text-gray-500">{formatDate(data.dt)}</p>
        </div>

        <div className="flex justify-center items-center mb-6">
          <div className="flex flex-col items-center">
            <WeatherIcon 
              weatherCode={data.weather[0].id} 
              size={64} 
              className="text-primary animate-float" 
            />
            <p className="mt-2 text-lg capitalize">{data.weather[0].description}</p>
          </div>
          <div className="text-5xl font-bold mx-6">{Math.round(data.main.temp)}°C</div>
          <div className="flex flex-col text-sm">
            <div className="flex items-center mb-1">
              <Thermometer size={16} className="mr-2 text-orange-500" />
              <span>Feels like: {Math.round(data.main.feels_like)}°C</span>
            </div>
            <div className="flex items-center mb-1">
              <Wind size={16} className="mr-2 text-blue-500" />
              <span>Wind: {data.wind.speed} m/s</span>
            </div>
            <div className="flex items-center">
              <Droplets size={16} className="mr-2 text-blue-400" />
              <span>Humidity: {data.main.humidity}%</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
          <div>
            <p>Min: {Math.round(data.main.temp_min)}°C</p>
          </div>
          <div>
            <p>Max: {Math.round(data.main.temp_max)}°C</p>
          </div>
          <div>
            <p>Sunrise: {formatTime(data.sys.sunrise)}</p>
          </div>
          <div>
            <p>Sunset: {formatTime(data.sys.sunset)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
