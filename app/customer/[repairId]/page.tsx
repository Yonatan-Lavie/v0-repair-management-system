import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineContent,
} from "@/components/ui/timeline"
import {
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  Package,
  User,
  Tag,
  Calendar,
  DollarSign,
  Info,
  MapPin,
} from "lucide-react"
import { demoData } from "@/lib/demo-data"
import { statusManager } from "@/lib/status-manager"
import { notFound } from "next/navigation"

interface RepairDetailsPageProps {
  params: {
    repairId: string
  }
}

export default async function CustomerRepairDetailsPage({ params }: RepairDetailsPageProps) {
  const repair = demoData.repairs.find((r) => r.id === params.repairId)

  if (!repair) {
    notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "בבדיקה":
        return <CircleDashed className="h-4 w-4" />
      case "בתיקון":
        return <Clock className="h-4 w-4" />
      case "הושלם":
        return <CircleCheck className="h-4 w-4" />
      case "נמסר":
        return <CircleCheck className="h-4 w-4" />
      case "בוטל":
        return <CircleX className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "בבדיקה":
        return "bg-yellow-100 text-yellow-800"
      case "בתיקון":
        return "bg-blue-100 text-blue-800"
      case "הושלם":
        return "bg-green-100 text-green-800"
      case "נמסר":
        return "bg-green-100 text-green-800"
      case "בוטל":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const shop = demoData.shops.find((s) => s.id === repair.shopId)
  const assignedTechnician = demoData.users.find((u) => u.id === repair.assignedTo)

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-foreground mb-6 text-center">סטטוס תיקון תכשיט</h1>

        <Card className="max-w-4xl mx-auto shadow-lg border-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Package className="w-6 h-6" /> תיקון מספר: {repair.id}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(repair.status)} text-sm font-medium`}>
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
                {shop && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> חנות:
                    </p>
                    <p className="font-medium text-foreground">{shop.name}</p>
                  </div>
                )}
              </div>

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

            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-secondary/10 border border-secondary shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-secondary-foreground">פרטי יצירת קשר</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm space-y-2">
                  <p>
                    <span className="font-medium text-foreground">טלפון:</span> {repair.customerPhone}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">מייל:</span> {repair.customerEmail || "לא סופק"}
                  </p>
                  {shop && (
                    <>
                      <Separator className="my-2 bg-border" />
                      <h4 className="font-semibold text-foreground">פרטי החנות:</h4>
                      <p>
                        <span className="font-medium text-foreground">שם:</span> {shop.name}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">כתובת:</span> {shop.address}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">טלפון:</span> {shop.phone}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
