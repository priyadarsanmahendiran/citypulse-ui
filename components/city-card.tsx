"use client"

import type { CityData } from "@/lib/types"
import { getPollutionStatus, getAQIColor } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Droplets, Wind, Zap, Activity } from "lucide-react"

interface CityCardProps {
  city: CityData
  onClick?: () => void
}

export function CityCard({ city, onClick }: CityCardProps) {
  const getMetricTrend = (value: number, threshold: number) => {
    return value > threshold ? "up" : "down"
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-accent hover:scale-105 bg-gradient-to-br from-card to-card/50 border-border/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3 bg-slate-50">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-slate-900">{city.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Environmental Status</p>
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
            <p className="text-2xl font-bold text-foreground mt-2">{city.temperature}°C</p>
          </div>
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="w-4 h-4 text-success" />
              Humidity
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{city.humidity}%</p>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wind className="w-4 h-4 text-warning" />
              Wind Speed
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{city.windSpeed} m/s</p>
          </div>
          <div className="p-3 rounded-lg bg-error/10 border border-error/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 text-error" />
              AQI
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{city.aqi}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-accent" />
              Energy
            </div>
            <p className="text-lg font-semibold text-foreground mt-2">
              {(city.energyConsumption ?? 0 / 1000)} MWh
            </p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 text-primary" />
              Transport
            </div>
            <p className="text-lg font-semibold text-foreground mt-2">
              {(city.transportActivity ?? 0 / 1000)}K vehicles
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
