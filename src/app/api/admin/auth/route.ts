import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_FORM

    if (!adminPassword) {
      console.error('ADMIN_FORM environment variable not set')
      return NextResponse.json(
        { success: false, message: 'Authentication service unavailable.' },
        { status: 500 }
      )
    }

    // Check if password matches
    if (password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful'
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please contact your administrator.' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Authentication API error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}
