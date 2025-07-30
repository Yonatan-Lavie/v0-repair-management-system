"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Clock, CheckCircle, Package, Wrench } from "lucide-react" // Added Gem icon
import { useParams } from "next/navigation"
import { qrSecurity } from "@/lib/qr-security"

// Import the demo data at the top
import { demoData, getDemoData } from "@/lib/demo-data"

// Replace the mockCustomerData with:
const mockCustomerData = Object.fromEntries(
  demoData.repairs.map((repair) => {
    const product = getDemoData.getProduct(repair.productId)
    const customer = getDemoData.getCustomer(repair.customerId)

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
          serialNumber: (product as any)?.serialNumber,
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
    const data = mockCustomerData[repairId as keyof typeof mockCustomerData]
    if (data) {
      setRepairData(data)
    }
  }, [repairId])

  if (!repairData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-none">
          <CardContent className="text-center py-8 text-muted-foreground">
            <p>תיקון לא נמצא</p>
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
        return <Wrench className="h-5 w-5 text-primary" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-center">
            <h1 className="text-3xl font-bold text-foreground">מעקב תיקון תכשיט</h1>
            <p className="text-muted-foreground mt-2">שלום {repairData.customerName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <Card className="mb-8 shadow-lg border-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                  {getStatusIcon(repairData.status)}
                  מזהה תיקון: {repairData.repairId}
                </CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  {repairData.product} - {repairData.issue}
                </CardDescription>
              </div>
              <Badge variant={getStatusColor(repairData.status)} className="text-lg px-4 py-2 font-semibold">
                {repairData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <p className="text-sm">תאריך יצירה</p>
                <p className="font-semibold text-foreground">{repairData.createdAt}</p>
              </div>
              <div>
                <p className="text-sm">זמן משוער להשלמה</p>
                <p className="font-semibold text-foreground">{repairData.estimatedCompletion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-8 shadow-lg border-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">מעקב התקדמות</CardTitle>
            <CardDescription className="text-muted-foreground">סטטוס התיקון לאורך זמן</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {repairData.timeline.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${item.completed ? "bg-primary" : "bg-muted"}`}></div>
                  <div className="flex-1">
                    <p className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.step}
                    </p>
                    {item.date && <p className="text-sm text-muted-foreground">{item.date}</p>}
                  </div>
                  {item.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* QR Code for Pickup */}
        {repairData.status === "ממתין לאיסוף" && (
          <Card className="shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <QrCode className="h-6 w-6 text-primary" />
                QR לאיסוף התכשיט
              </CardTitle>
              <CardDescription className="text-muted-foreground">הצג QR זה בחנות לאיסוף התכשיט המתוקן</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center">
                {!showQR ? (
                  <div className="space-y-4">
                    <div className="bg-green-50/20 border border-green-200 rounded-lg p-4 text-green-800">
                      <p className="font-semibold">🎉 התכשיט שלך מוכן לאיסוף!</p>
                      <p className="text-green-700 text-sm mt-1">בוא לחנות עם QR זה לאיסוף התכשיט</p>
                    </div>
                    <Button
                      onClick={() => setShowQR(true)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      הצג QR לאיסוף
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={repairData.qrCustomer || "/placeholder.svg"}
                      alt="QR Code for Customer Pickup"
                      className="mx-auto border-2 border-muted rounded-lg p-2"
                    />
                    <div className="bg-secondary/20 border border-secondary rounded-lg p-4 text-secondary-foreground">
                      <p className="text-sm">💡 הצג QR זה למוכר בחנות לאימות זהותך ואיסוף התכשיט</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowQR(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
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
          <Card className="shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Wrench className="h-6 w-6 text-primary" />
                התיקון בעיצומו
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-secondary/20 border border-secondary rounded-lg p-4 text-secondary-foreground">
                <p>🔧 התכשיט שלך נמצא כרגע בתהליך תיקון בסדנה</p>
                <p className="text-sm mt-2">נעדכן אותך ברגע שהתיקון יושלם</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
