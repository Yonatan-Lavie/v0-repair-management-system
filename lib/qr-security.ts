// QR Code security and validation - Core logic (server-side only)

import { createHmac } from "crypto"

export interface QRData {
  repairId: string
  type: "product" | "customer"
  timestamp: number
  expiresAt: number
  signature: string
  shopId?: string
  customerId?: string
  productType?: string // Added for jewelry
  productBrand?: string // Added for jewelry
  productModel?: string // Added for jewelry
  serialNumber?: string // Changed from productId for jewelry
}

const QR_SECRET = process.env.QR_SECRET || "qr-secret-key"
const EXPIRY_HOURS = 24 * 30 // 30 days

// Generate secure QR data
function _generateQRData(params: {
  repairId: string
  type: "product" | "customer"
  shopId?: string
  customerId?: string
  productType?: string
  productBrand?: string
  productModel?: string
  serialNumber?: string
}): QRData {
  const timestamp = Date.now()
  const expiresAt = timestamp + EXPIRY_HOURS * 60 * 60 * 1000

  const dataToSign = {
    repairId: params.repairId,
    type: params.type,
    timestamp,
    expiresAt,
    shopId: params.shopId,
    customerId: params.customerId,
    productType: params.productType,
    productBrand: params.productBrand,
    productModel: params.productModel,
    serialNumber: params.serialNumber,
  }

  const signature = createHmac("sha256", QR_SECRET)
    .update(JSON.stringify(dataToSign, Object.keys(dataToSign).sort()))
    .digest("hex")

  return {
    ...dataToSign,
    signature,
  }
}

// Validate QR data
function _validateQRData(qrData: QRData): { valid: boolean; error?: string } {
  try {
    // Check expiration
    if (Date.now() > qrData.expiresAt) {
      return { valid: false, error: "QR Code פג תוקף" }
    }

    // Verify signature
    const dataToSign = {
      repairId: qrData.repairId,
      type: qrData.type,
      timestamp: qrData.timestamp,
      expiresAt: qrData.expiresAt,
      shopId: qrData.shopId,
      customerId: qrData.customerId,
      productType: qrData.productType,
      productBrand: qrData.productBrand,
      productModel: qrData.productModel,
      serialNumber: qrData.serialNumber,
    }
    const expectedSignature = createHmac("sha256", QR_SECRET)
      .update(JSON.stringify(dataToSign, Object.keys(dataToSign).sort()))
      .digest("hex")

    if (expectedSignature !== qrData.signature) {
      return { valid: false, error: "QR Code לא תקין" }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: "שגיאה בבדיקת QR Code" }
  }
}

// Encode QR data to string
function _encodeQRData(qrData: QRData): string {
  const encoded = Buffer.from(JSON.stringify(qrData)).toString("base64")
  return encoded
}

// Decode QR data from string
function _decodeQRData(encoded: string): QRData | null {
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8")
    return JSON.parse(decoded) as QRData
  } catch (error) {
    console.error("Failed to decode QR data:", error)
    return null
  }
}

// Export core functions for use in Server Actions
export const qrCore = {
  generateQRData: _generateQRData,
  validateQRData: _validateQRData,
  encodeQRData: _encodeQRData,
  decodeQRData: _decodeQRData,
}
