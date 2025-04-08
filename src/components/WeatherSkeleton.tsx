
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WeatherSkeleton: React.FC = () => {
  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-4">
          <Skeleton className="h-8 w-48 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex justify-center items-center mb-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
          <Skeleton className="h-14 w-20 mx-6" />
          <div className="flex flex-col">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-4 w-30" />
          </div>
        </div>

        <div className="flex justify-between border-t pt-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherSkeleton;
