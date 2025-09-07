import jsPDF from 'jspdf'

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

// Simplified PDF generation with minimal styling
export async function generatePDF(data: RepairFormData, caseId: string, signature?: string, devicePhotos: File[] = []): Promise<Buffer> {
  const doc = new jsPDF()

  // Single pure black color for all text
  const textColor: [number, number, number] = [0, 0, 0]

  let yPosition = 20
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  const lineHeight = 6

  // Header - consistent font and color
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)
  doc.text('SJD Tech Phone & Tablet Repairs', margin, yPosition)
  yPosition += 12

  // Reference info - removed (Case ID moved to customer section)
  yPosition += 8

  // Consistent field display function
  const addField = (label: string, value: string) => {
    if (yPosition > pageHeight - 25) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...textColor)
    doc.text(`${label}:`, margin, yPosition)

    const labelWidth = doc.getTextWidth(`${label}:`) + 3
    const valueWidth = contentWidth - labelWidth
    const lines = doc.splitTextToSize(value || 'Not specified', valueWidth)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textColor)
    doc.text(lines, margin + labelWidth, yPosition)

    yPosition += Math.max(lineHeight, lines.length * lineHeight) + 2
  }

  // Customer Information Section - consistent header
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)
  doc.text('CUSTOMER INFORMATION', margin, yPosition)
  yPosition += 8

  addField('Case ID', caseId)
  addField('Full Name', data.customerName)
  addField('Phone Number', data.phoneNumber)
  addField('Email Address', data.email)
  addField('Drop Off Date', data.dropOffDate)
  addField('Pick Up Date', data.pickUpDate || 'Not specified')

  yPosition += 8

  // Device Information Section - consistent header
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)
  doc.text('DEVICE INFORMATION', margin, yPosition)
  yPosition += 8

  addField('Device Type', data.deviceType)
  addField('Device Brand', data.deviceBrand)
  addField('Device Model', data.deviceModel)
  addField('Serial Number', data.serialNumber || 'Not specified')
  addField('IMEI Number', data.imeiNumber || 'Not specified')
  addField('Device Condition', data.deviceCondition || 'Not specified')
  if (data.deviceCondition === 'None of the above' && data.customCondition) {
    addField('Specify Condition', data.customCondition)
  }

  yPosition += 8

  // Function Check Section - consistent header
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)
  doc.text('FUNCTION CHECK', margin, yPosition)
  yPosition += 8

  const functionTests = [
    { key: 'mic', label: 'Microphone' },
    { key: 'earpieceSpeaker', label: 'Earpiece Speaker' },
    { key: 'sensor', label: 'Proximity Sensor' },
    { key: 'frontCamera', label: 'Front Camera' },
    { key: 'backCamera', label: 'Back Camera' },
    { key: 'rotation', label: 'Auto Rotation' },
    { key: 'signal', label: 'Cellular Signal' },
    { key: 'lcdGlass', label: 'LCD & Glass' },
    { key: 'charging', label: 'Charging Port' },
    { key: 'volumeButton', label: 'Volume Button' },
    { key: 'muteButton', label: 'Mute Button' },
    { key: 'faceId', label: 'Face ID' }
  ]

  functionTests.forEach((test) => {
    if (yPosition > pageHeight - 25) {
      doc.addPage()
      yPosition = 20
    }

    const passed = data.functionCheck[test.key as keyof typeof data.functionCheck]
    const status = passed ? 'PASS' : 'FAIL'

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textColor)
    doc.text(`${test.label}:`, margin, yPosition)

    doc.setFont('helvetica', 'bold')
    // Color coding for PASS/FAIL results
    if (passed) {
      doc.setTextColor(0, 128, 0) // Dark green for PASS
    } else {
      doc.setTextColor(220, 20, 60) // Crimson red for FAIL
    }
    doc.text(status, margin + 80, yPosition)

    // Reset to black for next items
    doc.setTextColor(...textColor)

    yPosition += lineHeight + 2
  })

  yPosition += 8

  // Device Photos Section - consistent header
  if (devicePhotos && devicePhotos.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...textColor)
    doc.text('DEVICE PHOTOS', margin, yPosition)
    yPosition += 8

    // List image filenames without embedding them - smaller fonts
    for (let i = 0; i < devicePhotos.length; i++) {
      const photo = devicePhotos[i]

      // Generate filename matching email attachment format
      const fileExtension = photo.name.split('.').pop()?.toLowerCase() || 'jpg'
      const imageFilename = `${caseId}-image-${String(i + 1).padStart(2, '0')}.${fileExtension}`

      // Calculate file size for display
      const sizeMB = (photo.size / 1024 / 1024).toFixed(2)
      const sizeKB = (photo.size / 1024).toFixed(1)
      const displaySize = photo.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`

      if (yPosition > pageHeight - 25) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...textColor)

      // Wrap filename if too long
      const filenameText = `• ${imageFilename} (${displaySize})`
      const wrappedFilename = doc.splitTextToSize(filenameText, contentWidth)
      doc.text(wrappedFilename, margin, yPosition)
      yPosition += Math.max(lineHeight + 1, wrappedFilename.length * (lineHeight + 1))
    }

    // Add note about attachments - consistent font and color
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textColor)

    // Wrap text to fit within page margins
    const noteText = 'Note: Images are attached separately to this email for optimal quality.'
    const wrappedNote = doc.splitTextToSize(noteText, contentWidth)
    doc.text(wrappedNote, margin, yPosition)
    yPosition += Math.max(lineHeight + 3, wrappedNote.length * (lineHeight + 1))
  }


  // Warranty Information Section - consistent header
  if (yPosition > pageHeight - 120) {
    doc.addPage()
    yPosition = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)
  doc.text('WARRANTY INFORMATION', margin, yPosition)
  yPosition += 8

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)

  // Warranty Repairs - consistent font
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('WARRANTY REPAIRS:', margin, yPosition)
  yPosition += 6
  const warrantyRepairs = [
    '1. SJD TECH warranties apply only to parts and services paid for and performed by SJD TECH.',
    '2. Warranty claims are valid for manufacturer faults and subject to approval by SJD TECH Customer Service Team.',
    '3. Lifetime warranty applies to screens in good working condition, excluding physical or water damage.',
    '4. Device Repairs with No Warranty Include: Motherboard repairs, Repairs completed with existing water damage found',
    '5. Three-Month Warranty Repairs Include: Battery, charging port, camera/lens, speaker, microphone, buttons, housing, Apple iPhone Incell screens and Apple Genuine screens (excluding physical and water damage).',
    '6. Three-Month Samsung Warranty Include: OLED screens, frame service packs, and high-quality screens (excluding physical and water damage).'
  ]

  warrantyRepairs.forEach(line => {
    if (yPosition > pageHeight - 18) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textColor)

    // Wrap text to fit within page margins
    const wrappedLines = doc.splitTextToSize(line, contentWidth - 6)
    doc.text(wrappedLines, margin + 3, yPosition)
    yPosition += Math.max(4.5, wrappedLines.length * 4.5)
  })

  yPosition += 4

  // Not Covered Under Warranty - consistent font
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('NOT COVERED UNDER WARRANTY:', margin, yPosition)
  yPosition += 6
  const notCovered = [
    '1. Devices repaired by SJD TECH but subsequently repaired or disassembled by another service provider will void any SJD TECH -provided warranty.',
    '2. The warranty applies only to services directly performed by SJD TECH.',
    '3. Pre-existing water damage or water damage occurring after repair is not covered under warranty.',
    '4. Devices with frame damage, including bent, twisted, or cracked frames, are not eligible for warranty coverage.',
    '5. SJD TECH is not responsible for data loss resulting from repairs. Customers are advised to back up their data before.',
    '6. Repairs involving motherboard issues, BYO parts, or improper handling void warranties.',
    '7. An Apple battery replacement may impact the "Battery Health" app within iPhone settings. iOS 15 and later updates may show an \'unknown part\' warning.',
    '8. Warranty claims require parts to be intact, with no physical damage such as scratches, dents, cracks or LCD damage.',
    '9. Examples of instances not covered under warranty include, but are not limited to damaged screens, bent or twisted frames, signs of water ingress, and LCD damage without visible glass damage.',
    '10. An assessment must be completed by SJD TECH to determine eligibility before any warranty is offered.',
    '11. BYO Parts are not covered under any warranty.'
  ]

  notCovered.forEach(line => {
    if (yPosition > pageHeight - 18) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textColor)

    // Wrap text to fit within page margins
    const wrappedLines = doc.splitTextToSize(line, contentWidth - 6)
    doc.text(wrappedLines, margin + 3, yPosition)
    yPosition += Math.max(4.5, wrappedLines.length * 4.5)
  })

  yPosition += 8

  // Customer Signature Section - after warranty
  if (signature) {
    if (yPosition > pageHeight - 50) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...textColor)
    doc.text('CUSTOMER SIGNATURE', margin, yPosition)
    yPosition += 8

    // Simple signature box - consistent colors
    doc.setDrawColor(...textColor)
    doc.setLineWidth(1)
    doc.setFillColor(255, 255, 255)
    const sigWidth = Math.min(100, contentWidth)
    const sigHeight = 35
    doc.roundedRect(margin, yPosition, sigWidth, sigHeight, 3, 3, 'FD')

    try {
      // Add signature image if available
      if (signature.startsWith('data:image/')) {
        doc.addImage(signature, 'PNG', margin + 3, yPosition + 3, sigWidth - 6, sigHeight - 8)
      }

      // Signature verification text - consistent font and color
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...textColor)
      doc.text(`Digitally signed: ${new Date().toLocaleDateString()}`, margin + 3, yPosition + sigHeight + 3)
    } catch (error) {
      console.error('Error adding signature to PDF:', error)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...textColor)
      doc.text('Signature captured and stored securely', margin + 3, yPosition + 10)
      doc.setFontSize(10)
      doc.setTextColor(...textColor)
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin + 3, yPosition + 17)
    }

    yPosition += sigHeight + 15
  }

  // Footer - consistent font and color
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)

  const footerY = pageHeight - 12
  doc.text('SJD Tech Phone & Tablet Repairs - Professional Device Repair Services', margin, footerY)
  doc.text(`Generated: ${new Date().toLocaleString()} | Case ID: ${caseId}`, margin, footerY + 4)

  return Buffer.from(doc.output('arraybuffer'))
}
