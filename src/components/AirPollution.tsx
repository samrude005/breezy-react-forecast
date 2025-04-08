
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PollutionData, getAirQualityText, getAirQualityColor } from "@/services/weatherService";
import { Wind, Info } from "lucide-react";

interface AirPollutionProps {
  data: PollutionData | null;
}

const AirPollution: React.FC<AirPollutionProps> = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) return null;

  const pollution = data.list[0];
  const { aqi } = pollution.main;
  const { co, no2, o3, pm2_5, pm10, so2 } = pollution.components;

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg mt-4">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Wind className="mr-2" size={20} />
          <h3 className="text-xl font-semibold">Air Quality</h3>
        </div>
        
        <div className="flex items-center mb-4">
          <div className={`text-2xl font-bold ${getAirQualityColor(aqi)}`}>
            {getAirQualityText(aqi)}
          </div>
          <div className="text-sm ml-4 text-gray-500">
            <Info size={16} className="inline mr-1" />
            Air Quality Index: {aqi}/5
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">PM2.5</div>
            <div className="font-semibold">{pm2_5.toFixed(1)} μg/m³</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">PM10</div>
            <div className="font-semibold">{pm10.toFixed(1)} μg/m³</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">Ozone (O₃)</div>
            <div className="font-semibold">{o3.toFixed(1)} μg/m³</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">Nitrogen (NO₂)</div>
            <div className="font-semibold">{no2.toFixed(1)} μg/m³</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">Sulphur (SO₂)</div>
            <div className="font-semibold">{so2.toFixed(1)} μg/m³</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">Carbon Monoxide (CO)</div>
            <div className="font-semibold">{co.toFixed(1)} μg/m³</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirPollution;
