import { sign, verify } from "jsonwebtoken"

// Define the structure for QR code data
interface QRData {
  repairId: string
  type: "product" | "customer"
  shopId?: string
  // Product specific fields
  productType?: string
  productBrand?: string
  productModel?: string
  serialNumber?: string // Changed from imei
  // Customer specific fields
  customerId?: string
  customerName?: string
  // Security fields
  iat?: number // Issued at
  exp?: number // Expiration time
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkeyforjewelryrepairsystem"
const QR_SECRET = process.env.QR_SECRET || "supersecretqrkeyforjewelryrepairsystem"
const BASE_QR_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com/qr" // Base URL for QR code generation

export const qrSecurity = {
  /**
   * Generates a secure QR code URL containing signed data.
   * @param data The data to embed in the QR code.
   * @returns A URL string that can be used to generate a QR code image.
   */
  generateSecureQRURL: (data: Partial<QRData>): string => {
    const payload: QRData = {
      ...data,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // Valid for 1 year
    }
    const token = sign(payload, QR_SECRET, { algorithm: "HS256" })
    // Use a QR code API that accepts data as a URL parameter
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${BASE_QR_URL}?token=${token}`)}`
  },

  /**
   * Verifies and parses the data from a QR code URL.
   * @param qrUrl The full QR code URL (e.g., from a scan).
   * @returns The parsed QRData if valid, otherwise null.
   */
  verifyAndParseQR: (qrUrl: string): QRData | null => {
    try {
      const url = new URL(qrUrl)
      const token = url.searchParams.get("token")

      if (!token) {
        throw new Error("QR token not found in URL.")
      }

      const decoded = verify(token, QR_SECRET, { algorithms: ["HS256"] }) as QRData
      return decoded
    } catch (error) {
      console.error("QR verification failed:", error)
      return null
    }
  },

  /**
   * Generates raw QR data (for internal use or direct embedding if not using URL).
   * @param data The data to generate.
   * @returns The signed JWT token.
   */
  generateQRData: (data: Partial<QRData>): string => {
    const payload: QRData = {
      ...data,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // Valid for 1 year
    }
    return sign(payload, QR_SECRET, { algorithm: "HS256" })
  },
}
