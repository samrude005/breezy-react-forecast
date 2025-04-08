
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ForecastData, getDayFromTimestamp } from "@/services/weatherService";
import WeatherIcon from "./WeatherIcon";

interface WeatherForecastProps {
  data: ForecastData;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) return null;

  // Process forecast data to get one entry per day
  const dailyForecasts = [];
  const processedDates = new Set();
  
  // Skip today (start from tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Filter for unique days, prioritizing mid-day forecasts when available
  for (const item of data.list) {
    const forecastDate = new Date(item.dt * 1000);
    const dateString = forecastDate.toDateString();
    
    // Skip forecasts for today
    if (forecastDate < tomorrow) continue;
    
    // For each new day we find, add the forecast closest to noon
    if (!processedDates.has(dateString)) {
      processedDates.add(dateString);
      
      // Look for forecast closest to noon for this day
      const dayForecasts = data.list.filter(f => 
        new Date(f.dt * 1000).toDateString() === dateString
      );
      
      // Find entry closest to noon (12:00)
      let bestForecast = dayForecasts[0];
      let closestToDiff = Number.MAX_VALUE;
      
      for (const forecast of dayForecasts) {
        const forecastHour = new Date(forecast.dt * 1000).getHours();
        const diffFromNoon = Math.abs(forecastHour - 12);
        
        if (diffFromNoon < closestToDiff) {
          closestToDiff = diffFromNoon;
          bestForecast = forecast;
        }
      }
      
      dailyForecasts.push(bestForecast);
      
      // Stop once we have 5 days
      if (dailyForecasts.length >= 5) break;
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg mt-4">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
        <div className="flex justify-between">
          {dailyForecasts.map((item, index) => (
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
