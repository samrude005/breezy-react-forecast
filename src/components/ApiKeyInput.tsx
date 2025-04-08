
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Key } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          <span>Weather API Key Required</span>
        </CardTitle>
        <CardDescription>
          Enter your OpenWeatherMap API key to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="text-xs text-gray-500">
            <p>Don't have an API key?</p>
            <ol className="list-decimal pl-4 mt-1 space-y-1">
              <li>Sign up at <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenWeatherMap</a></li>
              <li>Get a free API key</li>
              <li>Enter it here to use the app</li>
            </ol>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!apiKey.trim()}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
