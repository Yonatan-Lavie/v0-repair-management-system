"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, QrCode, Send, Printer } from "lucide-react" // Added Gem icon
import Link from "next/link"
import { useRouter } from "next/navigation"
import { qrSecurity } from "@/lib/qr-security"
import { authManager } from "@/lib/auth"

export default function CreateRepair() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    productType: "",
    productBrand: "",
    productModel: "",
    material: "",
    gemstone: "",
    serialNumber: "",
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
    const repairId = `REPAIR${String(Date.now()).slice(-6)}`
    setGeneratedRepairId(repairId)

    const session = authManager.getCurrentSession()
    const shopId = session?.user.shopId || "UNKNOWN_SHOP"

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
      customerId: "CUST_NEW",
      customerName: formData.customerName,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" size="sm" asChild className="mr-4 text-muted-foreground hover:text-foreground">
              <Link href="/seller/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזור
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">יצירת תיקון חדש</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
          </div>
        </div>

        {/* Step 1: Customer & Product Info */}
        {step === 1 && (
          <Card className="shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">פרטי לקוח ותכשיט</CardTitle>
              <CardDescription className="text-muted-foreground">הזן את פרטי הלקוח והתכשיט לתיקון</CardDescription>
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!formData.customerName || !formData.customerPhone || !formData.productType}
              >
                המשך לתיאור התקלה
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Issue Description */}
        {step === 2 && (
          <Card className="shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">תיאור התקלה</CardTitle>
              <CardDescription className="text-muted-foreground">תאר את הבעיה בתכשיט בפירוט</CardDescription>
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
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  חזור
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!formData.issue}
                >
                  צור תיקון ו-QR
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: QR Generation */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="shadow-lg border-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                  <QrCode className="h-6 w-6 text-primary" />
                  תיקון נוצר בהצלחה!
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  מזהה תיקון: <span className="font-bold text-foreground">{generatedRepairId}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50/20 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
                  <p className="font-semibold">✅ התיקון נוצר בהצלחה עבור {formData.customerName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product QR */}
                  <Card className="shadow-md border-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-foreground">QR לתכשיט</CardTitle>
                      <CardDescription className="text-muted-foreground">להדבקה על השקית</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <img
                        src={qrCodes.product || "/placeholder.svg"}
                        alt="QR Code for Product"
                        className="mx-auto mb-4 border border-muted rounded-lg p-2"
                      />
                      <Button
                        variant="outline"
                        className="w-full text-primary hover:text-primary-foreground hover:bg-primary bg-transparent"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        הדפס QR
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Customer QR */}
                  <Card className="shadow-md border-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-foreground">QR ללקוח</CardTitle>
                      <CardDescription className="text-muted-foreground">לשליחה ב-SMS</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <img
                        src={qrCodes.customer || "/placeholder.svg"}
                        alt="QR Code for Customer"
                        className="mx-auto mb-4 border border-muted rounded-lg p-2"
                      />
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Send className="h-4 w-4 mr-2" />
                        שלח SMS ללקוח
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-secondary/20 border border-secondary rounded-lg text-secondary-foreground">
                  <h4 className="font-semibold mb-2">הוראות:</h4>
                  <ol className="text-sm space-y-1">
                    <li>1. הדבק את QR התכשיט על השקית</li>
                    <li>2. שלח את QR הלקוח ב-SMS</li>
                    <li>3. העבר את התכשיט לצורף/טכנאי</li>
                  </ol>
                </div>

                <Button
                  onClick={handleComplete}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
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
