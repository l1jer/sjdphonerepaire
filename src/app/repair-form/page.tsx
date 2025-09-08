"use client"

import { useState, useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'

interface FormData {
  // Customer Information
  customerName: string
  phoneNumber: string
  email: string
  dropOffDate: string
  pickUpDate: string

  // Device Information
  deviceType: string
  deviceModel: string
  deviceBrand: string
  serialNumber: string
  imeiNumber: string
  deviceCondition: string
  customCondition: string


  // Function Check
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
  
}

export default function RepairFormPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    phoneNumber: '',
    email: '',
    dropOffDate: '',
    pickUpDate: '',
    deviceType: '',
    deviceModel: '',
    deviceBrand: '',
    serialNumber: '',
    imeiNumber: '',
    deviceCondition: '',
    customCondition: '',
    functionCheck: {
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
  })
  
  const [signature, setSignature] = useState<string>('')
  const [signatureSaved, setSignatureSaved] = useState<boolean>(false)
  const [devicePhotos, setDevicePhotos] = useState<(File | null)[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  // Camera functionality
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraPhotoIndex, setCameraPhotoIndex] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error',
    message: string,
    downloadUrl?: string,
    caseId?: string,
    formData?: {
      data: Record<string, unknown>
      signature?: string
      devicePhotos: Array<{
        name: string
        size: number
        type: string
        content: string
      }>
    },
    details?: {
      dataLogged: boolean,
      customerEmailSent: boolean,
      internalEmailSent: boolean,
      pdfUploaded: boolean,
      photoUploaded: boolean
    }
  } | null>(null)
  
  const signatureRef = useRef<SignatureCanvas>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [canvasCssSize, setCanvasCssSize] = useState<{ width: number; height: number }>({ width: 400, height: 200 })
  const [canvasReady, setCanvasReady] = useState<boolean>(false)

  // Ensure the signature canvas is sized correctly to device pixels to avoid pointer offset
  useEffect(() => {
    function resizeCanvasToContainer() {
      const container = canvasContainerRef.current
      if (!container) {
        // Retry after a short delay if container is not available
        setTimeout(resizeCanvasToContainer, 100)
        return
      }

      const rect = container.getBoundingClientRect()
      const cssWidth = Math.max(320, Math.floor(rect.width - 32)) // Subtract padding
      const cssHeight = 200
      setCanvasCssSize({ width: cssWidth, height: cssHeight })
      setCanvasReady(true)

      // Clear canvas after resize to avoid distorted strokes
      setTimeout(() => {
        if (signatureRef.current) {
          signatureRef.current.clear()
        }
      }, 0)
    }

    // Initial resize with delay to ensure DOM is ready
    const timer = setTimeout(resizeCanvasToContainer, 100)

    // Add resize listener
    window.addEventListener('resize', resizeCanvasToContainer)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', resizeCanvasToContainer)
    }
  }, [])

  // Additional effect to handle canvas initialization after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (signatureRef.current && canvasCssSize.width > 0) {
        // Force clear to ensure canvas is ready
        signatureRef.current.clear()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [canvasCssSize])

  // Initialize with one photo upload field
  useEffect(() => {
    if (devicePhotos.length === 0) {
      setDevicePhotos([null])
    }
  }, [devicePhotos.length])

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      customerName: '',
      phoneNumber: '',
      email: '',
      dropOffDate: '',
      pickUpDate: '',
      deviceType: '',
      deviceModel: '',
      deviceBrand: '',
      serialNumber: '',
      imeiNumber: '',
      deviceCondition: '',
      customCondition: '',
      functionCheck: {
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
    })
    setSignature('')
    setSignatureSaved(false)
    setDevicePhotos([])
  }

  // Simple authentication for internal use
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsAuthenticated(true)
      } else {
        alert(result.message || 'Invalid password. Please contact your administrator.')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      alert('Authentication failed. Please try again.')
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }


  const handleFunctionCheckChange = (functionName: keyof FormData['functionCheck'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      functionCheck: {
        ...prev.functionCheck,
        [functionName]: checked
      }
    }))
  }

  const clearSignature = () => {
    signatureRef.current?.clear()
    setSignature('')
  }

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL()
      setSignature(signatureData)
      setSignatureSaved(true)
      // Reset the saved indicator after 2 seconds
      setTimeout(() => setSignatureSaved(false), 2000)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      setDevicePhotos(prev => {
        const newPhotos = [...prev]
        newPhotos[index] = file
        return newPhotos
      })
    }
  }

  const addPhotoUpload = () => {
    setDevicePhotos(prev => [...prev, null])
  }

  const removePhoto = (index: number) => {
    setDevicePhotos(prev => prev.filter((_, i) => i !== index))
  }

  // Camera functions
  const startCamera = async (index: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })

      setCameraStream(stream)
      setCameraPhotoIndex(index)
      setIsCameraActive(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check camera permissions and try again.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setIsCameraActive(false)
    setCameraPhotoIndex(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || cameraPhotoIndex === null) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob && cameraPhotoIndex !== null) {
        const fileName = `camera-photo-${Date.now()}.jpg`
        const file = new File([blob], fileName, { type: 'image/jpeg' })

        setDevicePhotos(prev => {
          const newPhotos = [...prev]
          newPhotos[cameraPhotoIndex] = file
          return newPhotos
        })

        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Save signature
      if (signatureRef.current && !signature) {
        saveSignature()
      }

      // Prepare form data for submission
      const submissionData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submissionData.append(key, value.join(', '))
        } else if (typeof value === 'object' && value !== null) {
          // Handle objects like functionCheck
          submissionData.append(key, JSON.stringify(value))
        } else {
          submissionData.append(key, value)
        }
      })
      
      // Add signature
      if (signature) {
        submissionData.append('signature', signature)
      }

      // Add photos
      devicePhotos.forEach((photo, index) => {
        if (photo) {
          submissionData.append(`devicePhoto${index}`, photo)
        }
      })

      // Submit to API
      // console.log('Submitting form to API...')
      const response = await fetch('/api/repair-form/submit', {
        method: 'POST',
        body: submissionData
      })

      // console.log('API response status:', response.status)
      const result = await response.json()
      // console.log('API response:', result)

      if (response.ok) {
        // Reset form after successful submission to prevent old data persistence
        resetForm()

        setSubmitStatus({
          type: 'success',
          message: `Form submitted successfully! Case ID: ${result.caseId}`,
          downloadUrl: result.pdfDownloadUrl,
          formData: result.formData,
          details: {
            dataLogged: result.dataLogged,
            customerEmailSent: result.customerEmailSent,
            internalEmailSent: result.internalEmailSent,
            pdfUploaded: result.pdfUploaded,
            photoUploaded: result.photoUploaded
          }
        })
        
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit form'
        })
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      })
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!submitStatus || !submitStatus.downloadUrl) return

    setIsDownloadingPDF(true)

    try {
      // Extract case ID from download URL
      const caseIdMatch = submitStatus.downloadUrl.match(/\/([^\/]+)$/)
      if (!caseIdMatch) {
        throw new Error('Invalid download URL')
      }

      const caseId = caseIdMatch[1]

      // Make POST request with form data to download endpoint
      const response = await fetch(`/api/repair-form/download/${caseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: submitStatus.formData // Form data from submission response
        })
      })

      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `repair-form-${caseId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error downloading PDF:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Failed to download PDF. Please try again.'
      })
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-6">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Internal Repair Form Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              This form is for internal use only
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Access Form
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Device Repair Form
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Complete this form for each device repair. All fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="e.g., 0412 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Drop Off Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.dropOffDate}
                    onChange={(e) => handleInputChange('dropOffDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pick Up Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.pickUpDate}
                    onChange={(e) => handleInputChange('pickUpDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Device Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.deviceType}
                    onChange={(e) => handleInputChange('deviceType', e.target.value)}
                  >
                    <option value="">Select device type</option>
                    <option value="iPhone">iPhone</option>
                    <option value="Android Phone">Android Phone</option>
                    <option value="iPad">iPad</option>
                    <option value="Android Tablet">Android Tablet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device Brand *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.deviceBrand}
                    onChange={(e) => handleInputChange('deviceBrand', e.target.value)}
                    placeholder="e.g., Apple, Samsung, Google"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device Model *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.deviceModel}
                    onChange={(e) => handleInputChange('deviceModel', e.target.value)}
                    placeholder="e.g., iPhone 13 Pro, Galaxy S21"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="e.g., F2L987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IMEI Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.imeiNumber}
                    onChange={(e) => handleInputChange('imeiNumber', e.target.value)}
                    placeholder="e.g., 351234567890123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device Condition *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.deviceCondition}
                    onChange={(e) => handleInputChange('deviceCondition', e.target.value)}
                  >
                    <option value="">Select condition</option>
                    <option value="Water damaged">Water damaged</option>
                    <option value="Frame out of shape">Frame out of shape</option>
                    <option value="None of the above">None of the above</option>
                  </select>
                </div>
                {formData.deviceCondition === 'None of the above' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specify Condition *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Describe the device condition..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.customCondition}
                      onChange={(e) => handleInputChange('customCondition', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>


            {/* Function Check */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Function Check
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'mic', label: 'Mic' },
                  { key: 'earpieceSpeaker', label: 'Earpiece Speaker' },
                  { key: 'sensor', label: 'Sensor' },
                  { key: 'frontCamera', label: 'Front Camera' },
                  { key: 'backCamera', label: 'Back Camera' },
                  { key: 'rotation', label: 'Rotation' },
                  { key: 'signal', label: 'Signal' },
                  { key: 'lcdGlass', label: 'LCD & Glass' },
                  { key: 'charging', label: 'Charging' },
                  { key: 'volumeButton', label: 'Volume Button' },
                  { key: 'muteButton', label: 'Mute Button' },
                  { key: 'faceId', label: 'Face ID' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md dark:border-gray-600">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={formData.functionCheck[key as keyof FormData['functionCheck']]}
                        onChange={(e) => handleFunctionCheckChange(key as keyof FormData['functionCheck'], e.target.checked)}
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                    </label>
                    {formData.functionCheck[key as keyof FormData['functionCheck']] && (
                      <span className="text-green-600 font-semibold">✓ Pass</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Device Photos */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Device Documentation
              </h2>
              <div className="space-y-4">
                {devicePhotos.map((photo, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md dark:border-gray-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Device Photo {index + 1}
                        </label>
                        {photo && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            ✓ {photo.name} ({(photo.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                      {devicePhotos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Upload Options */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Upload from Device
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          onChange={(e) => handlePhotoUpload(e, index)}
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Take Photo with Camera
                        </label>
                        <button
                          type="button"
                          onClick={() => startCamera(index)}
                          className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Take Photo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {devicePhotos.length === 0 || devicePhotos[devicePhotos.length - 1] ? (
                  <button
                    type="button"
                    onClick={addPhotoUpload}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Add Another Photo (Optional)
                  </button>
                ) : null}

                {devicePhotos.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Upload photos of the device for better documentation (optional) - You can upload from device or take photos with your camera!
                  </div>
                )}
              </div>
            </div>

            {/* Warranty Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Warranty Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Warranty Repairs</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>SJD TECH warranties apply only to parts and services paid for and performed by SJD TECH.</li>
                    <li>Warranty claims are valid for manufacturer faults and subject to approval by SJD TECH Customer Service Team.</li>
                    <li>Lifetime warranty applies to screens in good working condition, excluding physical or water damage.</li>
                    <li>Device Repairs with No Warranty Include:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Motherboard repairs</li>
                        <li>Repairs completed with existing water damage found</li>
                      </ul>
                    </li>
                    <li>Three-Month Warranty Repairs Include: Battery, charging port, camera/lens, speaker, microphone, buttons, housing, Apple iPhone Incell screens and Apple Genuine screens (excluding physical and water damage).</li>
                    <li>Three-Month Samsung Warranty Include: OLED screens, frame service packs, and high-quality screens (excluding physical and water damage).</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Not Covered Under Warranty</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>Devices repaired by SJD TECH but subsequently repaired or disassembled by another service provider will void any SJD TECH -provided warranty.</li>
                    <li>The warranty applies only to services directly performed by SJD TECH.</li>
                    <li>Pre-existing water damage or water damage occurring after repair is not covered under warranty.</li>
                    <li>Devices with frame damage, including bent, twisted, or cracked frames, are not eligible for warranty coverage.</li>
                    <li>SJD TECH is not responsible for data loss resulting from repairs. Customers are advised to back up their data before.</li>
                    <li>Repairs involving motherboard issues, BYO parts, or improper handling void warranties.</li>
                    <li>An Apple battery replacement may impact the &quot;Battery Health&quot; app within iPhone settings. iOS 15 and later updates may show an &apos;unknown part&apos; warning.</li>
                    <li>Warranty claims require parts to be intact, with no physical damage such as scratches, dents, cracks or LCD damage.</li>
                    <li>Examples of instances not covered under warranty include, but are not limited to damaged screens, bent or twisted frames, signs of water ingress, and LCD damage without visible glass damage.</li>
                    <li>An assessment must be completed by SJD TECH to determine eligibility before any warranty is offered.</li>
                    <li>BYO Parts are not covered under any warranty.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Customer Signature */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Customer Signature
              </h2>
              <div ref={canvasContainerRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Signature *
                </label>
                <div className="relative border border-gray-300 rounded-md p-4 bg-white min-h-[200px] flex items-center justify-center">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      width: canvasCssSize.width || 400,
                      height: canvasCssSize.height || 200,
                      className: 'signature-canvas border border-gray-200 rounded',
                      style: {
                        width: '100%',
                        height: '200px',
                        maxWidth: '100%',
                        touchAction: 'none' // Prevent scrolling on touch devices
                      }
                    }}
                    onEnd={saveSignature}
                  />
                  {!canvasReady && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm bg-gray-50 rounded">
                      Loading signature canvas...
                    </div>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    Clear Signature
                  </button>
                  <button
                    type="button"
                    onClick={saveSignature}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      signatureSaved
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {signatureSaved ? '✓ Saved' : 'Save Signature'}
                  </button>
                </div>
              </div>
            </div>


            {/* Submit Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              {submitStatus && (
                <div className={`mb-4 p-4 rounded-md ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="font-medium mb-2">{submitStatus.message}</div>

                  {submitStatus.type === 'success' && submitStatus.caseId && (
                    <div className="text-sm font-medium text-green-700 mb-2">
                      Case ID: {submitStatus.caseId}
                    </div>
                  )}

                  {submitStatus.type === 'success' && submitStatus.details && (
                    <div className="text-sm space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${submitStatus.details.dataLogged ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        Data logged: {submitStatus.details.dataLogged ? '✅ Yes' : '❌ No'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${submitStatus.details.customerEmailSent ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        Customer email sent: {submitStatus.details.customerEmailSent ? '✅ Yes' : '❌ No'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${submitStatus.details.internalEmailSent ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        Internal email sent: {submitStatus.details.internalEmailSent ? '✅ Yes' : '❌ No'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${submitStatus.details.photoUploaded ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        Photo uploaded: {submitStatus.details.photoUploaded ? '✅ Yes' : '❌ No'}
                      </div>
                    </div>
                  )}

                  {submitStatus.type === 'success' && submitStatus.downloadUrl && (
                    <div className="mt-3">
                      <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloadingPDF}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {isDownloadingPDF ? 'Downloading...' : 'Download PDF'}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Repair Form'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Take Photo
              </h3>

              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 bg-black rounded-lg object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Position the device and tap Capture Photo to take a picture
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
 )
}
