import { NextResponse } from "next/server"
import { getMockCities } from "@/lib/mock-data"
import { fetchBackendJson } from "@/lib/server-data"

export async function GET() {
  try {
    const data = await fetchBackendJson("/api/v1/cities")

    if (data) {
      return NextResponse.json(data)
    }

    return NextResponse.json(getMockCities())
  } catch (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
