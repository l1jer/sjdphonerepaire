# Reviews System - Redis Weekly Sync Implementation

## Overview
The reviews system has been updated to use Redis-based weekly synchronisation instead of real-time Google Places API calls for every user visit.

## How It Works

### 1. Weekly Synchronisation
- **Cron Schedule**: Every Monday at 6:00 AM (`0 6 * * 1`)
- **Endpoint**: `/api/reviews/sync`
- **Process**: 
  - Fetches fresh reviews from Google Places API
  - Stores in Redis with 7-day cache duration
  - Updates historical reviews archive
  - No user interaction required

### 2. User Requests
- **Primary Source**: Redis weekly cache (`reviews_weekly_cache`)
- **Fallback**: Redis daily cache (`google_reviews_cache`)
- **Last Resort**: Real-time Google API (if both Redis caches fail)
- **Client Cache**: 7-day localStorage cache for better UX

## API Endpoints

### Weekly Sync
```
GET /api/reviews/sync?cron_secret=<CRON_SECRET>
```
Automatically triggered weekly, or manually via admin endpoint.

### Manual Sync (Admin)
```
GET /api/admin/sync-reviews?secret=<ADMIN_SECRET>
```
For manual testing and emergency updates.

### Reviews (Public)
```
GET /api/reviews
```
Serves reviews to frontend, prioritising Redis cache.

## Environment Variables Required

```env
# Redis Configuration
reviews_KV_URL="your-redis-url"
reviews_KV_REST_API_READ_ONLY_TOKEN="your-read-token"
reviews_KV_REST_API_TOKEN="your-write-token"
reviews_KV_REST_API_URL="your-rest-api-url"

# Google Places API
GOOGLE_PLACES_API_KEY="your-google-api-key"

# Security
CRON_SECRET="your-cron-secret"
ADMIN_SECRET="your-admin-secret"
```

## Benefits

1. **Performance**: Users get instant reviews from Redis cache
2. **Cost Efficiency**: Google API calls reduced from per-user to weekly
3. **Reliability**: Multiple fallback layers ensure reviews always load
4. **Scalability**: No rate limiting issues for high traffic
5. **Fresh Content**: Weekly updates keep reviews current

## Cache Strategy

1. **Frontend**: 7-day localStorage cache for fastest loading
2. **Redis Weekly**: Primary source, updated weekly
3. **Redis Daily**: Fallback cache (legacy)
4. **Google API**: Last resort for emergencies

## Monitoring

- Check Redis connection in build logs
- Weekly sync status available via admin endpoint
- Console logs show cache hit/miss patterns
- Historical data preserved for analytics

## File Changes

- `vercel.json`: Added weekly cron job
- `src/app/api/reviews/sync/route.ts`: New weekly sync endpoint
- `src/app/api/reviews/route.ts`: Updated to prioritise Redis cache
- `src/components/reviews.tsx`: Extended client cache to 7 days
- `src/app/api/admin/sync-reviews/route.ts`: Manual sync trigger

## Testing

1. **Manual Sync**: Use admin endpoint to test sync functionality
2. **Cache Verification**: Check browser console for cache sources
3. **Fallback Testing**: Temporarily disable Redis to test API fallback
4. **Performance**: Monitor response times vs old system
