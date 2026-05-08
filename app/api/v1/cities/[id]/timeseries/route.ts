import { NextResponse } from "next/server"
import { getMockTimeSeries } from "@/lib/mock-data"
import { fetchBackendJson } from "@/lib/server-data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "24h"
    const data = await fetchBackendJson(`/api/v1/cities/${encodeURIComponent(id)}/timeseries?timeframe=${timeframe}`)

    if (data) {
      return NextResponse.json(data)
    }

    return NextResponse.json(getMockTimeSeries(id, timeframe as "24h" | "7d" | "30d"))
  } catch (error) {
    console.error("Error fetching time series data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
