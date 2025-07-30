"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Scan, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { qrSecurity } from "@/lib/qr-security"
import { statusManager } from "@/lib/status-manager"
import { authManager } from "@/lib/auth"

// Mock data for demonstration
const mockRepairData = {
  REPAIR001: {
    repairId: "REPAIR001",
    customerName: "דנה כהן",
    product: "טבעת יהלום",
    issue: "אבן חסרה",
    status: "נשלח לתיקון",
    qrType: "product",
    shopId: "SHOP001",
    productType: "ring",
    productBrand: "Tiffany",
    productModel: "Solitaire",
    serialNumber: "SN12345",
  },
  REPAIR002: {
    repairId: "REPAIR002",
    customerName: "איתי לוי",
    product: "שרשרת זהב",
    issue: "סוגר שבור",
    status: "בתהליך תיקון",
    qrType: "customer",
    shopId: "SHOP001",
    customerId: "CUST002",
    customerNameForQR: "איתי לוי",
  },
  REPAIR003: {
    repairId: "REPAIR003",
    customerName: "שירה גולן",
    product: "עגילי כסף",
    issue: "ניקוי והברקה",
    status: "תוקן - מוכן לשילוח",
    qrType: "product",
    shopId: "SHOP001",
    productType: "earrings",
    productBrand: "Pandora",
    productModel: "Hoops",
    serialNumber: "SN67890",
  },
}

export default function SellerScan() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [parsedQRData, setParsedQRData] = useState<any>(null)
  const [repairDetails, setRepairDetails] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")

  useEffect(() => {
    if (scanning) {
      startScanner()
    } else {
      stopScanner()
    }
    return () => stopScanner()
  }, [scanning])

  const startScanner = async () => {
    setScanResult(null)
    setScanError(null)
    setParsedQRData(null)
    setRepairDetails(null)
    setNewStatus("")
    setUpdateMessage("")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        // Simulate QR code scanning after a delay
        setTimeout(() => {
          const mockQRValue = qrSecurity.generateSecureQRURL({
            repairId: "REPAIR001",
            type: "product",
            shopId: "SHOP001",
            productType: "ring",
            productBrand: "Tiffany",
            productModel: "Solitaire",
            serialNumber: "SN12345",
          })
          handleScan(mockQRValue)
        }, 3000) // Simulate scan after 3 seconds
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setScanError("שגיאה בגישה למצלמה. ודא שהרשאות מצלמה מאושרות.")
      setScanning(false)
    }
  }

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const handleScan = (result: string) => {
    setScanning(false) // Stop scanning after a result is obtained
    setScanResult(result)

    try {
      const data = qrSecurity.verifyAndParseQR(result)
      if (data) {
        setParsedQRData(data)
        // Fetch mock repair details based on repairId
        const details = mockRepairData[data.repairId as keyof typeof mockRepairData]
        if (details) {
          setRepairDetails(details)
        } else {
          setScanError("פרטי תיקון לא נמצאו עבור QR זה.")
        }
      } else {
        setScanError("קוד QR לא חוקי או פגום.")
      }
    } catch (e: any) {
      setScanError(`שגיאת אימות QR: ${e.message}`)
    }
  }

  const handleManualInput = () => {
    if (scanResult) {
      handleScan(scanResult)
    } else {
      setScanError("אנא הזן קוד QR לסריקה ידנית.")
    }
  }

  const handleStatusUpdate = async () => {
    if (!repairDetails || !newStatus) return

    setIsUpdating(true)
    setUpdateMessage("")
    try {
      const currentUser = authManager.getCurrentSession()?.user.name || "מוכר לא ידוע"
      const success = statusManager.updateStatus(repairDetails.repairId, newStatus, currentUser)

      if (success) {
        setUpdateMessage("✅ סטטוס עודכן בהצלחה!")
        // Optionally, refresh data or navigate
        setTimeout(() => router.push("/seller/dashboard"), 1500)
      } else {
        setUpdateMessage("❌ שגיאה בעדכון הסטטוס.")
      }
    } catch (error) {
      setUpdateMessage("❌ שגיאה בעדכון הסטטוס.")
      console.error("Status update error:", error)
    } finally {
      setIsUpdating(false)
    }
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
            <h1 className="text-2xl font-bold text-foreground">סריקת QR</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Scan className="h-6 w-6 text-primary" />
              סרוק QR של תכשיט או לקוח
            </CardTitle>
            <CardDescription className="text-muted-foreground">השתמש במצלמה לסריקת קוד QR או הזן ידנית</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              {!scanning && !scanResult && (
                <Button
                  onClick={() => setScanning(true)}
                  className="w-full max-w-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  התחל סריקה
                </Button>
              )}

              {scanning && (
                <div className="w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden relative">
                  <video ref={videoRef} className="w-full h-full object-cover"></video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                  </div>
                  <div className="absolute bottom-4 w-full text-center">
                    <Button variant="secondary" onClick={() => setScanning(false)}>
                      עצור סריקה
                    </Button>
                  </div>
                </div>
              )}

              {!scanning && (
                <div className="w-full space-y-2">
                  <Label htmlFor="manual-qr">הזנה ידנית של קוד QR</Label>
                  <div className="flex gap-2">
                    <Input
                      id="manual-qr"
                      placeholder="הכנס קוד QR כאן"
                      value={scanResult || ""}
                      onChange={(e) => setScanResult(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleManualInput}
                      variant="outline"
                      className="text-muted-foreground hover:text-foreground bg-transparent"
                    >
                      אמת
                    </Button>
                  </div>
                </div>
              )}

              {scanError && (
                <div className="bg-red-50/20 border border-red-200 rounded-lg p-3 text-red-800 w-full">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    <p className="font-semibold">{scanError}</p>
                  </div>
                </div>
              )}

              {parsedQRData && (
                <div className="w-full space-y-4">
                  <div className="bg-green-50/20 border border-green-200 rounded-lg p-3 text-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      <p className="font-semibold">קוד QR אומת בהצלחה!</p>
                    </div>
                  </div>

                  <Card className="shadow-md border-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-foreground">פרטי QR</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                      <p>
                        <strong>מזהה תיקון:</strong> <span className="text-foreground">{parsedQRData.repairId}</span>
                      </p>
                      <p>
                        <strong>סוג QR:</strong>{" "}
                        <span className="text-foreground">{parsedQRData.type === "product" ? "תכשיט" : "לקוח"}</span>
                      </p>
                      {parsedQRData.shopId && (
                        <p>
                          <strong>מזהה חנות:</strong> <span className="text-foreground">{parsedQRData.shopId}</span>
                        </p>
                      )}
                      {parsedQRData.productType && (
                        <p>
                          <strong>סוג תכשיט:</strong>{" "}
                          <span className="text-foreground">{parsedQRData.productType}</span>
                        </p>
                      )}
                      {parsedQRData.productBrand && (
                        <p>
                          <strong>מותג:</strong> <span className="text-foreground">{parsedQRData.productBrand}</span>
                        </p>
                      )}
                      {parsedQRData.productModel && (
                        <p>
                          <strong>דגם:</strong> <span className="text-foreground">{parsedQRData.productModel}</span>
                        </p>
                      )}
                      {parsedQRData.serialNumber && (
                        <p>
                          <strong>מספר סידורי:</strong>{" "}
                          <span className="text-foreground">{parsedQRData.serialNumber}</span>
                        </p>
                      )}
                      {parsedQRData.customerName && (
                        <p>
                          <strong>שם לקוח (מ-QR):</strong>{" "}
                          <span className="text-foreground">{parsedQRData.customerName}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {repairDetails && (
                    <Card className="shadow-md border-none">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-foreground">פרטי תיקון מהמערכת</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p>
                          <strong>לקוח:</strong> <span className="text-foreground">{repairDetails.customerName}</span>
                        </p>
                        <p>
                          <strong>תכשיט:</strong> <span className="text-foreground">{repairDetails.product}</span>
                        </p>
                        <p>
                          <strong>תקלה:</strong> <span className="text-foreground">{repairDetails.issue}</span>
                        </p>
                        <p>
                          <strong>סטטוס נוכחי:</strong>{" "}
                          <Badge variant="secondary" className="text-foreground">
                            {repairDetails.status}
                          </Badge>
                        </p>

                        {parsedQRData.type === "product" && (
                          <div className="space-y-2">
                            <Label htmlFor="new-status">עדכן סטטוס תיקון</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger>
                                <SelectValue placeholder="בחר סטטוס חדש" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="נשלח לתיקון">נשלח לתיקון</SelectItem>
                                <SelectItem value="ממתין לאיסוף">ממתין לאיסוף</SelectItem>
                                <SelectItem value="הושלם">הושלם</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={handleStatusUpdate}
                              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                              disabled={!newStatus || isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  מעדכן...
                                </>
                              ) : (
                                "עדכן סטטוס"
                              )}
                            </Button>
                            {updateMessage && (
                              <p
                                className={`mt-2 text-center ${updateMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
                              >
                                {updateMessage}
                              </p>
                            )}
                          </div>
                        )}

                        {parsedQRData.type === "customer" && repairDetails.status === "ממתין לאיסוף" && (
                          <div className="space-y-2">
                            <p className="text-lg font-semibold text-green-700">התכשיט מוכן לאיסוף על ידי הלקוח!</p>
                            <Button
                              onClick={() => handleStatusUpdate()} // Assuming "הושלם" means picked up
                              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  מעדכן...
                                </>
                              ) : (
                                "סמן כנאסף"
                              )}
                            </Button>
                            {updateMessage && (
                              <p
                                className={`mt-2 text-center ${updateMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
                              >
                                {updateMessage}
                              </p>
                            )}
                          </div>
                        )}
                        {parsedQRData.type === "customer" && repairDetails.status !== "ממתין לאיסוף" && (
                          <div className="bg-blue-50/20 border border-blue-200 rounded-lg p-3 text-blue-800">
                            <p className="font-semibold">
                              QR לקוח זה אינו מצביע על תכשיט הממתין לאיסוף. סטטוס נוכחי: {repairDetails.status}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
