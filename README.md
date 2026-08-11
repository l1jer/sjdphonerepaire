# SJD Tech Phone & Tablet Repairs

A modern, SEO-optimized website for SJD Tech's phone and tablet repair services. Built with Next.js 15, featuring Redis-cached reviews, comprehensive repair form system, and mobile-first design.

## 🚀 Features

### 📱 **Modern Website**
- **Mobile-First Design**: Responsive across all devices
- **Fast Performance**: Optimised loading and caching
- **Professional UI**: Modern design with Tailwind CSS
- **SEO Optimised**: Complete meta tags, structured data, and search engine optimisation

### ⭐ **Smart Reviews System**
- **Weekly Redis Sync**: Automatic Google Places API sync every Monday
- **5-Star Only**: Only 5-star reviews are synced and displayed; lower-rated reviews are filtered out at fetch time and purged from the cache on every sync
- **Instant Loading**: Cached reviews for fast user experience
- **Infinite Scrolling**: Smooth animations with no flash-back
- **Cost Efficient**: 99% reduction in Google API calls

### 📋 **Internal Repair Form**
- **Password Protected**: Secure internal access only
- **Camera Integration**: Take photos directly from mobile devices
- **Digital Signature**: HTML5 canvas signature capture
- **PDF Generation**: Professional receipts with embedded photos
- **Function Testing**: 12-point device functionality checklist
- **Device Conditions**: Water damage, frame damage, or custom conditions

### 📸 **Camera & Photo Upload**
- **Dual Upload Options**: Gallery files or camera capture
- **Mobile Optimised**: Uses back camera for better quality
- **Proportional Scaling**: Images maintain aspect ratio in PDFs
- **Multiple Photos**: Support for multiple device photos

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/sjdphonerepaire.git
cd sjdphonerepaire
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local`:
```bash
# Form Access
NEXT_PUBLIC_ADMIN_FORM_PASSWORD=your-secure-password

# Redis (Upstash)
reviews_KV_URL=your-redis-url
reviews_KV_REST_API_READ_ONLY_TOKEN=your-read-token
reviews_KV_REST_API_TOKEN=your-write-token
reviews_KV_REST_API_URL=your-rest-api-url

# Google Places API
GOOGLE_PLACES_API_KEY=your-google-api-key

# Security (Optional)
CRON_SECRET=your-cron-secret
ADMIN_SECRET=your-admin-secret
```

4. **Run development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📋 Form Features

### Customer Information
- Full name, phone, email, drop-off date
- Required fields validation

### Device Information
- Device type (iPhone, Android Phone, iPad, Android Tablet, Other)
- Brand, model, serial number, IMEI
- **Device Condition**: Water damaged, Frame out of shape, or custom condition


### Function Check
Pass/Fail checkboxes for:
- Mic ✓ ✗
- Earpiece Speaker ✓ ✗
- Sensor ✓ ✗
- Front Camera ✓ ✗
- Back Camera ✓ ✗
- Rotation ✓ ✗
- Signal ✓ ✗
- LCD & Glass ✓ ✗
- Charging ✓ ✗
- Volume Button ✓ ✗
- Mute Button ✓ ✗
- Face ID ✓ ✗

### Warranty Information
- Complete warranty terms and conditions
- Warranty coverage details
- Exclusions and limitations
- Customer responsibilities

### Photo Documentation
- **Camera Capture**: Take photos directly from mobile devices
- **Gallery Upload**: Traditional file selection
- **Multiple Photos**: Support for multiple device images
- **Auto-scaling**: Images maintain aspect ratio in PDFs

### Digital Signature
- HTML5 canvas signature capture
- Touch-optimised for mobile devices
- Embedded in PDF receipts

## 🔧 Technical Implementation

### Reviews System
```typescript
// Weekly sync (Monday 6:00 AM)
GET /api/reviews/sync?cron_secret=<CRON_SECRET>

// Reviews API with Redis caching
GET /api/reviews  // Primary: Redis → Fallback: Google API

// Manual sync for testing
GET /api/admin/sync-reviews?secret=<ADMIN_SECRET>
```

### Repair Form
```typescript
// Password protected access
GET /repair-form

// Form submission with camera support
POST /api/repair-form/submit

// PDF download with proportional images
POST /api/repair-form/download/{reference}
```

### Cache Strategy
1. **Client**: 7-day localStorage cache
2. **Server**: Redis weekly cache (primary)
3. **Fallback**: Redis daily cache (legacy)
4. **Emergency**: Google Places API (last resort)

## 📊 Environment Variables

### Required
```bash
# Form Security
NEXT_PUBLIC_ADMIN_FORM_PASSWORD=your-secure-password

# Redis Configuration (Upstash)
reviews_KV_URL=your-redis-url
reviews_KV_REST_API_READ_ONLY_TOKEN=your-read-token
reviews_KV_REST_API_TOKEN=your-write-token
reviews_KV_REST_API_URL=your-rest-api-url

# Google Places API
GOOGLE_PLACES_API_KEY=your-google-api-key
```

### Optional (Email/PDF Delivery)
```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-gmail-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=recipient@example.com

# Security
CRON_SECRET=your-cron-secret
ADMIN_SECRET=your-admin-secret
```

#### Gmail Setup (2-Step Verification Required)
1. **Enable 2-Step Verification**:
   - Go to [Google Account](https://myaccount.google.com)
   - Security → 2-Step Verification → Get Started
   - Follow the setup process

2. **Generate App Password**:
   - After enabling 2FA, go to Security → 2-Step Verification
   - Scroll down to "App passwords"
   - Select "Mail" and "Other (custom name)"
   - Enter "SJD Repair Form" as the name
   - Copy the 16-character password
   - Use this password in `EMAIL_PASSWORD`

#### Alternative Email Providers
```bash
# Outlook/Hotmail
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-regular-password

# Yahoo Mail
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password

# Custom SMTP Server
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-smtp-password
```

## 🏗️ Project Structure

```
sjdphonerepaire/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── reviews/          # Reviews API with Redis caching
│   │   │   ├── repair-form/      # Form submission & PDF generation
│   │   │   └── admin/            # Admin endpoints
│   │   ├── repair-form/          # Internal repair form page
│   │   ├── layout.tsx           # Root layout with SEO
│   │   └── page.tsx             # Homepage
│   ├── components/
│   │   ├── hero.tsx             # Hero section with image
│   │   ├── about.tsx            # About section
│   │   ├── pricing.tsx          # Services pricing
│   │   ├── reviews.tsx          # Reviews with infinite scroll
│   │   └── footer.tsx           # Footer with navigation
│   └── services/
│       └── googlePlaces.ts      # Google Places API service
├── public/                      # Static assets
├── vercel.json                  # Vercel configuration
└── tailwind.config.ts          # Tailwind configuration
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables**
   - Add all required variables in Vercel project settings
   - Enable "Automatically expose System Environment Variables"

3. **Cron Jobs**
   - Vercel automatically handles the weekly cron job
   - Check logs in Vercel dashboard for sync status

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint checking
```

### Testing Features

1. **Reviews System**
```bash
# Test manual sync
curl "http://localhost:3000/api/admin/sync-reviews?secret=YOUR_ADMIN_SECRET"

# Check reviews cache
curl "http://localhost:3000/api/reviews"
```

2. **Repair Form**
```bash
# Access form (requires password)
open http://localhost:3000/repair-form

# Test PDF generation
curl -X POST http://localhost:3000/api/repair-form/download/SJD-TEST-001 \
  -H "Content-Type: application/json" \
  -d '{"formData": {...}}'
```

## 📈 Performance Optimisations

### Reviews System
- **99% API Call Reduction**: Weekly sync vs per-user requests
- **Instant Loading**: Redis cache for sub-second response
- **Smart Fallbacks**: Multiple cache layers ensure reliability
- **Rolling Cache**: Maintains exactly 15 reviews with newest priority

### Image Optimisation
- **Proportional Scaling**: Images maintain aspect ratio in PDFs
- **Quality Preservation**: High-quality capture with compression
- **Mobile Optimised**: Camera uses back camera for better quality

### SEO Features
- **Complete Meta Tags**: Open Graph, Twitter Cards
- **Structured Data**: LocalBusiness JSON-LD schema
- **Local Targeting**: Australian location optimisation
- **Mobile-First**: Google Mobile-Friendly compliant

## 🐛 Troubleshooting

### Common Issues

1. **Camera Not Working**
   - Ensure HTTPS in production (camera requires secure context)
   - Check browser permissions for camera access
   - Mobile devices need user permission for camera

2. **Reviews Not Loading**
   - Check Redis connection in environment variables
   - Verify Google Places API key is valid
   - Check Vercel function logs for errors

3. **Form Submission Issues**
   - Verify environment variables are set correctly
   - Check form validation (all required fields)
   - Review server logs for submission errors

### Debug Commands
```bash
# Check Redis connection
npm run dev
# Look for "Redis connected" in console

# Test API endpoints
curl http://localhost:3000/api/reviews
curl http://localhost:3000/api/admin/sync-reviews?secret=YOUR_SECRET
```

## 🔒 Security

- **Password Protection**: Internal form access only
- **Environment Variables**: No sensitive data in code
- **HTTPS Required**: For camera functionality
- **Input Validation**: All form inputs validated
- **CORS Protection**: Authorised origins only

## 📞 Support

For technical issues or questions:
1. Check Vercel function logs
2. Review environment variable configuration
3. Test with manual API calls
4. Check browser console for client-side errors

## 📝 License

This project is private and proprietary to SJD Tech.

---

**Built with**: Next.js 15, React, TypeScript, Tailwind CSS, Redis, Google Places API
**Deployed on**: Vercel with automatic scaling
**Performance**: 99% Google API cost reduction, instant loading reviews
