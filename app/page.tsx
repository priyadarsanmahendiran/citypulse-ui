"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { FilterState, CityData } from "@/lib/types"
import { FilterPanel } from "@/components/filter-panel"
import { CityCard } from "@/components/city-card"
import { ChartsView } from "@/components/charts-view"
import { MapView } from "@/components/map-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, TrendingUp, Map, Cloud } from "lucide-react"

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
        const data = await api.getCities();
        let citiesSummary: CityData[] = [];

        for (const city of data) {
          const summaryData = await api.getCityById(city.name);

          const summary: CityData = {
            id: city.name,
            name: city.name,
            aqi: summaryData.aqi,
            latitude: city.latitude,
            longitude: city.longitude
          };

          citiesSummary.push(summary);
        }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-border backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">CityPulse</h1>
                <p className="text-white/80 mt-1">Real-time monitoring across multiple cities</p>
              </div>
            </div>
            <div className="text-sm text-white/70 bg-white/10 px-4 py-2 rounded-lg backdrop-blur">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <ChartsView selectedCity={filters.selectedCity} cities={cities} />
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map" className="mt-0">
                <MapView
                  cities={cities}
                  onCitySelect={(cityId) => {
                    setFilters({ ...filters, selectedCity: cityId })
                  }}
                  selectedCity={filters.selectedCity}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
