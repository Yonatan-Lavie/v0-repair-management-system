"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Send, Printer, Phone, Mail, Clock, User, Gem } from "lucide-react" // Added Gem icon
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { qrSecurity } from "@/lib/qr-security"

// Import the demo data at the top
import { demoData, getDemoData } from "@/lib/demo-data"

// Replace the mockRepairDetails with:
const mockRepairDetails = Object.fromEntries(
  demoData.repairs.map((repair) => {
    const product = getDemoData.getProduct(repair.productId)
    const customer = getDemoData.getCustomer(repair.customerId)

    return [
      repair.repairId,
      {
        repairId: repair.repairId,
        customer: customer || { name: "לא ידוע", phone: "", email: "" },
        product: {
          type: product?.type || "לא ידוע",
          brand: product?.brand || "לא ידוע",
          model: product?.model || "לא ידוע",
          color: product?.color || "לא ידוע",
          material: (product as any)?.material || "לא ידוע",
          gemstone: (product as any)?.gemstone || "לא ידוע",
          serialNumber: (product as any)?.serialNumber || "לא ידוע",
        },
        issue: {
          description: repair.issue,
          details: repair.issueDetails,
          warranty: repair.warranty,
        },
        status: repair.status,
        createdAt: repair.createdAt,
        createdBy: repair.createdBy,
        estimatedCost: repair.estimatedCost,
        actualCost: repair.actualCost,
        timeline: getDemoData.getRepairTimeline(repair.repairId),
        qrCodes: {
          product: qrSecurity.generateSecureQRURL({
            repairId: repair.repairId,
            type: "product",
            shopId: repair.shopId,
            productType: product?.type,
            productBrand: product?.brand,
            productModel: product?.model,
            serialNumber: (product as any)?.serialNumber,
          }),
          customer: qrSecurity.generateSecureQRURL({
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
        notes: getDemoData.getRepairNotes(repair.repairId),
      },
    ]
  }),
)

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-none">
          <CardContent className="text-center py-8 text-muted-foreground">
            <p>תיקון לא נמצא</p>
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
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/seller/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    חזור
                  </Link>
                </Button>
                <Gem className="h-8 w-8 text-primary" /> {/* Changed icon to Gem */}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">פרטי תיקון {repairData.repairId}</h1>
                  <p className="text-muted-foreground">
                    {repairData.customer.name} - {repairData.product.brand} {repairData.product.model}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusColor(repairData.status)} className="text-lg px-4 py-2 font-semibold">
                {repairData.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">עלות משוערת</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₪{repairData.estimatedCost}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">עלות בפועל</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₪{repairData.actualCost}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">זמן בתיקון</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">3 ימים</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">סטטוס אחריות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-foreground">{repairData.issue.warranty}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                פרטי התיקון
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                ציר זמן
              </TabsTrigger>
              <TabsTrigger
                value="qr-codes"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                QR Codes
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                הערות
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <Card className="shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                      <User className="h-6 w-6 text-primary" />
                      פרטי לקוח
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 text-muted-foreground">
                    <div>
                      <p className="text-sm">שם מלא</p>
                      <p className="font-semibold text-foreground">{repairData.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm">טלפון</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{repairData.customer.phone}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground bg-transparent"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm">מייל</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{repairData.customer.email}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground bg-transparent"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Info */}
                <Card className="shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                      <Gem className="h-6 w-6 text-primary" /> {/* Changed icon to Gem */}
                      פרטי תכשיט
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 text-muted-foreground">
                    <div>
                      <p className="text-sm">סוג תכשיט</p>
                      <p className="font-semibold text-foreground">{repairData.product.type}</p>
                    </div>
                    <div>
                      <p className="text-sm">מותג ודגם</p>
                      <p className="font-semibold text-foreground">
                        {repairData.product.brand} {repairData.product.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">חומר</p>
                      <p className="font-semibold text-foreground">{repairData.product.material}</p>
                    </div>
                    <div>
                      <p className="text-sm">אבן חן</p>
                      <p className="font-semibold text-foreground">{repairData.product.gemstone}</p>
                    </div>
                    <div>
                      <p className="text-sm">מספר סידורי / קוד פריט</p>
                      <p className="font-semibold font-mono text-foreground">{repairData.product.serialNumber}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Issue Details */}
                <Card className="lg:col-span-2 shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-foreground">תיאור התקלה</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 text-muted-foreground">
                    <div>
                      <p className="text-sm">תקלה</p>
                      <p className="font-semibold text-foreground">{repairData.issue.description}</p>
                    </div>
                    <div>
                      <p className="text-sm">פירוט מלא</p>
                      <p className="text-foreground">{repairData.issue.details}</p>
                    </div>
                    <div>
                      <p className="text-sm">סטטוס אחריות</p>
                      <Badge variant="secondary">{repairData.issue.warranty}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                    <Clock className="h-6 w-6 text-primary" />
                    ציר זמן של התיקון
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">מעקב אחר כל השלבים בתהליך התיקון</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {repairData.timeline.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`w-4 h-4 rounded-full mt-1 ${item.completed ? "bg-primary" : "bg-muted"}`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p
                              className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {item.step}
                            </p>
                            {item.completed && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                {item.user}
                              </Badge>
                            )}
                          </div>
                          {item.date && <p className="text-sm text-muted-foreground mt-1">{item.date}</p>}
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
                <Card className="shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                      <QrCode className="h-6 w-6 text-primary" />
                      QR לתכשיט
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">QR מודבק על השקית</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 pt-4">
                    <img
                      src={repairData.qrCodes.product || "/placeholder.svg"}
                      alt="QR Code for Product"
                      className="mx-auto border-2 border-muted rounded-lg p-2"
                    />
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      הדפס QR
                    </Button>
                  </CardContent>
                </Card>

                {/* Customer QR */}
                <Card className="shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                      <QrCode className="h-6 w-6 text-primary" />
                      QR ללקוח
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">QR שנשלח ללקוח</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 pt-4">
                    <img
                      src={repairData.qrCodes.customer || "/placeholder.svg"}
                      alt="QR Code for Customer"
                      className="mx-auto border-2 border-muted rounded-lg p-2"
                    />
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Send className="h-4 w-4 mr-2" />
                      שלח SMS מחדש
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">הערות והודעות</CardTitle>
                  <CardDescription className="text-muted-foreground">כל ההערות שנוספו במהלך התיקון</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {repairData.notes.map((note: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-foreground text-sm">{note.user}</p>
                          <p className="text-xs text-muted-foreground">{note.date}</p>
                        </div>
                        <p className="text-foreground">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
