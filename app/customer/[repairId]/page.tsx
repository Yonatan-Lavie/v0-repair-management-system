"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Clock, CheckCircle, Package, Wrench } from "lucide-react"
import { useParams } from "next/navigation"
import { qrSecurity } from "@/lib/qr-security" // Import qrSecurity

// Import the demo data at the top
import { demoData, getDemoData } from "@/lib/demo-data"

// Replace the mockCustomerData with:
const mockCustomerData = Object.fromEntries(
  demoData.repairs.map((repair) => {
    const product = getDemoData.getProduct(repair.productId)
    const customer = getDemoData.getCustomer(repair.customerId)
    const qrCodes = qrSecurity.generateQRData({
      repairId: repair.repairId,
      type: "customer",
      customerId: repair.customerId,
      shopId: repair.shopId,
      productType: product?.type,
      productBrand: product?.brand,
      productModel: product?.model,
      serialNumber: product?.serialNumber,
    })

    return [
      repair.repairId,
      {
        repairId: repair.repairId,
        customerName: customer?.name || "לא ידוע",
        product: `${product?.brand || ""} ${product?.model || ""} ${product?.type || ""}`.trim(),
        issue: repair.issue,
        status: repair.status,
        createdAt: new Date(repair.createdAt).toLocaleDateString("he-IL"),
        estimatedCompletion: repair.estimatedCompletion,
        timeline: getDemoData.getRepairTimeline(repair.repairId),
        qrCustomer: qrSecurity.generateSecureQRURL({
          repairId: repair.repairId,
          type: "customer",
          customerId: repair.customerId,
          shopId: repair.shopId,
          productType: product?.type,
          productBrand: product?.brand,
          productModel: product?.model,
          serialNumber: product?.serialNumber,
        }),
      },
    ]
  }),
)

export default function CustomerTracking() {
  const params = useParams()
  const repairId = params.repairId as string
  const [repairData, setRepairData] = useState<any>(null)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    // In a real app, you'd fetch this from a backend based on repairId
    // For demo, we use mockCustomerData
    const data = mockCustomerData[repairId as keyof typeof mockCustomerData]
    if (data) {
      setRepairData(data)
    }
  }, [repairId])

  if (!repairData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">תיקון לא נמצא</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ממתין לאיסוף":
        return <Package className="h-5 w-5 text-green-600" />
      case "בתהליך תיקון":
        return <Wrench className="h-5 w-5 text-blue-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ממתין לאיסוף":
        return "default"
      case "בתהליך תיקון":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">מעקב תיקון תכשיט</h1>
            <p className="text-gray-600 mt-2">שלום {repairData.customerName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(repairData.status)}
                  מזהה תיקון: {repairData.repairId}
                </CardTitle>
                <CardDescription className="mt-2">
                  {repairData.product} - {repairData.issue}
                </CardDescription>
              </div>
              <Badge variant={getStatusColor(repairData.status)} className="text-lg px-4 py-2">
                {repairData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">תאריך יצירה</p>
                <p className="font-semibold">{repairData.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">זמן משוער להשלמה</p>
                <p className="font-semibold">{repairData.estimatedCompletion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>מעקב התקדמות</CardTitle>
            <CardDescription>סטטוס התיקון לאורך זמן</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repairData.timeline.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${item.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <div className="flex-1">
                    <p className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>{item.step}</p>
                    {item.date && <p className="text-sm text-gray-600">{item.date}</p>}
                  </div>
                  {item.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* QR Code for Pickup */}
        {repairData.status === "ממתין לאיסוף" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR לאיסוף התכשיט
              </CardTitle>
              <CardDescription>הצג QR זה בחנות לאיסוף התכשיט המתוקן</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {!showQR ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-semibold">🎉 התכשיט שלך מוכן לאיסוף!</p>
                      <p className="text-green-700 text-sm mt-1">בוא לחנות עם QR זה לאיסוף התכשיט</p>
                    </div>
                    <Button onClick={() => setShowQR(true)} className="w-full">
                      הצג QR לאיסוף
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={repairData.qrCustomer || "/placeholder.svg"}
                      alt="QR Code for Customer Pickup"
                      className="mx-auto border-2 border-gray-200 rounded-lg"
                    />
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">💡 הצג QR זה למוכר בחנות לאימות זהותך ואיסוף התכשיט</p>
                    </div>
                    <Button variant="outline" onClick={() => setShowQR(false)}>
                      הסתר QR
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* In Progress Message */}
        {repairData.status === "בתהליך תיקון" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                התיקון בעיצומו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">🔧 התכשיט שלך נמצא כרגע בתהליך תיקון בסדנה</p>
                <p className="text-blue-700 text-sm mt-2">נעדכן אותך ברגע שהתיקון יושלם</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
