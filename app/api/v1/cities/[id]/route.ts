import { NextResponse } from "next/server"
import { getMockCitySummary } from "@/lib/mock-data"
import { fetchBackendJson } from "@/lib/server-data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await fetchBackendJson(`/api/v1/cities/${encodeURIComponent(id)}`)

    if (data) {
      return NextResponse.json(data)
    }

    return NextResponse.json(getMockCitySummary(id))
  } catch (error) {
    console.error("Error fetching city:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
