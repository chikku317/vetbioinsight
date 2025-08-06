import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, X } from "lucide-react";

interface ReportFiltersProps {
  onSearch: (searchTerm: string) => void;
  onDateFilter: (dateRange: { from?: string; to?: string }) => void;
  onClearFilters: () => void;
  searchTerm: string;
  dateRange: { from?: string; to?: string };
}

export function ReportFilters({ 
  onSearch, 
  onDateFilter, 
  onClearFilters, 
  searchTerm, 
  dateRange 
}: ReportFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [fromDate, setFromDate] = useState(dateRange.from || '');
  const [toDate, setToDate] = useState(dateRange.to || '');
  const [timeFilter, setTimeFilter] = useState<string>('');

  const handleSearch = () => {
    onSearch(localSearchTerm);
  };

  const handleDateFilter = () => {
    if (timeFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      onDateFilter({ from: today, to: today });
    } else if (timeFilter === 'week') {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      onDateFilter({ 
        from: weekAgo.toISOString().split('T')[0], 
        to: today.toISOString().split('T')[0] 
      });
    } else if (timeFilter === 'month') {
      const today = new Date();
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      onDateFilter({ 
        from: monthAgo.toISOString().split('T')[0], 
        to: today.toISOString().split('T')[0] 
      });
    } else if (fromDate || toDate) {
      onDateFilter({ from: fromDate, to: toDate });
    }
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    setFromDate('');
    setToDate('');
    setTimeFilter('');
    onClearFilters();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search by Patient Name */}
          <div className="space-y-2">
            <Label htmlFor="patient-search">Search by Patient Name</Label>
            <div className="flex gap-2">
              <Input
                id="patient-search"
                placeholder="Enter patient name..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Time Filters */}
          <div className="space-y-2">
            <Label htmlFor="time-filter">Quick Time Filter</Label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          <div className="space-y-2">
            <Label>Custom Date Range</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <Input
                type="date"
                placeholder="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <div className="flex gap-2">
              <Button onClick={handleDateFilter} size="sm" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button 
                onClick={handleClear} 
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || dateRange.from || dateRange.to) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Patient: "{searchTerm}"
                </span>
              )}
              {dateRange.from && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  From: {dateRange.from}
                </span>
              )}
              {dateRange.to && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  To: {dateRange.to}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}