"use client"

import type { CityData } from "@/lib/types"
import { getPollutionStatus, getAQIColor } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Droplets, Wind, Zap, Activity, ArrowRight } from "lucide-react"

interface CityCardProps {
  city: CityData
  onClick?: () => void
}

export function CityCard({ city, onClick }: CityCardProps) {
  const formatMetric = (value?: number, suffix = "") => {
    if (value === undefined) return "N/A"
    return `${value.toLocaleString()}${suffix}`
  }

  return (
    <Card
      className="cursor-pointer border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,246,255,0.92))] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-950/10"
      onClick={onClick}
    >
      <CardHeader className="border-b border-slate-200/80 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-slate-900">{city.name}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Environmental snapshot</p>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ backgroundColor: getAQIColor(city.aqi ?? -1) }}
          >
            {getPollutionStatus(city.aqi ?? -1)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-info/10 border border-info/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Cloud className="w-4 h-4 text-info" />
              Temperature
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatMetric(city.temperature, "°C")}</p>
          </div>
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="w-4 h-4 text-success" />
              Humidity
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatMetric(city.humidity, "%")}</p>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wind className="w-4 h-4 text-warning" />
              Wind Speed
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatMetric(city.windSpeed, " m/s")}</p>
          </div>
          <div className="p-3 rounded-lg bg-error/10 border border-error/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 text-error" />
              AQI
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatMetric(city.aqi)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-accent" />
              Energy
            </div>
            <p className="mt-2 text-lg font-semibold text-foreground">{formatMetric(city.energyConsumption, " MWh")}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 text-primary" />
              Transport
            </div>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {formatMetric(city.transportActivity, "k vehicles")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200/70 pt-4 text-sm text-slate-600">
          <span>Open city trends</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  )
}
