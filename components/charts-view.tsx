"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { CityData, TimeSeriesData } from "@/lib/types"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ChartsViewProps {
  selectedCity: string | null
  cities: CityData[]
}

export function ChartsView({ selectedCity, cities }: ChartsViewProps) {
  const [activeMetric, setActiveMetric] = useState<"aqi" | "temperature" | "energy" | "transport">("aqi")
  const [data, setData] = useState<TimeSeriesData[]>([])
  const [loading, setLoading] = useState(false)

  const city = selectedCity ? cities.find((c) => c.id === selectedCity) : cities[0]

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      if (!city) return

      try {
        setLoading(true)
        const timeSeriesData = await api.getTimeSeriesData(city.name, "24h")
        setData(timeSeriesData)
      } catch (error) {
        console.error("Error fetching time series data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeSeriesData()
  }, [city])

  if (!city) return null

  const getChartConfig = () => {
    switch (activeMetric) {
      case "aqi":
        return {
          title: "Air Quality Index (24h)",
          dataKey: "aqi",
          color: "#f59e0b",
          unit: "AQI",
        }
      case "temperature":
        return {
          title: "Temperature (24h)",
          dataKey: "temperature",
          color: "#ef4444",
          unit: "°C",
        }
      case "energy":
        return {
          title: "Energy Consumption (24h)",
          dataKey: "energyConsumption",
          color: "#3b82f6",
          unit: "MWh",
        }
      case "transport":
        return {
          title: "Transport Activity (24h)",
          dataKey: "transportActivity",
          color: "#8b5cf6",
          unit: "Vehicles",
        }
    }
  }

  const config = getChartConfig()

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {config.title} - {city.name}
            </CardTitle>
            <div className="flex gap-2">
              {(["aqi", "temperature", "energy", "transport"] as const).map((metric) => (
                <Button
                  key={metric}
                  variant={activeMetric === metric ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveMetric(metric)}
                >
                  {metric === "aqi"
                    ? "AQI"
                    : metric === "temperature"
                      ? "Temp"
                      : metric === "energy"
                        ? "Energy"
                        : "Transport"}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="timestamp" stroke="hsl(var(--color-muted-foreground))" />
              <YAxis stroke="hsl(var(--color-muted-foreground))" />
              <Tooltip
                formatter={(value: any) => [`${value.toFixed(2)} ${config.unit}`, config.dataKey]}
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                  borderRadius: "8px",
                  color: "hsl(var(--color-foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                fill="url(#gradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Multi-Metric Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="timestamp" stroke="hsl(var(--color-muted-foreground))" />
              <YAxis stroke="hsl(var(--color-muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                  borderRadius: "8px",
                  color: "hsl(var(--color-foreground))",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
