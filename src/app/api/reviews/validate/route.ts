import { NextResponse } from 'next/server'

export async function GET () {
  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
  const PLACE_ID = 'ChIJncP4AAw51GoRHBRenZ9MLxg'

  try {
    // First, validate the place ID
    const placeUrl = new URL(
      'https://maps.googleapis.com/maps/api/place/details/json'
    )
    placeUrl.searchParams.append('place_id', PLACE_ID)
    placeUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY || '')
    placeUrl.searchParams.append('fields', 'name,rating') // Minimal fields for validation

    const placeResponse = await fetch(placeUrl.toString())
    const placeData = await placeResponse.json()

    // Check API key permissions
    const permissionsUrl = new URL(
      'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    )
    permissionsUrl.searchParams.append('input', 'test')
    permissionsUrl.searchParams.append('inputtype', 'textquery')
    permissionsUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY || '')

    const permissionsResponse = await fetch(permissionsUrl.toString())
    const permissionsData = await permissionsResponse.json()

    return NextResponse.json({
      status: 'success',
      validation_results: {
        api_key: {
          exists: !!GOOGLE_PLACES_API_KEY,
          length: GOOGLE_PLACES_API_KEY?.length || 0,
          is_valid: placeResponse.ok && permissionsResponse.ok
        },
        place_id: {
          value: PLACE_ID,
          exists: true,
          is_valid: placeData.status === 'OK',
          place_name: placeData.result?.name
        },
        api_responses: {
          place_details: {
            status: placeData.status,
            has_rating: !!placeData.result?.rating
          },
          permissions: {
            status: permissionsData.status,
            error_message: permissionsData.error_message
          }
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        validation_failed: true
      },
      { status: 500 }
    )
  }
}
