import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const adminSecret = searchParams.get('secret')

  // Simple admin authentication
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Trigger the sync endpoint manually
    const baseUrl = request.nextUrl.origin
    const syncUrl = `${baseUrl}/api/reviews/sync?manual=true&cron_secret=${process.env.CRON_SECRET}`
    
    const syncResponse = await fetch(syncUrl)
    const syncResult = await syncResponse.json()

    if (!syncResponse.ok) {
      throw new Error(`Sync failed: ${syncResult.error || 'Unknown error'}`)
    }

    return NextResponse.json({
      message: 'Reviews sync triggered successfully',
      sync_result: syncResult
    })

  } catch (error) {
    console.error('[Admin] Manual sync failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to trigger sync',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
