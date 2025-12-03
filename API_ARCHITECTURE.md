# API Architecture

## Overview

The application uses a multi-layer architecture to mask the actual backend API from network inspection. This provides security and flexibility in managing backend endpoints.

## Architecture Layers

```
Frontend Components
       ↓
Client API Service (/lib/api.ts)
       ↓
Next.js API Routes (/app/api/*)
       ↓
Backend API (https://dummy)
```

## Layer Details

### 1. Frontend Components
- Located in `/components/` and `/app/`
- Make data requests using React hooks (useState, useEffect)
- Call the client API service for data fetching

### 2. Client API Service (`/lib/api.ts`)
- Acts as a client-side abstraction layer
- Makes requests to internal Next.js API routes (e.g., `/api/cities`)
- Handles data transformation and error handling
- Provides utility functions (getAQIColor, getPollutionStatus)

### 3. Next.js API Routes (`/app/api/*`)
- Server-side routes that proxy requests to the actual backend
- Masks the real backend API URL from the client
- Located at:
  - `/app/api/cities/route.ts` - Get all cities
  - `/app/api/cities/[id]/route.ts` - Get city by ID
  - `/app/api/cities/[id]/timeseries/route.ts` - Get time series data

### 4. Backend API
- Actual data source configured via environment variable
- URL is only accessible on the server-side
- Not exposed to the browser or network inspection tools

## Configuration

The backend API URL is configured in `.env.local`:

```bash
BACKEND_API_URL=https://dummy
```

To change the backend URL, simply update this environment variable.

## API Endpoints

### Internal API Routes (called by frontend)

#### GET `/api/cities`
Returns all cities data.

#### GET `/api/cities/[id]`
Returns data for a specific city.

**Parameters:**
- `id` - City ID

#### GET `/api/cities/[id]/timeseries`
Returns time series data for a specific city.

**Parameters:**
- `id` - City ID
- `timeframe` - (optional) Time range (default: "24h")

## Security Benefits

1. **Backend URL Masking**: The actual backend API URL is never exposed to the client
2. **Server-side Control**: All external API calls happen server-side
3. **Flexible Configuration**: Backend URL can be changed without frontend code changes
4. **Request Validation**: API routes can add authentication, validation, and rate limiting
5. **CORS Management**: No CORS issues since frontend calls same-origin API routes

## Usage Example

```typescript
import { api } from '@/lib/api'

// Fetch all cities
const cities = await api.getCities()

// Fetch specific city
const city = await api.getCityById('1')

// Fetch time series data
const timeSeries = await api.getTimeSeriesData('1', '24h')
```

## Development

When running locally with `npm run dev`, the API routes will be available at:
- `http://localhost:3000/api/cities`
- `http://localhost:3000/api/cities/[id]`
- `http://localhost:3000/api/cities/[id]/timeseries`

## Production Deployment

Ensure the `BACKEND_API_URL` environment variable is properly set in your production environment.
