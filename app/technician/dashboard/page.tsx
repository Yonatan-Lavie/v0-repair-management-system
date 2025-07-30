import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Package, Hammer } from "lucide-react"
import { demoData } from "@/lib/demo-data"
import { statusManager } from "@/lib/status-manager"
import { getCurrentSession } from "@/app/actions/auth" // Import auth action
import { redirect } from "next/navigation"

export default async function TechnicianDashboardPage() {
  const session = await getCurrentSession()
  if (!session || !session.user.shopId) {
    redirect("/login")
  }

  const userShopId = session.user.shopId
  const technicianId = session.user.id

  const assignedRepairs = demoData.repairs.filter((r) => r.assignedTo === technicianId && r.shopId === userShopId)

  const totalAssignedRepairs = assignedRepairs.length
  const pendingAssignedRepairs = assignedRepairs.filter((r) => r.status === "בבדיקה" || r.status === "בתיקון").length
  const completedAssignedRepairs = assignedRepairs.filter((r) => r.status === "הושלם" || r.status === "נמסר").length
  const cancelledAssignedRepairs = assignedRepairs.filter((r) => r.status === "בוטל").length

  const recentAssignedRepairs = assignedRepairs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <ProtectedRoute allowedRoles={["technician", "shop-manager"]}>
      <PermissionGuard permission="repairs:read">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">לוח מחוונים - צורף/טכנאי</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md border-none bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">תיקונים שהוקצו</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalAssignedRepairs}</div>
                <p className="text-xs text-muted-foreground">סה"כ תיקונים שהוקצו לך</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-yellow-100/10 to-yellow-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">תיקונים פעילים</CardTitle>
                <Clock className="h-4 w-4 text-yellow-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{pendingAssignedRepairs}</div>
                <p className="text-xs text-muted-foreground">בבדיקה או בתיקון</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-green-100/10 to-green-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">תיקונים שהושלמו</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{completedAssignedRepairs}</div>
                <p className="text-xs text-muted-foreground">הושלמו או נמסרו</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-red-100/10 to-red-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">תיקונים שבוטלו</CardTitle>
                <XCircle className="h-4 w-4 text-red-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{cancelledAssignedRepairs}</div>
                <p className="text-xs text-muted-foreground">תיקונים שבוטלו</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-secondary-foreground flex items-center gap-2">
                <Hammer className="w-5 h-5" /> תיקונים שהוקצו לי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>מספר תיקון</TableHead>
                    <TableHead>לקוח</TableHead>
                    <TableHead>תכשיט</TableHead>
                    <TableHead>סטטוס</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssignedRepairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium text-foreground">{repair.id}</TableCell>
                      <TableCell className="text-muted-foreground">{repair.customerName}</TableCell>
                      <TableCell className="text-muted-foreground">{repair.itemType}</TableCell>
                      <TableCell>
                        <Badge className={statusManager.getStatusColorClass(repair.status)}>
                          {statusManager.getDisplayStatus(repair.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    </ProtectedRoute>
  )
}
