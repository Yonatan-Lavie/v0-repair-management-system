"use client"

import { AlertDescription } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Scan, QrCode, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { qrSecurity } from "@/lib/qr-security" // Import qrSecurity
import { statusManager } from "@/lib/status-manager" // Import statusManager
import { authManager } from "@/lib/auth" // Import authManager

// Mock scan results for technician (will be replaced by actual QR data validation)
const mockTechnicianScanResults = {
  REPAIR002: {
    repairId: "REPAIR002",
    product: "שרשרת זהב",
    issue: "אבן חסרה",
    status: "נשלח לתיקון",
    canAccept: true,
  },
  REPAIR005: {
    repairId: "REPAIR005",
    product: "צמיד כסף",
    issue: "הקטנת צמיד",
    status: "בתהליך תיקון",
    canAccept: false,
  },
}

export default function TechnicianScan() {
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanStep, setScanStep] = useState<"waiting" | "scanned" | "accepted">("waiting")
  const [qrError, setQrError] = useState<string | null>(null)

  const simulateScan = (encodedData: string) => {
    setQrError(null)
    const validationResult = qrSecurity.validateScannedQR(`https://repair-system.com/scan/product?data=${encodedData}`)

    if (validationResult.valid && validationResult.data) {
      const qrData = validationResult.data
      // Simulate fetching repair details based on repairId from QR
      const simulatedRepair = mockTechnicianScanResults[qrData.repairId as keyof typeof mockTechnicianScanResults]
      if (simulatedRepair) {
        setScanResult({
          ...simulatedRepair,
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

  const acceptRepair = () => {
    if (scanResult?.repairId) {
      const currentUser = authManager.getCurrentSession()?.user.name || "טכנאי לא ידוע"
      statusManager.updateStatus(scanResult.repairId, "התקבל", currentUser, "התכשיט התקבל במעבדה")
      setScanStep("accepted")
    }
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
              <Link href="/technician/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזור
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">סריקת QR - צורף/טכנאי</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {scanStep === "waiting" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                סרוק QR של תכשיט
              </CardTitle>
              <CardDescription>סרוק את QR המודבק על השקית לקבלת פרטי התיקון</CardDescription>
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

                {/* Demo buttons */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">לצורך הדמו - בחר QR לסימולציה:</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        simulateScan(
                          qrSecurity.encodeQRData(
                            qrSecurity.generateQRData({
                              repairId: "REPAIR002",
                              type: "product",
                              shopId: "SHOP001",
                              productType: "שרשרת",
                              productBrand: "Cartier",
                              productModel: "Love Necklace",
                              serialNumber: "CAR987654321",
                            }),
                          ),
                        )
                      }
                    >
                      סרוק תכשיט חדש (REPAIR002)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        simulateScan(
                          qrSecurity.encodeQRData(
                            qrSecurity.generateQRData({
                              repairId: "REPAIR005",
                              type: "product",
                              shopId: "SHOP002",
                              productType: "צמיד",
                              productBrand: "Local Artisan",
                              productModel: "Handmade Silver Bracelet",
                              serialNumber: "ART321654987",
                            }),
                          ),
                        )
                      }
                    >
                      סרוק תכשיט קיים (REPAIR005)
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <p className="text-sm text-gray-600">מזהה תיקון</p>
                    <p className="font-semibold">{scanResult.repairId}</p>
                  </div>
                </div>
              </div>

              {scanResult.canAccept ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 font-semibold">תכשיט חדש לתיקון</p>
                    </div>
                    <p className="text-green-700 text-sm">התכשיט הגיע לסדנה ומוכן לקבלה</p>
                  </div>
                  <Button className="w-full" onClick={acceptRepair}>
                    אשר קבלת תכשיט לתיקון
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <p className="text-yellow-800 font-semibold">תכשיט כבר בטיפול</p>
                    </div>
                    <p className="text-yellow-700 text-sm">התכשיט כבר נמצא בסדנה ובתהליך תיקון</p>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    עדכן סטטוס תיקון
                  </Button>
                </div>
              )}

              <Button variant="outline" onClick={resetScan} className="w-full bg-transparent">
                סרוק QR נוסף
              </Button>
            </CardContent>
          </Card>
        )}

        {scanStep === "accepted" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                תכשיט התקבל בהצלחה!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">התכשיט נקלט בסדנה</h3>
                <p className="text-gray-600 mb-6">
                  {scanResult?.repairId} - {scanResult?.product}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    ✅ הסטטוס עודכן ל"התקבל בסדנה"
                    <br />✅ הלקוח קיבל הודעה על קבלת התכשיט
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={resetScan} className="flex-1">
                    סרוק תכשיט נוסף
                  </Button>
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/technician/dashboard">חזור לדשבורד</Link>
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
