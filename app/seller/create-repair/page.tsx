"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, QrCode, Send, Printer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { qrSecurity } from "@/lib/qr-security" // Import qrSecurity
import { authManager } from "@/lib/auth" // Import authManager

export default function CreateRepair() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    productType: "",
    productBrand: "",
    productModel: "",
    material: "", // New field for jewelry
    gemstone: "", // New field for jewelry
    serialNumber: "", // Changed from IMEI
    issue: "",
    warrantyStatus: "",
  })

  const [generatedRepairId, setGeneratedRepairId] = useState("")
  const [qrCodes, setQrCodes] = useState({
    product: "",
    customer: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Generate repair ID
    const repairId = `REPAIR${String(Date.now()).slice(-6)}` // More digits for uniqueness
    setGeneratedRepairId(repairId)

    const session = authManager.getCurrentSession()
    const shopId = session?.user.shopId || "UNKNOWN_SHOP"

    // Generate secure QR codes
    const productQRData = qrSecurity.generateSecureQRURL({
      repairId,
      type: "product",
      shopId,
      productType: formData.productType,
      productBrand: formData.productBrand,
      productModel: formData.productModel,
      serialNumber: formData.serialNumber,
    })

    const customerQRData = qrSecurity.generateSecureQRURL({
      repairId,
      type: "customer",
      shopId,
      customerId: "CUST_NEW", // Placeholder for new customer ID
      customerName: formData.customerName, // Pass customer name for display in QR data
    })

    setQrCodes({
      product: productQRData,
      customer: customerQRData,
    })

    setStep(3)
  }

  const handleComplete = () => {
    router.push("/seller/dashboard")
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
            <h1 className="text-2xl font-bold text-gray-900">יצירת תיקון חדש</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              3
            </div>
          </div>
        </div>

        {/* Step 1: Customer & Product Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>פרטי לקוח ותכשיט</CardTitle>
              <CardDescription>הזן את פרטי הלקוח והתכשיט לתיקון</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">שם הלקוח</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="הכנס שם הלקוח"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">טלפון</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    placeholder="050-1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productType">סוג תכשיט</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) => handleInputChange("productType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר סוג תכשיט" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ring">טבעת</SelectItem>
                      <SelectItem value="necklace">שרשרת</SelectItem>
                      <SelectItem value="earrings">עגילים</SelectItem>
                      <SelectItem value="bracelet">צמיד</SelectItem>
                      <SelectItem value="watch">שעון יוקרה</SelectItem>
                      <SelectItem value="other">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productBrand">מותג</Label>
                  <Input
                    id="productBrand"
                    value={formData.productBrand}
                    onChange={(e) => handleInputChange("productBrand", e.target.value)}
                    placeholder="Tiffany, Cartier, Rolex, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productModel">דגם / סגנון</Label>
                  <Input
                    id="productModel"
                    value={formData.productModel}
                    onChange={(e) => handleInputChange("productModel", e.target.value)}
                    placeholder="טבעת סוליטר, צמיד טניס, וכו'"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="material">חומר</Label>
                  <Select value={formData.material} onValueChange={(value) => handleInputChange("material", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר חומר" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yellow-gold">זהב צהוב</SelectItem>
                      <SelectItem value="white-gold">זהב לבן</SelectItem>
                      <SelectItem value="rose-gold">זהב אדום</SelectItem>
                      <SelectItem value="silver">כסף</SelectItem>
                      <SelectItem value="platinum">פלטינה</SelectItem>
                      <SelectItem value="other-metal">מתכת אחרת</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gemstone">אבן חן</Label>
                  <Input
                    id="gemstone"
                    value={formData.gemstone}
                    onChange={(e) => handleInputChange("gemstone", e.target.value)}
                    placeholder="יהלום, אמרלד, ספיר, וכו'"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">מספר סידורי / קוד פריט</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                    placeholder="הכנס מספר סידורי"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warrantyStatus">סטטוס אחריות</Label>
                <Select
                  value={formData.warrantyStatus}
                  onValueChange={(value) => handleInputChange("warrantyStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סטטוס אחריות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-warranty">באחריות</SelectItem>
                    <SelectItem value="out-warranty">מחוץ לאחריות</SelectItem>
                    <SelectItem value="unknown">לא ידוע</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!formData.customerName || !formData.customerPhone || !formData.productType}
              >
                המשך לתיאור התקלה
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Issue Description */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>תיאור התקלה</CardTitle>
              <CardDescription>תאר את הבעיה בתכשיט בפירוט</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="issue">תיאור התקלה</Label>
                <Textarea
                  id="issue"
                  value={formData.issue}
                  onChange={(e) => handleInputChange("issue", e.target.value)}
                  placeholder="תאר את הבעיה בתכשיט - למשל: אבן חסרה, שריטה, סוגר שבור, נדרש ניקוי וכו'"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  חזור
                </Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={!formData.issue}>
                  צור תיקון ו-QR
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: QR Generation */}
        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  תיקון נוצר בהצלחה!
                </CardTitle>
                <CardDescription>
                  מזהה תיקון: <span className="font-bold">{generatedRepairId}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800">✅ התיקון נוצר בהצלחה עבור {formData.customerName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product QR */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">QR לתכשיט</CardTitle>
                      <CardDescription>להדבקה על השקית</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <img
                        src={qrCodes.product || "/placeholder.svg"}
                        alt="QR Code for Product"
                        className="mx-auto mb-4"
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
                      <CardTitle className="text-lg">QR ללקוח</CardTitle>
                      <CardDescription>לשליחה ב-SMS</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <img
                        src={qrCodes.customer || "/placeholder.svg"}
                        alt="QR Code for Customer"
                        className="mx-auto mb-4"
                      />
                      <Button className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        שלח SMS ללקוח
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">הוראות:</h4>
                  <ol className="text-blue-800 text-sm space-y-1">
                    <li>1. הדבק את QR התכשיט על השקית</li>
                    <li>2. שלח את QR הלקוח ב-SMS</li>
                    <li>3. העבר את התכשיט לצורף/טכנאי</li>
                  </ol>
                </div>

                <Button onClick={handleComplete} className="w-full mt-6">
                  סיום - חזור לדשבורד
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
