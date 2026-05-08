"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { api } from "@/lib/api"
import type { CityData, FilterState, TimeSeriesData } from "@/lib/types"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ChartsViewProps {
  selectedCity: string | null
  cities: CityData[]
  selectedMetric: FilterState["selectedMetric"]
  timeframe: FilterState["timeframe"]
  onMetricChange: (metric: FilterState["selectedMetric"]) => void
}

type MetricKey = FilterState["selectedMetric"]

const metricConfig: Record<
  MetricKey,
  { title: string; dataKey: keyof TimeSeriesData; color: string; unit: string; shortLabel: string }
> = {
  aqi: { title: "Air quality", dataKey: "aqi", color: "#f59e0b", unit: "AQI", shortLabel: "AQI" },
  temperature: { title: "Temperature", dataKey: "temperature", color: "#ef4444", unit: "°C", shortLabel: "Temp" },
  energy: { title: "Energy demand", dataKey: "energyConsumption", color: "#2563eb", unit: "MWh", shortLabel: "Energy" },
  transport: { title: "Transport activity", dataKey: "transportActivity", color: "#0891b2", unit: "k vehicles", shortLabel: "Transport" },
}

export function ChartsView({
  selectedCity,
  cities,
  selectedMetric,
  timeframe,
  onMetricChange,
}: ChartsViewProps) {
  const [data, setData] = useState<TimeSeriesData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const city = selectedCity ? cities.find((c) => c.id === selectedCity) : cities[0]

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      if (!city) return

      try {
        setLoading(true)
        setError(null)
        const timeSeriesData = await api.getTimeSeriesData(city.name, timeframe)
        setData(timeSeriesData)
      } catch (error) {
        console.error("Error fetching time series data:", error)
        setError("Unable to load chart data for the selected city.")
      } finally {
        setLoading(false)
      }
    }

    fetchTimeSeriesData()
  }, [city, timeframe])

  if (!city) return null
  const config = metricConfig[selectedMetric]
  const latest = data[data.length - 1]
  const average =
    data.length > 0
      ? Math.round(data.reduce((total, entry) => total + Number(entry[config.dataKey] ?? 0), 0) / data.length)
      : null

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{config.title} trends for {city.name}</CardTitle>
              <CardDescription>
                {timeframe === "24h" ? "Hourly updates" : "Daily rollups"} across the selected time window.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(metricConfig) as MetricKey[]).map((metric) => (
                <Button
                  key={metric}
                  variant={selectedMetric === metric ? "default" : "outline"}
                  size="sm"
                  onClick={() => onMetricChange(metric)}
                >
                  {metricConfig[metric].shortLabel}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-muted-foreground">Latest</p>
              <p className="mt-2 text-2xl font-semibold">
                {latest ? `${Number(latest[config.dataKey]).toLocaleString()} ${config.unit}` : "N/A"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-muted-foreground">Window average</p>
              <p className="mt-2 text-2xl font-semibold">{average !== null ? `${average} ${config.unit}` : "N/A"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-muted-foreground">Observations</p>
              <p className="mt-2 text-2xl font-semibold">{data.length}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis
                dataKey="timestamp"
                stroke="hsl(var(--color-muted-foreground))"
                tickFormatter={(value: string) =>
                  format(new Date(value), timeframe === "24h" ? "HH:mm" : timeframe === "7d" ? "EEE" : "d MMM")
                }
              />
              <YAxis stroke="hsl(var(--color-muted-foreground))" />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} ${config.unit}`, config.dataKey]}
                labelFormatter={(value: string) => format(new Date(value), timeframe === "24h" ? "MMM d, HH:mm" : "MMM d")}
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                  borderRadius: "8px",
                  color: "hsl(var(--color-foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey={config.dataKey as string}
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
              <XAxis
                dataKey="timestamp"
                stroke="hsl(var(--color-muted-foreground))"
                tickFormatter={(value: string) =>
                  format(new Date(value), timeframe === "24h" ? "HH:mm" : timeframe === "7d" ? "EEE" : "d MMM")
                }
              />
              <YAxis stroke="hsl(var(--color-muted-foreground))" />
              <Tooltip
                labelFormatter={(value: string) => format(new Date(value), timeframe === "24h" ? "MMM d, HH:mm" : "MMM d")}
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
              <Line type="monotone" dataKey="energyConsumption" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="transportActivity" stroke="#0891b2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
