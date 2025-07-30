"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Scan, QrCode, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock scan results
const mockScanResults = {
  REPAIR001: {
    repairId: "REPAIR001",
    customerName: "רועי כהן",
    product: "Samsung Galaxy S21",
    issue: "לא נדלק",
    status: "ממתין לאיסוף",
    qrType: "product",
  },
  REPAIR002: {
    repairId: "REPAIR002",
    customerName: "מאיה לוי",
    product: "iPad Pro",
    issue: "סדק במסך",
    status: "בתהליך תיקון",
    qrType: "customer",
  },
}

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanStep, setScanStep] = useState<"waiting" | "scanned" | "verified">("waiting")

  const simulateScan = (repairId: string) => {
    const result = mockScanResults[repairId as keyof typeof mockScanResults]
    if (result) {
      setScanResult(result)
      setScanStep("scanned")
    }
  }

  const handleVerifyDelivery = () => {
    setScanStep("verified")
  }

  const resetScan = () => {
    setScanResult(null)
    setScanStep("waiting")
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
              <CardDescription>סרוק QR של מוצר או לקוח לעדכון סטטוס או אימות מסירה</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">מקם את המצלמה מול QR Code</p>
                  </div>
                </div>

                {/* Demo buttons */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">לצורך הדמו - בחר QR לסימולציה:</p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => simulateScan("REPAIR001")}>
                      סרוק QR מוצר (REPAIR001)
                    </Button>
                    <Button variant="outline" onClick={() => simulateScan("REPAIR002")}>
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
                    <p className="text-sm text-gray-600">מוצר</p>
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
                    <p className="text-blue-800 font-semibold mb-2">המוצר מוכן למסירה!</p>
                    <p className="text-blue-700 text-sm">כעת סרוק את QR הלקוח לאימות זהות ומסירת המוצר</p>
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
                    <p className="text-green-700 text-sm">ניתן למסור את המוצר ללקוח</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">המוצר נמסר ללקוח</h3>
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
