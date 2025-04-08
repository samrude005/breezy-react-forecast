
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Search city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-white/90 backdrop-blur-sm"
      />
      <Button type="submit" disabled={isLoading || !searchTerm.trim()}>
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default SearchBar;
