
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ForecastData } from "@/services/weatherService";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatTime } from "@/services/weatherService";
import { Thermometer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TemperatureChartProps {
  data: ForecastData;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  const isMobile = useIsMobile();
  
  if (!data || !data.list || data.list.length === 0) return null;

  // Get the next 24 hours forecast (8 data points, 3 hours apart)
  // For mobile, we'll limit to fewer data points
  const limit = isMobile ? 4 : 8; 
  const hourlyData = data.list.slice(0, limit).map(item => ({
    time: formatTime(item.dt),
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity
  }));

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg mt-4">
      <CardContent className="pt-4 md:pt-6">
        <div className="flex items-center mb-2 md:mb-4">
          <Thermometer className="mr-2" size={isMobile ? 16 : 20} />
          <h3 className="text-lg md:text-xl font-semibold">Temperature Trend {isMobile ? "12h" : "24h"}</h3>
        </div>
        
        <div className="h-48 md:h-64 w-full">
          <ChartContainer
            config={{
              temperature: {
                label: "Temperature",
                color: "#3b82f6" // blue-500
              },
              feelsLike: {
                label: "Feels Like",
                color: "#ef4444" // red-500
              }
            }}
          >
            <LineChart
              data={hourlyData}
              margin={{
                top: 5,
                right: isMobile ? 5 : 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{fontSize: isMobile ? 10 : 12}} />
              <YAxis unit="°C" tick={{fontSize: isMobile ? 10 : 12}} />
              <Tooltip contentStyle={{fontSize: isMobile ? '10px' : '12px'}} />
              <Legend wrapperStyle={{fontSize: isMobile ? '10px' : '12px'}} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-temperature)"
                activeDot={{ r: isMobile ? 6 : 8 }}
                name="Temperature"
                unit="°C"
                strokeWidth={isMobile ? 1.5 : 2}
              />
              <Line
                type="monotone"
                dataKey="feelsLike"
                stroke="var(--color-feelsLike)"
                name="Feels Like"
                unit="°C"
                strokeWidth={isMobile ? 1.5 : 2}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;
