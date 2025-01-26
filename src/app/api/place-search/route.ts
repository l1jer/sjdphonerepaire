import { NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface Place {
  id: string
  displayName?: {
    text: string
  }
  formattedAddress?: string
}

interface PlacesResponse {
  places?: Place[]
}

export async function GET() {
  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { error: 'Google Places API key not configured' },
      { status: 500 }
    )
  }

  const query = 'SJD Phone Repair Kingston Village Shopping Centre'
  const url = new URL('https://places.googleapis.com/v1/places:searchText')

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id'
      },
      body: JSON.stringify({
        textQuery: query
      })
    })

    if (!response.ok) {
      console.error('Places API error:', await response.text())
      return NextResponse.json(
        { error: `Places API error: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }

    const data: PlacesResponse = await response.json()
    console.log('Places API response:', data)

    return NextResponse.json({
      candidates: (data.places || []).map((place: Place) => ({
        place_id: place.id,
        name: place.displayName?.text || 'Unknown',
        formatted_address: place.formattedAddress || ''
      }))
    })
  } catch (error) {
    console.error('Error searching place:', error)
    return NextResponse.json(
      { error: 'Failed to search for place' },
      { status: 500 }
    )
  }
}