import type { CityData, FilterState, TimeSeriesData } from "./types"

type CitySeed = {
  name: string
  latitude: number
  longitude: number
  temperature: number
  aqi: number
  humidity: number
  windSpeed: number
  energyConsumption: number
  transportActivity: number
}

const CITY_SEEDS: CitySeed[] = [
  { name: "Stockholm", latitude: 59.3293, longitude: 18.0686, temperature: 8, aqi: 42, humidity: 68, windSpeed: 4.9, energyConsumption: 1280, transportActivity: 420 },
  { name: "Copenhagen", latitude: 55.6761, longitude: 12.5683, temperature: 9, aqi: 51, humidity: 71, windSpeed: 5.4, energyConsumption: 1160, transportActivity: 390 },
  { name: "Amsterdam", latitude: 52.3676, longitude: 4.9041, temperature: 11, aqi: 63, humidity: 74, windSpeed: 4.1, energyConsumption: 1390, transportActivity: 510 },
  { name: "Singapore", latitude: 1.3521, longitude: 103.8198, temperature: 31, aqi: 89, humidity: 82, windSpeed: 3.2, energyConsumption: 1710, transportActivity: 670 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503, temperature: 18, aqi: 78, humidity: 62, windSpeed: 3.8, energyConsumption: 1980, transportActivity: 720 },
  { name: "New York", latitude: 40.7128, longitude: -74.006, temperature: 14, aqi: 71, humidity: 66, windSpeed: 6.1, energyConsumption: 2210, transportActivity: 760 },
]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const createSeededNoise = (seed: string) => {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  return () => {
    hash = (1664525 * hash + 1013904223) >>> 0
    return hash / 4294967296
  }
}

const getPollutionLevel = (aqi: number) => {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Sensitive Groups"
  return "Unhealthy"
}

const getTimeframeConfig = (timeframe: FilterState["timeframe"]) => {
  switch (timeframe) {
    case "7d":
      return { points: 7, stepHours: 24 }
    case "30d":
      return { points: 30, stepHours: 24 }
    case "24h":
    default:
      return { points: 24, stepHours: 1 }
  }
}

export function getMockCities(): CityData[] {
  return CITY_SEEDS.map((city) => ({
    id: city.name,
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude,
    timestamp: new Date(),
  }))
}

export function getMockCitySummary(cityId: string): CityData {
  const city =
    CITY_SEEDS.find((entry) => entry.name.toLowerCase() === decodeURIComponent(cityId).toLowerCase()) ?? CITY_SEEDS[0]

  return {
    id: city.name,
    name: city.name,
    temperature: city.temperature,
    aqi: city.aqi,
    pollutionLevel: getPollutionLevel(city.aqi),
    humidity: city.humidity,
    windSpeed: city.windSpeed,
    energyConsumption: city.energyConsumption,
    transportActivity: city.transportActivity,
    latitude: city.latitude,
    longitude: city.longitude,
    timestamp: new Date(),
  }
}

export function getMockTimeSeries(cityId: string, timeframe: FilterState["timeframe"]): TimeSeriesData[] {
  const city = getMockCitySummary(cityId)
  const { points, stepHours } = getTimeframeConfig(timeframe)
  const noise = createSeededNoise(`${city.name}-${timeframe}`)
  const now = Date.now()

  return Array.from({ length: points }, (_, index) => {
    const offset = points - index - 1
    const timestamp = new Date(now - offset * stepHours * 60 * 60 * 1000)
    const cyclical = Math.sin((index / Math.max(points - 1, 1)) * Math.PI * 2)

    return {
      timestamp: timestamp.toISOString(),
      temperature: Number((city.temperature! + cyclical * 3 + (noise() - 0.5) * 1.4).toFixed(1)),
      aqi: Math.round(clamp(city.aqi! + cyclical * 9 + (noise() - 0.5) * 16, 20, 180)),
      energyConsumption: Math.round(clamp(city.energyConsumption! + cyclical * 140 + (noise() - 0.5) * 120, 700, 2600)),
      transportActivity: Math.round(clamp(city.transportActivity! + cyclical * 90 + (noise() - 0.5) * 70, 180, 1000)),
    }
  })
}
