const BACKEND_API_URL = process.env.BACKEND_API_URL?.trim()

export const hasConfiguredBackend = Boolean(BACKEND_API_URL && !BACKEND_API_URL.includes("dummy"))

export async function fetchBackendJson<T>(path: string): Promise<T | null> {
  if (!hasConfiguredBackend || !BACKEND_API_URL) {
    return null
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error(`Error fetching backend path "${path}":`, error)
    return null
  }
}
