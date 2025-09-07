import { NextRequest, NextResponse } from 'next/server'
import { generatePDF } from '@/services/pdfService'
import { getStoredFormData } from '@/lib/formDataStore'

// GET method - Try to get data from Redis first, then fall back to error
export async function GET(request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  try {
    const { reference: storedCaseId } = await params

    // Try to get stored form data from Redis
    const storedData = await getStoredFormData(storedCaseId)

    if (!storedData) {
      return NextResponse.json(
        { error: 'Form data not found or expired. Please resubmit the form.' },
        { status: 404 }
      )
    }

    // Generate entry ID from stored data

    // Generate PDF with actual form data, signature, and images
    const pdfBuffer = await generatePDF(
      storedData.data,
      storedCaseId,
      storedData.signature,
      storedData.devicePhotos
    )

    // Return PDF as downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="repair-form-${storedCaseId}-${(storedData.data as { customerName?: string }).customerName?.replace(/\s+/g, '_') || 'customer'}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error generating PDF download:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF download' },
      { status: 500 }
    )
  }
}

// POST method - Accept form data directly from the frontend
export async function POST(request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  try {
    const { reference: requestCaseId } = await params

    // Get form data from request body
    const requestBody = await request.json()
    const { formData } = requestBody

    if (!formData || !formData.data) {
      return NextResponse.json(
        { error: 'Form data not provided in request body' },
        { status: 400 }
      )
    }

    // Convert base64 photos back to File objects
    const devicePhotos = formData.devicePhotos?.map((photoData: {
      name: string
      size: number
      type: string
      content: string
    }) => {
      const buffer = Buffer.from(photoData.content, 'base64')
      return new File([buffer], photoData.name, {
        type: photoData.type,
        lastModified: Date.now()
      })
    }) || []

    // Generate PDF with form data, signature, and images
    const pdfBuffer = await generatePDF(
      formData.data,
      requestCaseId,
      formData.signature,
      devicePhotos
    )

    // Return PDF as downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="repair-form-${requestCaseId}-${formData.data.customerName?.replace(/\s+/g, '_') || 'customer'}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error generating PDF download:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF download' },
      { status: 500 }
    )
  }
}
