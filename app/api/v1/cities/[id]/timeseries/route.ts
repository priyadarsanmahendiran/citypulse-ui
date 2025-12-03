import { NextResponse } from "next/server"

const BACKEND_API_URL = process.env.BACKEND_API_URL || "https://dummy"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "24h"

    const response = await fetch(`${BACKEND_API_URL}/cities/${id}/timeseries?timeframe=${timeframe}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch time series data" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching time series data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
