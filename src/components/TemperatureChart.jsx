
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatTime } from "@/services/weatherService";
import { Thermometer } from "lucide-react";

const TemperatureChart = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) return null;

  // Get the next 24 hours forecast (8 data points, 3 hours apart)
  const hourlyData = data.list.slice(0, 8).map(item => ({
    time: formatTime(item.dt),
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity
  }));

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg mt-4">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Thermometer className="mr-2" size={20} />
          <h3 className="text-xl font-semibold">Temperature Trend (24h)</h3>
        </div>
        
        <div className="h-64 w-full">
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
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit="°C" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-temperature)"
                activeDot={{ r: 8 }}
                name="Temperature"
                unit="°C"
              />
              <Line
                type="monotone"
                dataKey="feelsLike"
                stroke="var(--color-feelsLike)"
                name="Feels Like"
                unit="°C"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;
