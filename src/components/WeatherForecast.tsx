
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
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-4">
          {dailyForecasts.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-2 rounded-lg bg-white/50 shadow-sm hover:bg-gray-100 transition-colors">
              <p className="text-sm md:text-base font-medium">{getDayFromTimestamp(item.dt)}</p>
              <div className="my-2 md:my-3">
                <WeatherIcon 
                  weatherCode={item.weather[0].id} 
                  size={isMobile ? 28 : 36} 
                  className="text-primary" 
                />
              </div>
              <p className="text-sm md:text-lg font-bold">{Math.round(item.main.temp)}°C</p>
              <p className="text-xs md:text-sm mt-1 text-gray-700 capitalize truncate max-w-full text-center">
                {item.weather[0].description}
              </p>
              
              <div className="flex justify-between w-full mt-2 text-xs md:text-sm text-gray-600">
                <div className="flex items-center">
                  <Droplets size={isMobile ? 12 : 14} className="mr-1" />
                  <span>{item.main.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind size={isMobile ? 12 : 14} className="mr-1" />
                  <span>{item.wind?.speed || 0} m/s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
