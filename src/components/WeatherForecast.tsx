import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ForecastData, getDayFromTimestamp } from "@/services/weatherService";
import WeatherIcon from "./WeatherIcon";
import { Umbrella, Droplets, Wind } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeatherForecastProps {
  data: ForecastData;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  const isMobile = useIsMobile();
  
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
      
      // For mobile, limit to 3 days, otherwise keep 5 days
      if (isMobile && dailyForecasts.length >= 3) break;
      if (!isMobile && dailyForecasts.length >= 5) break;
    }
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg mt-4">
      <CardContent className="pt-4 md:pt-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
          {isMobile ? "3-Day" : "5-Day"} Forecast
        </h3>
        <div className={`grid grid-cols-${isMobile ? '3' : '5'} gap-1 md:gap-2`}>
          {dailyForecasts.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-1 md:p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-xs md:text-sm font-medium">{getDayFromTimestamp(item.dt)}</p>
              <WeatherIcon 
                weatherCode={item.weather[0].id} 
                size={isMobile ? 24 : 32} 
                className="my-1 md:my-2 text-primary" 
              />
              <p className="text-xs md:text-sm font-bold">{Math.round(item.main.temp)}°C</p>
              <p className="text-xs text-gray-500 mt-1 capitalize hidden md:block">{item.weather[0].description}</p>
              
              <div className="flex items-center mt-1 md:mt-2 text-xs text-gray-500">
                <Droplets size={isMobile ? 10 : 12} className="mr-1" />
                <span>{item.main.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
