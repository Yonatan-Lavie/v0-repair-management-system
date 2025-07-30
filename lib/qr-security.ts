// QR Code security and validation

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

class QRSecurityManager {
  private static instance: QRSecurityManager
  private readonly SECRET_KEY = process.env.QR_SECRET || "qr-secret-key"
  private readonly EXPIRY_HOURS = 24 * 30 // 30 days

  static getInstance(): QRSecurityManager {
    if (!QRSecurityManager.instance) {
      QRSecurityManager.instance = new QRSecurityManager()
    }
    return QRSecurityManager.instance
  }

  // Generate secure QR data
  generateQRData(params: {
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
    const expiresAt = timestamp + this.EXPIRY_HOURS * 60 * 60 * 1000

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

    const signature = this.generateSignature(dataToSign)

    return {
      ...dataToSign,
      signature,
    }
  }

  // Validate QR data
  validateQRData(qrData: QRData): { valid: boolean; error?: string } {
    try {
      // Check expiration
      if (Date.now() > qrData.expiresAt) {
        return { valid: false, error: "QR Code פג תוקף" }
      }

      // Verify signature
      const expectedSignature = this.generateSignature({
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
      })

      if (expectedSignature !== qrData.signature) {
        return { valid: false, error: "QR Code לא תקין" }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: "שגיאה בבדיקת QR Code" }
    }
  }

  // Generate signature for QR data
  private generateSignature(data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort())
    return createHmac("sha256", this.SECRET_KEY).update(dataString).digest("hex")
  }

  // Encode QR data to string
  encodeQRData(qrData: QRData): string {
    const encoded = Buffer.from(JSON.stringify(qrData)).toString("base64")
    return encoded
  }

  // Decode QR data from string
  decodeQRData(encoded: string): QRData | null {
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8")
      return JSON.parse(decoded) as QRData
    } catch (error) {
      console.error("Failed to decode QR data:", error)
      return null
    }
  }

  // Generate QR URL with security
  generateSecureQRURL(params: {
    repairId: string
    type: "product" | "customer"
    shopId?: string
    customerId?: string
    productType?: string
    productBrand?: string
    productModel?: string
    serialNumber?: string
  }): string {
    const qrData = this.generateQRData(params)
    const encoded = this.encodeQRData(qrData)

    // In a real app, this would be your domain
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://repair-system.com"

    if (params.type === "customer") {
      return `${baseUrl}/customer/track?data=${encoded}`
    } else {
      return `${baseUrl}/scan/product?data=${encoded}`
    }
  }

  // Validate scanned QR URL
  validateScannedQR(url: string): { valid: boolean; data?: QRData; error?: string } {
    try {
      const urlObj = new URL(url)
      const encodedData = urlObj.searchParams.get("data")

      if (!encodedData) {
        return { valid: false, error: "QR Code לא תקין" }
      }

      const qrData = this.decodeQRData(encodedData)
      if (!qrData) {
        return { valid: false, error: "לא ניתן לפענח QR Code" }
      }

      const validation = this.validateQRData(qrData)
      if (!validation.valid) {
        return validation
      }

      return { valid: true, data: qrData }
    } catch (error) {
      return { valid: false, error: "QR Code לא תקין" }
    }
  }
}

export const qrSecurity = QRSecurityManager.getInstance()
