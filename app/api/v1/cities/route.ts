import { NextResponse } from "next/server"

const BACKEND_API_URL = process.env.BACKEND_API_URL || "https://dummy"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/cities`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch cities" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
