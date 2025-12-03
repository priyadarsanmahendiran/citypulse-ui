import type { CityData, TimeSeriesData } from "./types"

export const CITIES: CityData[] = [
  {
    id: "1",
    name: "New York",
    temperature: 22,
    aqi: 65,
    pollutionLevel: "Moderate",
    humidity: 65,
    windSpeed: 12,
    energyConsumption: 8500,
    transportActivity: 9200,
    latitude: 40.7128,
    longitude: -74.006,
    timestamp: new Date(),
  },
  {
    id: "2",
    name: "London",
    temperature: 18,
    aqi: 55,
    pollutionLevel: "Good",
    humidity: 72,
    windSpeed: 15,
    energyConsumption: 7200,
    transportActivity: 8100,
    latitude: 51.5074,
    longitude: -0.1278,
    timestamp: new Date(),
  },
  {
    id: "3",
    name: "Tokyo",
    temperature: 24,
    aqi: 48,
    pollutionLevel: "Good",
    humidity: 58,
    windSpeed: 8,
    energyConsumption: 9100,
    transportActivity: 9800,
    latitude: 35.6762,
    longitude: 139.6503,
    timestamp: new Date(),
  },
  {
    id: "4",
    name: "Beijing",
    temperature: 20,
    aqi: 95,
    pollutionLevel: "Unhealthy",
    humidity: 45,
    windSpeed: 10,
    energyConsumption: 8800,
    transportActivity: 8500,
    latitude: 39.9042,
    longitude: 116.4074,
    timestamp: new Date(),
  },
  {
    id: "5",
    name: "Sydney",
    temperature: 26,
    aqi: 42,
    pollutionLevel: "Good",
    humidity: 55,
    windSpeed: 18,
    energyConsumption: 6800,
    transportActivity: 7500,
    latitude: -33.8688,
    longitude: 151.2093,
    timestamp: new Date(),
  },
]

export const generateTimeSeriesData = (cityId: string): TimeSeriesData[] => {
  const city = CITIES.find((c) => c.id === cityId)
  if (!city) return []

  const data: TimeSeriesData[] = []
  for (let i = 23; i >= 0; i--) {
    const date = new Date()
    date.setHours(date.getHours() - i)
    data.push({
      timestamp: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      temperature: city.temperature + (Math.random() - 0.5) * 4,
      aqi: city.aqi + (Math.random() - 0.5) * 20,
      energyConsumption: city.energyConsumption + (Math.random() - 0.5) * 800,
      transportActivity: city.transportActivity + (Math.random() - 0.5) * 600,
    })
  }
  return data
}

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return "#10b981" // Green
  if (aqi <= 100) return "#f59e0b" // Amber
  if (aqi <= 150) return "#f87171" // Red
  return "#7c2d12" // Dark Red
}

export const getPollutionStatus = (aqi: number): string => {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Sensitive Groups"
  return "Unhealthy"
}
