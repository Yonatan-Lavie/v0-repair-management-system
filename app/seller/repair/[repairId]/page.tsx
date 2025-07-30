import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Tag,
  Calendar,
  Info,
  QrCode,
  History,
  Hammer,
  Package,
  Loader2,
} from "lucide-react"
import { demoData } from "@/lib/demo-data"
import { statusManager } from "@/lib/status-manager"
import { notFound, redirect } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateRepairStatus as updateRepairStatusAction } from "@/app/actions/repair" // Assuming this action exists
import { generateSecureQRURL } from "@/app/actions/qr" // Import QR action
import { getCurrentSession, canAccessShop } from "@/app/actions/auth" // Import auth actions
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineContent,
} from "@/components/ui/timeline" // Import timeline components

interface RepairDetailsPageProps {
  params: {
    repairId: string
  }
}
// This component should be a client component if it uses useState/useToast
// For now, assuming it's a client component and will be wrapped by ProtectedRoute
;("use client")

export default function SellerRepairDetailsPage({ params }: RepairDetailsPageProps) {
  const { toast } = useToast()
  const [repair, setRepair] = useState(() => demoData.repairs.find((r) => r.id === params.repairId))
  const [newStatus, setNewStatus] = useState(repair?.status || "")
  const [statusNotes, setStatusNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Initial check for repair existence and shop access
  useState(async () => {
    if (!repair) {
      notFound()
    }
    const hasAccess = await canAccessShop(repair.shopId)
    if (!hasAccess) {
      redirect("/unauthorized")
    }
  })

  if (!repair) {
    return null // Should be handled by notFound() above
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "בבדיקה":
        return <Clock className="h-4 w-4" />
      case "בתיקון":
        return <Hammer className="h-4 w-4" />
      case "הושלם":
        return <CheckCircle className="h-4 w-4" />
      case "נמסר":
        return <CheckCircle className="h-4 w-4" />
      case "בוטל":
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const handleStatusUpdate = async () => {
    setIsLoading(true)
    try {
      const session = await getCurrentSession()
      if (!session) {
        toast({
          title: "שגיאה",
          description: "אין סשן פעיל. אנא התחבר מחדש.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const updatedRepair = {
        ...repair,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history: [
          ...repair.history,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            by: session.user.name,
            notes: statusNotes,
          },
        ],
      }

      // Call server action to update repair status
      const result = await updateRepairStatusAction(updatedRepair) // Assuming this action exists

      if (result.success) {
        setRepair(updatedRepair)
        setStatusNotes("")
        toast({
          title: "סטטוס עודכן בהצלחה!",
          description: `התיקון עודכן לסטטוס: ${statusManager.getDisplayStatus(newStatus)}`,
        })
      } else {
        toast({
          title: "שגיאה בעדכון סטטוס",
          description: result.error || "נסה שוב מאוחר יותר.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "שגיאה בלתי צפויה",
        description: "אירעה שגיאה בעת עדכון הסטטוס.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateQR = async () => {
    setIsLoading(true)
    try {
      const qrUrl = await generateSecureQRURL({
        repairId: repair.id,
        type: "product",
        shopId: repair.shopId,
        productType: repair.itemType,
        productBrand: repair.itemBrand,
        productModel: repair.itemModel,
        serialNumber: repair.serialNumber,
      })
      setQrCodeUrl(qrUrl)
      toast({
        title: "קוד QR נוצר בהצלחה!",
        description: "הקישור לקוד QR מוכן.",
      })
    } catch (error) {
      console.error("Failed to generate QR:", error)
      toast({
        title: "שגיאה ביצירת QR",
        description: "אירעה שגיאה בעת יצירת קוד ה-QR.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const assignedTechnician = demoData.users.find((u) => u.id === repair.assignedTo)

  return (
    <ProtectedRoute allowedRoles={["seller", "shop-manager", "technician"]}>
      <PermissionGuard permission="repairs:read">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">פרטי תיקון תכשיט</h1>

          <Card className="max-w-4xl mx-auto shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Package className="w-6 h-6" /> תיקון מספר: {repair.id}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${statusManager.getStatusColorClass(repair.status)} text-sm font-medium`}>
                  {statusManager.getDisplayStatus(repair.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Repair Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <User className="w-4 h-4" /> שם לקוח:
                    </p>
                    <p className="font-medium text-foreground">{repair.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <Tag className="w-4 h-4" /> סוג תכשיט:
                    </p>
                    <p className="font-medium text-foreground">{repair.itemType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <Info className="w-4 h-4" /> תיאור תקלה:
                    </p>
                    <p className="font-medium text-foreground">{repair.issueDescription}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> עלות משוערת:
                    </p>
                    <p className="font-medium text-foreground">₪{repair.estimatedCost.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> תאריך פתיחה:
                    </p>
                    <p className="font-medium text-foreground">
                      {new Date(repair.createdAt).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> עדכון אחרון:
                    </p>
                    <p className="font-medium text-foreground">
                      {new Date(repair.updatedAt).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                  {assignedTechnician && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm flex items-center gap-1">
                        <User className="w-4 h-4" /> צורף/טכנאי אחראי:
                      </p>
                      <p className="font-medium text-foreground">{assignedTechnician.name}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6 bg-border" />

                {/* Update Status Section */}
                <PermissionGuard permission="repairs:update" fallback={null}>
                  <h3 className="text-xl font-bold text-secondary-foreground mb-4 flex items-center gap-2">
                    <History className="w-5 h-5" /> עדכון סטטוס
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newStatus">סטטוס חדש</Label>
                      <Select onValueChange={setNewStatus} value={newStatus}>
                        <SelectTrigger id="newStatus" className="text-foreground">
                          <SelectValue placeholder="בחר סטטוס" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusManager.getAllStatuses().map((status) => (
                            <SelectItem key={status} value={status}>
                              {statusManager.getDisplayStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statusNotes">הערות (אופציונלי)</Label>
                      <Textarea
                        id="statusNotes"
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        rows={2}
                        className="text-foreground"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleStatusUpdate}
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        מעדכן...
                      </>
                    ) : (
                      "עדכן סטטוס"
                    )}
                  </Button>
                </PermissionGuard>

                <Separator className="my-6 bg-border" />

                {/* Repair History Timeline */}
                <h3 className="text-xl font-bold text-secondary-foreground mb-4">היסטוריית סטטוס</h3>
                <Timeline>
                  {repair.history.map((entry, index) => (
                    <TimelineItem key={index}>
                      <TimelineConnector />
                      <TimelineHeader>
                        <TimelineIcon className="bg-primary text-primary-foreground">
                          {getStatusIcon(entry.status)}
                        </TimelineIcon>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">
                            {statusManager.getDisplayStatus(entry.status)}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString("he-IL")}
                          </span>
                        </div>
                      </TimelineHeader>
                      <TimelineContent className="text-muted-foreground">
                        {entry.notes && <p>{entry.notes}</p>}
                        <p className="text-xs">ע"י: {entry.by}</p>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>

              {/* QR Code Section */}
              <div className="lg:col-span-1 space-y-6">
                <PermissionGuard permission="qr:generate" fallback={null}>
                  <Card className="bg-secondary/10 border border-secondary shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-secondary-foreground flex items-center gap-2">
                        <QrCode className="w-5 h-5" /> קוד QR לתיקון
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm space-y-4">
                      <p>צור קוד QR ייחודי לתיקון זה כדי לאפשר מעקב קל ללקוחות ולצוות.</p>
                      <Button
                        onClick={handleGenerateQR}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            יוצר...
                          </>
                        ) : (
                          "צור קוד QR"
                        )}
                      </Button>
                      {qrCodeUrl && (
                        <div className="mt-4 text-center">
                          <img
                            src={qrCodeUrl || "/placeholder.svg"}
                            alt="QR Code for Repair"
                            className="w-48 h-48 mx-auto border border-border p-2 rounded-md"
                          />
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
                </PermissionGuard>
              </div>
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    </ProtectedRoute>
  )
}
