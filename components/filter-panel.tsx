"use client"

import type { FilterState, CityData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  cities: CityData[]
}

export function FilterPanel({ filters, onFiltersChange, cities }: FilterPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select City</label>
          <select
            value={filters.selectedCity || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                selectedCity: e.target.value || null,
              })
            }
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Metric</label>
          <div className="grid grid-cols-2 gap-2">
            {(["aqi", "temperature", "energy", "transport"] as const).map((metric) => (
              <Button
                key={metric}
                variant={filters.selectedMetric === metric ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    selectedMetric: metric,
                  })
                }
                className="text-xs"
              >
                {metric === "aqi"
                  ? "Air Quality"
                  : metric === "temperature"
                    ? "Temperature"
                    : metric === "energy"
                      ? "Energy"
                      : "Transport"}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe</label>
          <div className="grid grid-cols-3 gap-2">
            {(["24h", "7d", "30d"] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={filters.timeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    timeframe,
                  })
                }
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
