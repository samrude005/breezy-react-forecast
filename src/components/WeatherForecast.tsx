
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ForecastData, getDayFromTimestamp } from "@/services/weatherService";
import WeatherIcon from "./WeatherIcon";

interface WeatherForecastProps {
  data: ForecastData;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) return null;

  // Get one forecast per day (noon time)
  const dailyForecast = data.list.filter((item, index) => {
    const date = new Date(item.dt * 1000);
    return date.getHours() === 12;
  }).slice(0, 5); // Get 5 days forecast

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg mt-4">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div className="flex justify-between">
          {dailyForecast.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <p className="font-medium">{getDayFromTimestamp(item.dt)}</p>
              <WeatherIcon 
                weatherCode={item.weather[0].id} 
                size={32} 
                className="my-2 text-primary" 
              />
              <p className="text-sm">{Math.round(item.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
