import nodemailer from 'nodemailer'

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

// Email configuration for PDF delivery
const EMAIL_CONFIG = {
  HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  PORT: parseInt(process.env.SMTP_PORT || '587'),
  USER: process.env.EMAIL_USER || 'PLACEHOLDER_EMAIL_USER',
  PASS: process.env.EMAIL_PASSWORD || 'PLACEHOLDER_EMAIL_PASSWORD',
  FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'PLACEHOLDER_FROM_EMAIL',
  TO: process.env.EMAIL_TO || 'PLACEHOLDER_TO_EMAIL'
}

// Send customer email (no PDF attachment)
export async function sendCustomerEmail(data: RepairFormData, caseId: string): Promise<boolean> {
  try {
    // Check if email configuration is available
    if (!EMAIL_CONFIG.USER || !EMAIL_CONFIG.PASS || !data.email) {
      // console.log('Customer email configuration not available, skipping customer email')
      return false
    }

    // console.log('Sending customer notification email...')

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.HOST,
      port: EMAIL_CONFIG.PORT,
      secure: EMAIL_CONFIG.PORT === 465,
      auth: {
        user: EMAIL_CONFIG.USER,
        pass: EMAIL_CONFIG.PASS,
      }
    })

    // Customer email content - warm and friendly
    const customerMailOptions = {
      from: `"SJD Phone Repair" <${EMAIL_CONFIG.FROM}>`,
      to: data.email,
      subject: `Thank you for choosing SJD Phone Repair - ${caseId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Repair Form Confirmation</title>
        </head>
        <body style="background: #f8fafc; font-family: system-ui, sans-serif; margin: 0; padding: 0;">
          <div style="max-width: 420px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); padding: 32px 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 1.25rem; color: #222;">Thank you, ${data.customerName}!</h2>
            <p style="margin: 0 0 16px 0; color: #444;">
              We have received your repair request for your ${data.deviceBrand} ${data.deviceModel}.
            </p>
            <p style="margin: 0 0 24px 0; color: #444;">
              We appreciate your trust in SJD Tech Phone & Tablet Repairs.
            </p>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px;">
              <h3 style="font-size: 1rem; margin: 0 0 12px 0; color: #222;">Case Information</h3>
              <table style="width: 100%; font-size: 0.97rem; color: #333; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; font-weight: 500;">Customer</td>
                  <td style="padding: 4px 0;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 500;">Phone</td>
                  <td style="padding: 4px 0;">${data.phoneNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 500;">Device</td>
                  <td style="padding: 4px 0;">${data.deviceBrand} ${data.deviceModel}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 500;">Condition</td>
                  <td style="padding: 4px 0;">${data.deviceCondition}</td>
                </tr>
                ${data.deviceCondition === 'None of the above' && data.customCondition ? `<tr>
                  <td style="padding: 4px 0; font-weight: 500;">Specify Condition</td>
                  <td style="padding: 4px 0;">${data.customCondition}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 4px 0; font-weight: 500;">Drop-off</td>
                  <td style="padding: 4px 0;">${data.dropOffDate}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 500;">Pick-up</td>
                  <td style="padding: 4px 0;">${data.pickUpDate || 'Not specified'}</td>
                </tr>
              </table>
            </div>
            <p style="margin: 24px 0 0 0; color: #222; font-size: 0.97rem;">
              Regards,<br>
              <strong>SJD Tech Phone & Tablet Repairs Team</strong>
            </p>
          </div>
        </body>
        </html>
      `
    }

    // Send customer email
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _customerInfo = await transporter.sendMail(customerMailOptions)
    // console.log('✅ Customer email sent successfully!')
    // console.log(`📧 Customer Message ID: ${_customerInfo.messageId}`)

    return true
  } catch (error) {
    console.error('Error sending customer email:', error)
    return false
  }
}

// Send internal email (with PDF attachment and original images)
export async function sendInternalEmail(pdfBuffer: Buffer, data: RepairFormData, caseId: string, devicePhotos: File[]): Promise<boolean> {
  try {
    // Check if email configuration is available
    if (!EMAIL_CONFIG.USER || !EMAIL_CONFIG.PASS) {
      // console.log('Internal email configuration not available, skipping internal email')
      return false
    }

    // console.log('Sending internal notification email...')

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.HOST,
      port: EMAIL_CONFIG.PORT,
      secure: EMAIL_CONFIG.PORT === 465,
      auth: {
        user: EMAIL_CONFIG.USER,
        pass: EMAIL_CONFIG.PASS,
      }
    })

    // Generate PDF filename
    const pdfFilename = `${caseId}.pdf`

    // Create attachments array with PDF and original images
    const attachments = [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]

    // Add original images as separate attachments with entry ID naming
    for (let i = 0; i < devicePhotos.length; i++) {
      const photo = devicePhotos[i]
      try {
        const arrayBuffer = await photo.arrayBuffer()
        const imageBuffer = Buffer.from(arrayBuffer)

        // Generate filename with entry ID and index
        const fileExtension = photo.name.split('.').pop()?.toLowerCase() || 'jpg'
        const imageFilename = `${caseId}-image-${String(i + 1).padStart(2, '0')}.${fileExtension}`

        attachments.push({
          filename: imageFilename,
          content: imageBuffer,
          contentType: photo.type
        })

        // Image attachment added
      } catch (error) {
        console.error(`Error processing image ${i + 1} for attachment:`, error)
      }
    }

    // Internal email content - basic information only
    const internalMailOptions = {
      from: `"SJD Repair System" <${EMAIL_CONFIG.FROM}>`,
      to: EMAIL_CONFIG.TO, // Primary recipient (client email)
      bcc: 'rsbb0818@gmail.com', // BCC copy to you
      subject: `Repair Form - ${caseId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">

            <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 18px;">INTERNAL NOTIFICATION</h2>

            <p style="margin: 0 0 20px 0; color: #374151;">New repair form submission received:</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #374151;">Case ID:</td>
                <td style="padding: 5px 0; color: #1f2937;">${caseId}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #374151;">Customer:</td>
                <td style="padding: 5px 0; color: #1f2937;">${data.customerName}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 5px 0; color: #1f2937;">${data.phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #374151;">Device:</td>
                <td style="padding: 5px 0; color: #1f2937;">${data.deviceBrand} ${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #374151;">Condition:</td>
                <td style="padding: 5px 0; color: #1f2937;">${data.deviceCondition}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #374151;">Drop-off:</td>
                <td style="padding: 5px 0; color: #1f2937;">${data.dropOffDate}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #374151;">Pick-up:</td>
                <td style="padding: 5px 0; color: #1f2937;">${data.pickUpDate || 'Not specified'}</td>
              </tr>
            </table>

            <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
              Complete details are attached as PDF. Original images are also attached separately.
            </p>

          </div>
        </body>
        </html>
      `,
      attachments: attachments
    }

    // Send internal email with increased timeout for large attachments
    // console.log('Sending internal email with PDF attachment...')
    try {
      const emailPromise = transporter.sendMail(internalMailOptions)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email timeout after 120 seconds')), 120000)
      )

      await Promise.race([emailPromise, timeoutPromise])
      // console.log('✅ Internal email sent successfully!')

      return true
    } catch (emailError) {
      console.error('Internal email sending failed:', (emailError as Error)?.message || 'Unknown error')
      return false
    }
  } catch (error) {
    console.error('Error sending PDF via email:', error)
    return false
  }
}
