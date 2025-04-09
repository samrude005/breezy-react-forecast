
import React from "react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake,
  CloudSun,
  CloudFog
} from "lucide-react";

const WeatherIcon = ({ weatherCode, size = 24, className = "" }) => {
  const getIconByWeatherCode = (code) => {
    if (code >= 200 && code < 300) {
      return <CloudLightning size={size} className={className} />;  // Thunderstorm
    }
    if (code >= 300 && code < 500) {
      return <CloudRain size={size} className={`${className} opacity-70`} />;  // Drizzle
    }
    if (code >= 500 && code < 600) {
      return <CloudRain size={size} className={className} />;  // Rain
    }
    if (code >= 600 && code < 700) {
      return <Snowflake size={size} className={className} />;  // Snow
    }
    if (code >= 700 && code < 800) {
      return <CloudFog size={size} className={className} />;  // Atmosphere (fog, etc)
    }
    if (code === 800) {
      return <Sun size={size} className={className} />;  // Clear sky
    }
    if (code > 800 && code < 803) {
      return <CloudSun size={size} className={className} />;  // Few clouds
    }
    return <Cloud size={size} className={className} />;  // Clouds
  };

  return getIconByWeatherCode(weatherCode);
};

export default WeatherIcon;
