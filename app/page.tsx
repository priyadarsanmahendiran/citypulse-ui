"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { FilterState, CityData } from "@/lib/types"
import { FilterPanel } from "@/components/filter-panel"
import { CityCard } from "@/components/city-card"
import { ChartsView } from "@/components/charts-view"
import { MapView } from "@/components/map-view"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, TrendingUp, Map, Cloud, Activity, Zap, Building2, ArrowRight } from "lucide-react"

const summaryCardConfig = [
  { key: "avgAqi", title: "Network AQI", subtitle: "Average air-quality signal", icon: Activity, accent: "from-amber-500/20 to-orange-500/10" },
  { key: "avgTemperature", title: "Temperature", subtitle: "Cross-city thermal baseline", icon: Cloud, accent: "from-sky-500/20 to-cyan-500/10" },
  { key: "totalEnergy", title: "Energy Load", subtitle: "Current monitored demand", icon: Zap, accent: "from-blue-500/20 to-indigo-500/10" },
  { key: "cityCount", title: "Connected Cities", subtitle: "Nodes feeding the live canvas", icon: Building2, accent: "from-emerald-500/20 to-teal-500/10" },
] as const

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [filters, setFilters] = useState<FilterState>({
    selectedCity: null,
    selectedMetric: "aqi",
    timeframe: "24h",
  })
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true)
        const data = await api.getCities()
        const citiesSummary = await Promise.all(
          data.map(async (city) => {
            const summaryData = await api.getCitySummary(city.id || city.name)

            return {
              ...city,
              ...summaryData,
              id: city.id || city.name,
              name: city.name,
              latitude: city.latitude,
              longitude: city.longitude,
            }
          })
        )

        setCities(citiesSummary)
        setError(null)
      } catch (err) {
        setError("Failed to load cities data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  const displayedCities = filters.selectedCity ? cities.filter((c) => c.id === filters.selectedCity) : cities
  const selectedCityData = cities.find((city) => city.id === filters.selectedCity) ?? cities[0]
  const averageAqi =
    cities.length > 0 ? Math.round(cities.reduce((total, city) => total + (city.aqi ?? 0), 0) / cities.length) : 0
  const averageTemperature =
    cities.length > 0
      ? Number((cities.reduce((total, city) => total + (city.temperature ?? 0), 0) / cities.length).toFixed(1))
      : 0
  const totalEnergy = cities.reduce((total, city) => total + (city.energyConsumption ?? 0), 0)
  const networkSummary = {
    avgAqi: `${averageAqi}`,
    avgTemperature: `${averageTemperature}°C`,
    totalEnergy: `${totalEnergy.toLocaleString()} MWh`,
    cityCount: `${cities.length}`,
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_25%),linear-gradient(180deg,#f5f9ff_0%,#f8fafc_35%,#eef4fb_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 shadow-lg backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2.5 ring-1 ring-white/15">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">CityPulse</h1>
                <p className="mt-1 text-white/80">Urban visualization platform for environmental and infrastructure health</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-white/70 backdrop-blur">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              {selectedCityData ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("charts")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-300"
                >
                  Explore {selectedCityData.name}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCardConfig.map((item) => {
            const Icon = item.icon

            return (
              <Card key={item.key} className={`border-white/30 bg-gradient-to-br ${item.accent} shadow-lg shadow-slate-900/5`}>
                <CardContent className="flex items-start justify-between pt-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{item.title}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">
                      {networkSummary[item.key as keyof typeof networkSummary]}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{item.subtitle}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3 shadow-sm">
                    <Icon className="h-5 w-5 text-slate-900" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        {selectedCityData ? (
          <section className="mb-8 rounded-[28px] border border-slate-200/70 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {filters.selectedCity ? "Selected city" : "Featured city"}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">{selectedCityData.name}</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Monitoring {filters.selectedMetric} across a {filters.timeframe} window with live air quality,
                  weather, mobility, and energy signals.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/60">AQI</p>
                  <p className="mt-2 text-2xl font-semibold">{selectedCityData.aqi ?? "N/A"}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 px-4 py-3 text-slate-950">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Temp</p>
                  <p className="mt-2 text-2xl font-semibold">{selectedCityData.temperature ?? "N/A"}°C</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-950">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Humidity</p>
                  <p className="mt-2 text-2xl font-semibold">{selectedCityData.humidity ?? "N/A"}%</p>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-slate-950">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Energy</p>
                  <p className="mt-2 text-2xl font-semibold">{selectedCityData.energyConsumption ?? "N/A"}</p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFiltersChange={setFilters} cities={cities} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100">
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger
                  value="charts"
                  className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-white"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Charts</span>
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    {filters.selectedCity ? "City Status" : "All Cities"}
                  </h2>
                  {loading && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading cities...</p>
                    </div>
                  )}
                  {error && (
                    <div className="text-center py-8">
                      <p className="text-red-500">{error}</p>
                    </div>
                  )}
                  {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedCities.map((city) => (
                        <CityCard
                          key={city.name}
                          city={city}
                          onClick={() => {
                            setFilters({ ...filters, selectedCity: city.name })
                            setActiveTab("charts")
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts" className="mt-0">
                <ChartsView
                  selectedCity={filters.selectedCity}
                  cities={cities}
                  selectedMetric={filters.selectedMetric}
                  timeframe={filters.timeframe}
                  onMetricChange={(selectedMetric) => setFilters((current) => ({ ...current, selectedMetric }))}
                />
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map" className="mt-0">
                <MapView
                  cities={cities}
                  onCitySelect={(cityId) => {
                    setFilters({ ...filters, selectedCity: cityId })
                  }}
                  selectedCity={filters.selectedCity}
                  selectedMetric={filters.selectedMetric}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
