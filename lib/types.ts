export interface CityData {
  id: string
  name: string
  temperature: number
  aqi: number
  pollutionLevel: string
  humidity: number
  windSpeed: number
  energyConsumption: number
  transportActivity: number
  latitude: number
  longitude: number
  timestamp: Date
}

export interface TimeSeriesData {
  timestamp: string
  temperature: number
  aqi: number
  energyConsumption: number
  transportActivity: number
}

export interface FilterState {
  selectedCity: string | null
  selectedMetric: "aqi" | "temperature" | "energy" | "transport"
  timeframe: "24h" | "7d" | "30d"
}
