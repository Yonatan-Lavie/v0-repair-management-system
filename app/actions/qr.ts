"use server"

import { qrCore, type QRData } from "@/lib/qr-security"

const BASE_QR_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://repair-system.com"

export async function generateSecureQRURL(params: {
  repairId: string
  type: "product" | "customer"
  shopId?: string
  customerId?: string
  productType?: string
  productBrand?: string
  productModel?: string
  serialNumber?: string
}): Promise<string> {
  const qrData = qrCore.generateQRData(params)
  const encoded = qrCore.encodeQRData(qrData)

  // In a real app, this would be your domain
  if (params.type === "customer") {
    return `${BASE_QR_URL}/customer/track?data=${encoded}`
  } else {
    return `${BASE_QR_URL}/scan/product?data=${encoded}`
  }
}

export async function validateScannedQR(url: string): Promise<{ valid: boolean; data?: QRData; error?: string }> {
  try {
    const urlObj = new URL(url)
    const encodedData = urlObj.searchParams.get("data")

    if (!encodedData) {
      return { valid: false, error: "QR Code לא תקין" }
    }

    const qrData = qrCore.decodeQRData(encodedData)
    if (!qrData) {
      return { valid: false, error: "לא ניתן לפענח QR Code" }
    }

    const validation = qrCore.validateQRData(qrData)
    if (!validation.valid) {
      return validation
    }

    return { valid: true, data: qrData }
  } catch (error) {
    return { valid: false, error: "QR Code לא תקין" }
  }
}
