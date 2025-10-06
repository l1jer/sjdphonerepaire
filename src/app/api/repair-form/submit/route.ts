import { NextRequest, NextResponse } from 'next/server'
import { generatePDF } from '@/services/pdfService'
import { sendCustomerEmail, sendInternalEmail } from '@/services/emailService'

interface RepairFormData {
  customerName: string
  phoneNumber: string
  email: string
  dropOffDate: string
  pickUpDate?: string
  deviceType: string
  deviceModel: string
  deviceBrand: string
  serialNumber: string
  imeiNumber: string
  deviceCondition: string
  customCondition: string
  functionCheck: {
    mic: boolean
    earpieceSpeaker: boolean
    sensor: boolean
    frontCamera: boolean
    backCamera: boolean
    rotation: boolean
    signal: boolean
    lcdGlass: boolean
    charging: boolean
    volumeButton: boolean
    muteButton: boolean
    faceId: boolean
  }
  signature?: string
}

import { storeFormData } from '@/lib/formDataStore'

// Increase function timeout budget for large PDF/email flows
export const maxDuration = 60

// Generate case ID in format: DDMMYYYY-PHONENUMBER-FULLNAME
function generateCaseId(data: RepairFormData): string {
  const date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const dateStr = `${day}${month}${year}`

  // Clean phone number - remove spaces, brackets, dashes
  const cleanPhone = data.phoneNumber.replace(/[\s\-\(\)]/g, '')

  // Uppercase full name with no spaces
  const fullName = `${data.customerName}`.toUpperCase().replace(/\s+/g, '')

  return `${dateStr}-${cleanPhone}-${fullName}`
}


// Log form data to console (simple alternative to external databases)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logFormData(_data: RepairFormData, _caseId: string): boolean {
  try {
    // console.log('\n=== REPAIR FORM SUBMISSION ===')
    // console.log(`Case ID: ${_caseId}`)
    // console.log(`Timestamp: ${new Date().toISOString()}`)
    // console.log('\n--- CUSTOMER INFORMATION ---')
    // console.log(`Name: ${_data.customerName}`)
    // console.log(`Phone: ${_data.phoneNumber}`)
    // console.log(`Email: ${_data.email}`)
    // console.log(`Drop-off Date: ${_data.dropOffDate}`)
    // console.log(`Pick-up Date: ${_data.pickUpDate}`)
    // console.log('\n--- DEVICE INFORMATION ---')
    // console.log(`Type: ${_data.deviceType}`)
    // console.log(`Brand: ${_data.deviceBrand}`)
    // console.log(`Model: ${_data.deviceModel}`)
    // console.log(`Serial: ${_data.serialNumber}`)
    // console.log(`IMEI: ${_data.imeiNumber}`)
    // console.log(`Condition: ${_data.deviceCondition}`)
    // console.log('\n=== END SUBMISSION ===\n')

    return true
  } catch (error) {
    console.error('Error logging form data:', error)
    return false
  }
}

// POST handler for form submission
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()

    // Extract form data
    const data: RepairFormData = {
      customerName: formData.get('customerName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      dropOffDate: formData.get('dropOffDate') as string,
      pickUpDate: (formData.get('pickUpDate') as string) || '',
      deviceType: formData.get('deviceType') as string,
      deviceModel: formData.get('deviceModel') as string,
      deviceBrand: formData.get('deviceBrand') as string,
      serialNumber: formData.get('serialNumber') as string,
      imeiNumber: formData.get('imeiNumber') as string,
      deviceCondition: formData.get('deviceCondition') as string,
      customCondition: formData.get('customCondition') as string,
      functionCheck: (() => {
        try {
          const functionCheckData = formData.get('functionCheck') as string
          if (!functionCheckData || functionCheckData === '[object Object]') {
            return {
              mic: false,
              earpieceSpeaker: false,
              sensor: false,
              frontCamera: false,
              backCamera: false,
              rotation: false,
              signal: false,
              lcdGlass: false,
              charging: false,
              volumeButton: false,
              muteButton: false,
              faceId: false
            }
          }
          return JSON.parse(functionCheckData)
        } catch (error) {
          console.warn('Error parsing functionCheck, using defaults:', error)
          return {
            mic: false,
            earpieceSpeaker: false,
            sensor: false,
            frontCamera: false,
            backCamera: false,
            rotation: false,
            signal: false,
            lcdGlass: false,
            charging: false,
            volumeButton: false,
            muteButton: false,
            faceId: false
          }
        }
      })(),
      signature: formData.get('signature') as string
    }

    // Generate case ID
    const caseId = generateCaseId(data)

    const totalStartTime = Date.now()
    // console.log(`Processing repair form submission: ${caseId}`)

    // Handle device photos if uploaded
    const devicePhotos: File[] = []
    for (let i = 0; ; i++) {
      const photo = formData.get(`devicePhoto${i}`) as File
      if (photo && photo.size > 0) {
        devicePhotos.push(photo)
        // console.log(`Device photo ${i + 1} uploaded: ${photo.name} (${photo.size} bytes)`)
      } else {
        break
      }
    }

    // Store form data for PDF download (temporary - 24 hours)
    const dataStored = await storeFormData(caseId, data, data.signature, devicePhotos)
    if (!dataStored) {
      console.error('Failed to store form data in Redis')
    }

    // Also return form data in response for immediate download
    // console.log(`Processing ${devicePhotos.length} photos...`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const photoPromises = devicePhotos.map(async (photo, _index) => {
      // console.log(`Processing photo ${_index + 1}: ${photo.name} (${photo.size} bytes)`)
      return {
        name: photo.name,
        size: photo.size,
        type: photo.type,
        // Convert to base64 for client-side storage
        content: Buffer.from(await photo.arrayBuffer()).toString('base64')
      }
    })

    const processedPhotos = await Promise.all(photoPromises)
    // console.log(`Photo processing completed for ${processedPhotos.length} photos`)

    const formDataForDownload = {
      data,
      signature: data.signature,
      devicePhotos: processedPhotos
    }

    // Log form data to console
    const dataLogged = logFormData(data, caseId)

    // Generate PDF with images and signature
    // console.log('Starting PDF generation...')
    const startTime = Date.now()
    const pdfBuffer = await generatePDF(data, caseId, data.signature, devicePhotos)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _pdfGenerationTime = Date.now() - startTime
    // console.log(`PDF generation completed in ${_pdfGenerationTime}ms. Size: ${pdfBuffer.length} bytes`)

    // Send customer email (no PDF attachment)
    const customerEmailSent = await sendCustomerEmail(data, caseId)

    // Send internal email (with PDF attachment and original images) - optimized timeout
    const internalEmailSent = await Promise.race([
      sendInternalEmail(pdfBuffer, data, caseId, devicePhotos),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 60000)) // 60 second timeout (optimized)
    ])

    // Upload PDF to Google Drive (disabled)
    // const pdfUploadedSuccess = await uploadPDFToDrive(pdfBuffer, referenceNumber, data.customerName)
    const pdfUploadedSuccess = false // Disabled for now

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _totalTime = Date.now() - totalStartTime
    // console.log(`Total processing time: ${_totalTime}ms`)
    // console.log('Sending response to client...')
    return NextResponse.json({
      success: true,
      caseId,
      dataLogged: dataLogged,
      customerEmailSent: customerEmailSent,
      internalEmailSent: internalEmailSent,
      pdfUploaded: pdfUploadedSuccess,
      photoUploaded: devicePhotos.length > 0,
      pdfDownloadUrl: `/api/repair-form/download/${caseId}`, // Download endpoint
      formData: formDataForDownload, // Include form data for immediate download
      message: 'Repair form submitted successfully'
    })

  } catch (error) {
    console.error('Error processing repair form:', error)
    return NextResponse.json(
      {
        error: 'Failed to process repair form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
