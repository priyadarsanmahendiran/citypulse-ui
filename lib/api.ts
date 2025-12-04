import type { CityData, TimeSeriesData } from "./types"

export const api = {
  async getCities(): Promise<CityData[]> {
    try {
      const response = await fetch("/api/v1/cities")
      if (!response.ok) {
        throw new Error(`Failed to fetch cities: ${response.statusText}`)
      }
      const data = await response.json()
      return data.map((city: any) => ({
        ...city,
        timestamp: new Date(city.timestamp),
      }))
    } catch (error) {
      console.error("Error fetching cities:", error)
      throw error
    }
  },

  async getCityById(cityId: string): Promise<CityData> {
    try {
      const response = await fetch(`/api/v1/cities/${cityId}/summary`)
      if (!response.ok) {
        throw new Error(`Failed to fetch city: ${response.statusText}`)
      }
      const data = await response.json()
      return {
        ...data,
        timestamp: new Date(data.timestamp),
      }
    } catch (error) {
      console.error(`Error fetching city ${cityId}:`, error)
      throw error
    }
  },

  async getTimeSeriesData(cityId: string, timeframe: string = "24h"): Promise<TimeSeriesData[]> {
    try {
      const response = await fetch(`/api/cities/${cityId}/timeseries?timeframe=${timeframe}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch time series data: ${response.statusText}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching time series data for city ${cityId}:`, error)
      throw error
    }
  },
}

// Utility functions
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
