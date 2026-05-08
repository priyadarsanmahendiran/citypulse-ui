"use client"

import type { CityData } from "@/lib/types"
import { getAQIColor } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Wind, Droplets, Activity, Zap } from "lucide-react"

interface MapViewProps {
  cities: CityData[]
  onCitySelect: (cityId: string) => void
  selectedCity: string | null
  selectedMetric: "aqi" | "temperature" | "energy" | "transport"
}

const metricLabelMap = {
  aqi: "AQI",
  temperature: "Temperature",
  energy: "Energy",
  transport: "Transport",
} as const

export function MapView({ cities, onCitySelect, selectedCity, selectedMetric }: MapViewProps) {
  const MAP_WIDTH = 100
  const MAP_HEIGHT = 60

  // Normalize coordinates to map canvas (simplified world map projection)
  const normalizeCoord = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * MAP_WIDTH
    const y = ((90 - lat) / 180) * MAP_HEIGHT
    return { x, y }
  }

  const selectedCityData = cities.find((city) => city.id === selectedCity) ?? cities[0]

  const getMarkerRadius = (city: CityData) => {
    const metricValue =
      selectedMetric === "aqi"
        ? city.aqi ?? 0
        : selectedMetric === "temperature"
          ? city.temperature ?? 0
          : selectedMetric === "energy"
            ? city.energyConsumption ?? 0
            : city.transportActivity ?? 0

    if (selectedMetric === "aqi") return 0.8 + metricValue / 80
    if (selectedMetric === "temperature") return 1 + metricValue / 35
    if (selectedMetric === "energy") return 0.8 + metricValue / 1400
    return 0.8 + metricValue / 500
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Urban network map</CardTitle>
        <CardDescription>
          Marker scale reflects {metricLabelMap[selectedMetric].toLowerCase()} so you can compare cities spatially.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_320px]">
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_40%),linear-gradient(180deg,#031525,#10263d_55%,#17344f)]">
            <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-auto" style={{ minHeight: "400px" }}>
              <defs>
                <pattern id="gridPattern" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(148, 163, 184, 0.13)" strokeWidth="0.2" />
                </pattern>
              </defs>
              <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#gridPattern)" />
              <path d="M10 22 C18 16, 25 16, 31 20 S42 24, 49 21 63 15, 73 20 84 29, 95 24" fill="none" stroke="rgba(125, 211, 252, 0.18)" strokeWidth="0.8" />
              <path d="M8 37 C16 35, 27 40, 35 38 S50 30, 60 33 78 41, 94 39" fill="none" stroke="rgba(125, 211, 252, 0.14)" strokeWidth="0.7" />

              {cities.map((city) => {
                const { x, y } = normalizeCoord(city.latitude, city.longitude)
                const isSelected = selectedCityData?.id === city.id
                const radius = getMarkerRadius(city)

                return (
                  <g key={city.name} onClick={() => onCitySelect(city.name)} className="cursor-pointer">
                    <circle cx={x} cy={y} r={radius + 1.4} fill="none" stroke={getAQIColor(city.aqi ?? -1)} strokeWidth="0.18" opacity="0.24" />
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill={getAQIColor(city.aqi ?? -1)}
                      stroke="white"
                      strokeWidth={isSelected ? "0.28" : "0.16"}
                      opacity={isSelected ? 1 : 0.88}
                    />
                    <text x={x + 1.8} y={y - 1.8} fontSize="2.1" fill="rgba(255,255,255,0.92)" className="select-none">
                      {city.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            {selectedCityData ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Focus city</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">{selectedCityData.name}</h3>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
                    <MapPin className="h-4 w-4" />
                    {selectedCityData.latitude.toFixed(2)}, {selectedCityData.longitude.toFixed(2)}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Activity className="h-4 w-4 text-amber-500" />
                      Air quality
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{selectedCityData.aqi ?? "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Droplets className="h-4 w-4 text-emerald-500" />
                        Humidity
                      </div>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCityData.humidity ?? "N/A"}%</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Wind className="h-4 w-4 text-sky-500" />
                        Wind
                      </div>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCityData.windSpeed ?? "N/A"} m/s</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Infrastructure load
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {selectedCityData.energyConsumption?.toLocaleString() ?? "N/A"} MWh
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Transport: {selectedCityData.transportActivity?.toLocaleString() ?? "N/A"}k vehicles
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
