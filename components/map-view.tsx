"use client"

import type { CityData } from "@/lib/types"
import { getAQIColor } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MapViewProps {
  cities: CityData[]
  onCitySelect: (cityId: string) => void
  selectedCity: string | null
}

export function MapView({ cities, onCitySelect, selectedCity }: MapViewProps) {
  const MAP_WIDTH = 100
  const MAP_HEIGHT = 60

  // Normalize coordinates to map canvas (simplified world map projection)
  const normalizeCoord = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * MAP_WIDTH
    const y = ((90 - lat) / 180) * MAP_HEIGHT
    return { x, y }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>City Locations & Air Quality</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-border overflow-auto">
          <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-auto" style={{ minHeight: "400px" }}>
            {/* Grid */}
            {Array.from({ length: 5 }).map((_, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1="0"
                  y1={(i * MAP_HEIGHT) / 4}
                  x2={MAP_WIDTH}
                  y2={(i * MAP_HEIGHT) / 4}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.1"
                />
                <line
                  x1={(i * MAP_WIDTH) / 4}
                  y1="0"
                  x2={(i * MAP_WIDTH) / 4}
                  y2={MAP_HEIGHT}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.1"
                />
              </g>
            ))}

            {/* City pins */}
            {cities.map((city) => {
              const { x, y } = normalizeCoord(city.latitude, city.longitude)
              const isSelected = selectedCity === city.name

              return (
                <g key={city.name} onClick={() => onCitySelect(city.name)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 1.5 : 1.2}
                    fill={getAQIColor(city.aqi ?? -1)}
                    stroke="white"
                    strokeWidth="0.15"
                    opacity={isSelected ? 1 : 0.8}
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                  />
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={2.5}
                      fill="none"
                      stroke={getAQIColor(city.aqi ?? -1)}
                      strokeWidth="0.1"
                      opacity="0.5"
                    />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => onCitySelect(city.name)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedCity === city.name ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getAQIColor(city.aqi ?? -1) }} />
                <p className="font-semibold text-sm">{city.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">AQI: {city.aqi}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
