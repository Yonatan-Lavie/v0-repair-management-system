"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Send, Printer, Phone, Mail, Clock, User, Package } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock detailed repair data
const mockRepairDetails = {
  REPAIR001: {
    repairId: "REPAIR001",
    customer: {
      name: "רועי כהן",
      phone: "+972501234567",
      email: "roi@example.com",
    },
    product: {
      type: "טלפון נייד",
      brand: "Samsung",
      model: "Galaxy S21",
      color: "שחור",
      imei: "123456789012345",
    },
    issue: {
      description: "לא נדלק",
      details: "הלקוח מדווח שהמכשיר לא נדלק לאחר שנפל. נבדק - אין תגובה כלל לחיצה על כפתור ההפעלה.",
      warranty: "מחוץ לאחריות",
    },
    status: "ממתין לאיסוף",
    createdAt: "2025-07-20T10:30:00Z",
    createdBy: "מוכר 1",
    estimatedCost: 350,
    actualCost: 320,
    timeline: [
      { step: "נוצר תיקון", date: "2025-07-20 10:30", user: "מוכר 1", completed: true },
      { step: "נשלח למעבדה", date: "2025-07-20 14:00", user: "מוכר 1", completed: true },
      { step: "התקבל במעבדה", date: "2025-07-21 09:15", user: "יוסי בן-חיים", completed: true },
      { step: "בתהליך תיקון", date: "2025-07-21 11:00", user: "יוסי בן-חיים", completed: true },
      { step: "תיקון הושלם", date: "2025-07-22 16:30", user: "יוסי בן-חיים", completed: true },
      { step: "חזר לחנות", date: "2025-07-23 10:00", user: "מוכר 1", completed: true },
      { step: "מוכן לאיסוף", date: "2025-07-23 10:30", user: "מוכר 1", completed: true },
    ],
    qrCodes: {
      product:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR001;product:PRD1001;sig:XYZ123",
      customer:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR001;cust:CUST001;token:TOKEN123",
    },
    notes: [
      { date: "2025-07-20 10:30", user: "מוכר 1", note: "לקוח מדווח על נפילה. בדיקה ראשונית - אין תגובה." },
      { date: "2025-07-21 11:00", user: "יוסי בן-חיים", note: "זוהתה בעיה בלוח האם. נדרש החלפת רכיב." },
      { date: "2025-07-22 16:30", user: "יוסי בן-חיים", note: "תיקון הושלם בהצלחה. המכשיר עובד תקין." },
    ],
  },
}

export default function RepairDetails() {
  const params = useParams()
  const repairId = params.repairId as string
  const [repairData, setRepairData] = useState<any>(null)

  useEffect(() => {
    const data = mockRepairDetails[repairId as keyof typeof mockRepairDetails]
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ממתין לאיסוף":
        return "default"
      case "בתהליך תיקון":
        return "secondary"
      case "הושלם":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/seller/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  חזור
                </Link>
              </Button>
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">פרטי תיקון {repairData.repairId}</h1>
                <p className="text-gray-600">
                  {repairData.customer.name} - {repairData.product.brand} {repairData.product.model}
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(repairData.status)} className="text-lg px-4 py-2">
              {repairData.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">עלות משוערת</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪{repairData.estimatedCost}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">עלות בפועל</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪{repairData.actualCost}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">זמן בתיקון</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 ימים</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">סטטוס אחריות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{repairData.issue.warranty}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">פרטי התיקון</TabsTrigger>
            <TabsTrigger value="timeline">ציר זמן</TabsTrigger>
            <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            <TabsTrigger value="notes">הערות</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    פרטי לקוח
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">שם מלא</p>
                    <p className="font-semibold">{repairData.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">טלפון</p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{repairData.customer.phone}</p>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">מייל</p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{repairData.customer.email}</p>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    פרטי מוצר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">סוג מוצר</p>
                    <p className="font-semibold">{repairData.product.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">מותג ודגם</p>
                    <p className="font-semibold">
                      {repairData.product.brand} {repairData.product.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">צבע</p>
                    <p className="font-semibold">{repairData.product.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IMEI</p>
                    <p className="font-semibold font-mono">{repairData.product.imei}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>תיאור התקלה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">תקלה</p>
                    <p className="font-semibold">{repairData.issue.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">פירוט מלא</p>
                    <p className="text-gray-800">{repairData.issue.details}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">סטטוס אחריות</p>
                    <Badge variant="secondary">{repairData.issue.warranty}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  ציר זמן של התיקון
                </CardTitle>
                <CardDescription>מעקב אחר כל השלבים בתהליך התיקון</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {repairData.timeline.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${item.completed ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                            {item.step}
                          </p>
                          {item.completed && (
                            <Badge variant="outline" className="text-xs">
                              {item.user}
                            </Badge>
                          )}
                        </div>
                        {item.date && <p className="text-sm text-gray-600 mt-1">{item.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr-codes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product QR */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR למוצר
                  </CardTitle>
                  <CardDescription>QR מודבק על השקית</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <img
                    src={repairData.qrCodes.product || "/placeholder.svg"}
                    alt="QR Code for Product"
                    className="mx-auto border-2 border-gray-200 rounded-lg"
                  />
                  <Button variant="outline" className="w-full bg-transparent">
                    <Printer className="h-4 w-4 mr-2" />
                    הדפס QR
                  </Button>
                </CardContent>
              </Card>

              {/* Customer QR */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR ללקוח
                  </CardTitle>
                  <CardDescription>QR שנשלח ללקוח</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <img
                    src={repairData.qrCodes.customer || "/placeholder.svg"}
                    alt="QR Code for Customer"
                    className="mx-auto border-2 border-gray-200 rounded-lg"
                  />
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    שלח SMS מחדש
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>הערות והודעות</CardTitle>
                <CardDescription>כל ההערות שנוספו במהלך התיקון</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repairData.notes.map((note: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm">{note.user}</p>
                        <p className="text-xs text-gray-500">{note.date}</p>
                      </div>
                      <p className="text-gray-800">{note.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
