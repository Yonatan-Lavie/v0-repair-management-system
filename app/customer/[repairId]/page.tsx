"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Clock, CheckCircle, Package, Wrench } from "lucide-react"
import { useParams } from "next/navigation"

// Mock customer data
const mockCustomerData = {
  REPAIR001: {
    repairId: "REPAIR001",
    customerName: "רועי כהן",
    product: "Samsung Galaxy S21",
    issue: "לא נדלק",
    status: "ממתין לאיסוף",
    createdAt: "2025-07-20",
    estimatedCompletion: "2025-07-23",
    timeline: [
      { step: "נוצר תיקון", date: "2025-07-20 10:30", completed: true },
      { step: "נשלח למעבדה", date: "2025-07-20 14:00", completed: true },
      { step: "התקבל במעבדה", date: "2025-07-21 09:15", completed: true },
      { step: "בתהליך תיקון", date: "2025-07-21 11:00", completed: true },
      { step: "תיקון הושלם", date: "2025-07-22 16:30", completed: true },
      { step: "חזר לחנות", date: "2025-07-23 10:00", completed: true },
      { step: "מוכן לאיסוף", date: "2025-07-23 10:30", completed: true },
    ],
    qrCustomer:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR001;cust:CUST001;token:TOKEN123",
  },
  REPAIR002: {
    repairId: "REPAIR002",
    customerName: "מאיה לוי",
    product: "iPad Pro",
    issue: "סדק במסך",
    status: "בתהליך תיקון",
    createdAt: "2025-07-25",
    estimatedCompletion: "2025-07-28",
    timeline: [
      { step: "נוצר תיקון", date: "2025-07-25 14:20", completed: true },
      { step: "נשלח למעבדה", date: "2025-07-25 16:00", completed: true },
      { step: "התקבל במעבדה", date: "2025-07-26 08:30", completed: true },
      { step: "בתהליך תיקון", date: "2025-07-26 10:15", completed: true },
      { step: "תיקון הושלם", date: "", completed: false },
      { step: "חזר לחנות", date: "", completed: false },
      { step: "מוכן לאיסוף", date: "", completed: false },
    ],
    qrCustomer:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR002;cust:CUST002;token:TOKEN456",
  },
}

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
            <h1 className="text-3xl font-bold text-gray-900">מעקב תיקון</h1>
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
                QR לאיסוף המוצר
              </CardTitle>
              <CardDescription>הצג QR זה בחנות לאיסוף המוצר המתוקן</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {!showQR ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-semibold">🎉 המוצר שלך מוכן לאיסוף!</p>
                      <p className="text-green-700 text-sm mt-1">בוא לחנות עם QR זה לאיסוף המוצר</p>
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
                      <p className="text-blue-800 text-sm">💡 הצג QR זה למוכר בחנות לאימות זהותך ואיסוף המוצר</p>
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
                <p className="text-blue-800">🔧 המוצר שלך נמצא כרגע בתהליך תיקון במעבדה</p>
                <p className="text-blue-700 text-sm mt-2">נעדכן אותך ברגע שהתיקון יושלם</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
