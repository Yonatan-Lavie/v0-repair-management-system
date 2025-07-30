"use client"

import { AlertDescription } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Scan, QrCode, CheckCircle } from "lucide-react"
import Link from "next/link"
import { qrSecurity } from "@/lib/qr-security" // Import qrSecurity and QRData

// Mock scan results (will be replaced by actual QR data validation)
const mockScanResults = {
  REPAIR001: {
    repairId: "REPAIR001",
    customerName: "רועי כהן",
    product: "טבעת יהלום",
    issue: "שריטה בטבעת",
    status: "ממתין לאיסוף",
    qrType: "product",
  },
  REPAIR002: {
    repairId: "REPAIR002",
    customerName: "מאיה לוי",
    product: "שרשרת זהב",
    issue: "אבן חסרה",
    status: "בתהליך תיקון",
    qrType: "customer",
  },
}

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanStep, setScanStep] = useState<"waiting" | "scanned" | "verified">("waiting")
  const [qrError, setQrError] = useState<string | null>(null)

  const simulateScan = (encodedData: string) => {
    setQrError(null)
    const validationResult = qrSecurity.validateScannedQR(`https://repair-system.com/scan/product?data=${encodedData}`)

    if (validationResult.valid && validationResult.data) {
      const qrData = validationResult.data
      // Simulate fetching repair details based on repairId from QR
      const simulatedRepair = mockScanResults[qrData.repairId as keyof typeof mockScanResults]
      if (simulatedRepair) {
        setScanResult({
          ...simulatedRepair,
          qrType: qrData.type,
          product: `${qrData.productBrand || ""} ${qrData.productModel || ""} ${qrData.productType || ""}`.trim(),
          serialNumber: qrData.serialNumber,
        })
        setScanStep("scanned")
      } else {
        setQrError("תיקון לא נמצא במערכת")
      }
    } else {
      setQrError(validationResult.error || "QR Code לא תקין")
    }
  }

  const handleVerifyDelivery = () => {
    setScanStep("verified")
  }

  const resetScan = () => {
    setScanResult(null)
    setScanStep("waiting")
    setQrError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link href="/seller/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזור
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">סריקת QR</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {scanStep === "waiting" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                סרוק QR Code
              </CardTitle>
              <CardDescription>סרוק QR של תכשיט או לקוח לעדכון סטטוס או אימות מסירה</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">מקם את המצלמה מול QR Code</p>
                  </div>
                </div>

                {qrError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{qrError}</AlertDescription>
                  </Alert>
                )}

                {/* Demo buttons - generate actual encoded QR data */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">לצורך הדמו - בחר QR לסימולציה:</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        simulateScan(
                          qrSecurity.encodeQRData(
                            qrSecurity.generateQRData({
                              repairId: "REPAIR001",
                              type: "product",
                              shopId: "SHOP001",
                              productType: "טבעת",
                              productBrand: "Tiffany & Co.",
                              productModel: "Solitaire Diamond Ring",
                              serialNumber: "TIF123456789",
                            }),
                          ),
                        )
                      }
                    >
                      סרוק QR תכשיט (REPAIR001)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        simulateScan(
                          qrSecurity.encodeQRData(
                            qrSecurity.generateQRData({
                              repairId: "REPAIR002",
                              type: "customer",
                              shopId: "SHOP001",
                              customerId: "CUST002",
                            }),
                          ),
                        )
                      }
                    >
                      סרוק QR לקוח (REPAIR002)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {scanStep === "scanned" && scanResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                QR נסרק בהצלחה
              </CardTitle>
              <CardDescription>מזהה תיקון: {scanResult.repairId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">לקוח</p>
                    <p className="font-semibold">{scanResult.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">תכשיט</p>
                    <p className="font-semibold">{scanResult.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">תקלה</p>
                    <p className="font-semibold">{scanResult.issue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">סטטוס נוכחי</p>
                    <Badge variant="default">{scanResult.status}</Badge>
                  </div>
                </div>
              </div>

              {scanResult.qrType === "product" && scanResult.status === "ממתין לאיסוף" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-semibold mb-2">התכשיט מוכן למסירה!</p>
                    <p className="text-blue-700 text-sm">כעת סרוק את QR הלקוח לאימות זהות ומסירת התכשיט</p>
                  </div>
                  <Button className="w-full" onClick={handleVerifyDelivery}>
                    המשך לאימות מסירה
                  </Button>
                </div>
              )}

              {scanResult.qrType === "customer" && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold mb-2">זהות לקוח אומתה!</p>
                    <p className="text-green-700 text-sm">ניתן למסור את התכשיט ללקוח</p>
                  </div>
                  <Button className="w-full" onClick={handleVerifyDelivery}>
                    אשר מסירה ללקוח
                  </Button>
                </div>
              )}

              <Button variant="outline" onClick={resetScan} className="w-full bg-transparent">
                סרוק QR נוסף
              </Button>
            </CardContent>
          </Card>
        )}

        {scanStep === "verified" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                מסירה אושרה בהצלחה!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">התכשיט נמסר ללקוח</h3>
                <p className="text-gray-600 mb-6">התיקון {scanResult?.repairId} הושלם בהצלחה</p>
                <div className="flex gap-4">
                  <Button onClick={resetScan} className="flex-1">
                    סרוק QR נוסף
                  </Button>
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/seller/dashboard">חזור לדשבורד</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
