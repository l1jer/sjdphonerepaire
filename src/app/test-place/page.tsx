'use client'

import { useEffect, useState } from 'react'

interface PlaceSearchResult {
  candidates?: Array<{
    place_id: string
    name: string
    formatted_address: string
  }>
  error?: string
}

export default function TestPlace() {
  const [result, setResult] = useState<PlaceSearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function searchPlace() {
      try {
        const response = await fetch('/api/place-search')
        const data = await response.json()
        console.log('Search result:', data)
        setResult(data)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to search')
      } finally {
        setLoading(false)
      }
    }

    searchPlace()
  }, [])

  if (loading) {
    return <div className="p-8">Searching for place...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  if (!result) {
    return <div className="p-8">No results</div>
  }

  if (result.error) {
    return <div className="p-8 text-red-500">API Error: {result.error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Place Search Results</h1>
      {result.candidates?.map((place) => (
        <div key={place.place_id} className="mb-4 rounded-lg border p-4">
          <h2 className="font-bold">{place.name}</h2>
          <p className="mb-2 text-gray-600">{place.formatted_address}</p>
          <p className="font-mono text-sm">
            Place ID: <span className="select-all">{place.place_id}</span>
          </p>
        </div>
      ))}
    </div>
  )
}