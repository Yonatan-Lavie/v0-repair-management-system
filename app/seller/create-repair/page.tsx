import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { generateSecureQRURL } from "@/app/actions/qr" // Import QR action
import { createRepair as createRepairAction } from "@/app/actions/repair" // Assuming a repair action exists
import { demoData } from "@/lib/demo-data"
import { getCurrentSession } from "@/app/actions/auth" // Import session action
import { Gem, ScanLine, User, Tag, Info, QrCode } from "lucide-react"
import { Loader2 } from "lucide-react" // Declare Loader2 variable

// This component should be a client component if it uses useState/useRouter
// For now, assuming it's a client component and will be wrapped by ProtectedRoute
;("use client")

import type React from "react"

export default function CreateRepairPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    itemType: "",
    itemBrand: "",
    itemModel: "",
    serialNumber: "",
    issueDescription: "",
    estimatedCost: "",
    status: "בבדיקה",
    assignedTo: "",
    shopId: "", // Will be set from session
  })
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Fetch current session on client side
  useState(() => {
    const fetchSession = async () => {
      const session = await getCurrentSession()
      if (session?.user.shopId) {
        setFormData((prev) => ({ ...prev, shopId: session.user.shopId }))
      }
    }
    fetchSession()
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setQrCodeUrl(null)

    try {
      // Simulate repair creation
      const newRepair = {
        id: `REP${Date.now()}`,
        ...formData,
        estimatedCost: Number.parseFloat(formData.estimatedCost),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{ status: "בבדיקה", timestamp: new Date().toISOString(), by: "מערכת" }],
      }

      // Call server action to create repair
      const result = await createRepairAction(newRepair) // Assuming this action exists and handles persistence

      if (result.success) {
        toast({
          title: "תיקון נוצר בהצלחה!",
          description: `מספר תיקון: ${newRepair.id}`,
        })

        // Generate QR code URL using server action
        const qrUrl = await generateSecureQRURL({
          repairId: newRepair.id,
          type: "product",
          shopId: newRepair.shopId,
          productType: newRepair.itemType,
          productBrand: newRepair.itemBrand,
          productModel: newRepair.itemModel,
          serialNumber: newRepair.serialNumber,
        })
        setQrCodeUrl(qrUrl)

        // Optionally redirect or clear form
        // router.push(`/seller/repair/${newRepair.id}`);
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          itemType: "",
          itemBrand: "",
          itemModel: "",
          serialNumber: "",
          issueDescription: "",
          estimatedCost: "",
          status: "בבדיקה",
          assignedTo: "",
          shopId: formData.shopId, // Keep shopId
        })
      } else {
        toast({
          title: "שגיאה ביצירת תיקון",
          description: result.error || "נסה שוב מאוחר יותר.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to create repair:", error)
      toast({
        title: "שגיאה בלתי צפויה",
        description: "אירעה שגיאה בעת יצירת התיקון.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const technicians = demoData.users.filter((user) => user.role === "technician" && user.shopId === formData.shopId)

  return (
    <ProtectedRoute allowedRoles={["seller", "shop-manager"]}>
      <PermissionGuard permission="repairs:create">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">יצירת תיקון חדש</h1>

          <Card className="max-w-3xl mx-auto shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Gem className="w-6 h-6" /> פרטי תיקון תכשיט
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="md:col-span-2 space-y-4 border-b pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-secondary-foreground flex items-center gap-2">
                    <User className="w-5 h-5" /> פרטי לקוח
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">שם לקוח</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">טלפון</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">מייל</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Item Information */}
                <div className="md:col-span-2 space-y-4 border-b pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-secondary-foreground flex items-center gap-2">
                    <Tag className="w-5 h-5" /> פרטי תכשיט
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemType">סוג תכשיט</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("itemType", value)}
                        value={formData.itemType}
                      >
                        <SelectTrigger id="itemType" className="text-foreground">
                          <SelectValue placeholder="בחר סוג תכשיט" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="טבעת">טבעת</SelectItem>
                          <SelectItem value="שרשרת">שרשרת</SelectItem>
                          <SelectItem value="עגילים">עגילים</SelectItem>
                          <SelectItem value="צמיד">צמיד</SelectItem>
                          <SelectItem value="שעון">שעון</SelectItem>
                          <SelectItem value="אחר">אחר</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemBrand">מותג</Label>
                      <Input
                        id="itemBrand"
                        value={formData.itemBrand}
                        onChange={handleInputChange}
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemModel">דגם</Label>
                      <Input
                        id="itemModel"
                        value={formData.itemModel}
                        onChange={handleInputChange}
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">מספר סידורי / קטלוגי</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleInputChange}
                        className="text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issueDescription">תיאור התקלה / דרישת תיקון</Label>
                    <Textarea
                      id="issueDescription"
                      value={formData.issueDescription}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="text-foreground"
                    />
                  </div>
                </div>

                {/* Repair Details */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xl font-semibold text-secondary-foreground flex items-center gap-2">
                    <Info className="w-5 h-5" /> פרטי תיקון
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedCost">עלות משוערת (₪)</Label>
                      <Input
                        id="estimatedCost"
                        type="number"
                        value={formData.estimatedCost}
                        onChange={handleInputChange}
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">צורף/טכנאי אחראי</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("assignedTo", value)}
                        value={formData.assignedTo}
                      >
                        <SelectTrigger id="assignedTo" className="text-foreground">
                          <SelectValue placeholder="בחר צורף/טכנאי" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((tech) => (
                            <SelectItem key={tech.id} value={tech.id}>
                              {tech.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        יוצר תיקון...
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4 ml-2" /> יצירת תיקון ו-QR
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {qrCodeUrl && (
                <div className="mt-8 p-6 bg-secondary/10 rounded-lg text-center border border-secondary">
                  <h3 className="text-xl font-semibold text-secondary-foreground mb-4 flex items-center justify-center gap-2">
                    <QrCode className="w-6 h-6" /> קוד QR לתיקון
                  </h3>
                  <p className="text-muted-foreground mb-4">סרוק את הקוד כדי לעקוב אחר התיקון:</p>
                  <div className="flex justify-center">
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="QR Code for Repair"
                      className="w-48 h-48 border border-border p-2 rounded-md"
                    />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    מספר תיקון: <span className="font-medium text-foreground">{formData.serialNumber}</span>
                  </p>
                  <Button
                    onClick={() => navigator.clipboard.writeText(qrCodeUrl)}
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    העתק קישור QR
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    </ProtectedRoute>
  )
}
