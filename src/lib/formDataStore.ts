// Shared form data store for PDF downloads using Redis
// This allows the download route to access form data submitted in the submit route

import { Redis } from '@upstash/redis'

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

// Initialize Redis client
const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

// Redis key prefix for form data
const FORM_DATA_PREFIX = 'repair_form_data:'

// Function to store form data
export async function storeFormData(caseId: string, data: RepairFormData, signature?: string, devicePhotos: File[] = []) {
  try {
    // Convert photos to base64 asynchronously
    const photoPromises = devicePhotos.map(async (photo) => ({
      name: photo.name,
      size: photo.size,
      type: photo.type,
      // Store base64 encoded content for file data
      content: Buffer.from(await photo.arrayBuffer()).toString('base64')
    }))

    const processedPhotos = await Promise.all(photoPromises)

    const formData = {
      data,
      signature,
      devicePhotos: processedPhotos,
      timestamp: Date.now()
    }

    // Store in Redis with 24-hour expiration
    await redis.set(`${FORM_DATA_PREFIX}${caseId}`, JSON.stringify(formData), { ex: 24 * 60 * 60 })

    // console.log(`Form data stored in Redis for case: ${caseId}`)
    return true
  } catch (error) {
    console.error('Error storing form data in Redis:', error)
    return false
  }
}

// Function to get stored form data
export async function getStoredFormData(caseId: string) {
  try {
    const storedData = await redis.get(`${FORM_DATA_PREFIX}${caseId}`)

    if (!storedData) {
      return null
    }

    const parsedData = JSON.parse(storedData as string)

    // Convert base64 content back to File objects
    const devicePhotos = parsedData.devicePhotos?.map((photoData: {
      name: string
      size: number
      type: string
      content: string
    }) => {
      const buffer = Buffer.from(photoData.content, 'base64')
      return new File([buffer], photoData.name, {
        type: photoData.type,
        lastModified: parsedData.timestamp
      })
    }) || []

    return {
      data: parsedData.data,
      signature: parsedData.signature,
      devicePhotos
    }
  } catch (error) {
    console.error('Error retrieving form data from Redis:', error)
    return null
  }
}
