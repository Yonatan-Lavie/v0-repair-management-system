import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Package, PlusCircle } from "lucide-react"
import { demoData } from "@/lib/demo-data"
import { statusManager } from "@/lib/status-manager"
import { getCurrentSession } from "@/app/actions/auth" // Import auth action
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SellerDashboardPage() {
  const session = await getCurrentSession()
  if (!session || !session.user.shopId) {
    redirect("/login")
  }

  const userShopId = session.user.shopId
  const sellerRepairs = demoData.repairs.filter((r) => r.shopId === userShopId)

  const totalRepairs = sellerRepairs.length
  const pendingRepairs = sellerRepairs.filter((r) => r.status === "בבדיקה" || r.status === "בתיקון").length
  const completedRepairs = sellerRepairs.filter((r) => r.status === "הושלם" || r.status === "נמסר").length
  const cancelledRepairs = sellerRepairs.filter((r) => r.status === "בוטל").length

  const recentRepairs = sellerRepairs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <ProtectedRoute allowedRoles={["seller", "shop-manager"]}>
      <PermissionGuard permission="repairs:read">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">לוח מחוונים - מוכר</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md border-none bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">תיקונים בסך הכל</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalRepairs}</div>
                <p className="text-xs text-muted-foreground">סה"כ תיקונים שנוצרו</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-yellow-100/10 to-yellow-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">תיקונים ממתינים</CardTitle>
                <Clock className="h-4 w-4 text-yellow-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{pendingRepairs}</div>
                <p className="text-xs text-muted-foreground">בבדיקה או בתיקון</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-green-100/10 to-green-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">תיקונים שהושלמו</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{completedRepairs}</div>
                <p className="text-xs text-muted-foreground">הושלמו או נמסרו</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-red-100/10 to-red-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">תיקונים שבוטלו</CardTitle>
                <XCircle className="h-4 w-4 text-red-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{cancelledRepairs}</div>
                <p className="text-xs text-muted-foreground">תיקונים שבוטלו</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mb-6">
            <Link href="/seller/create-repair" passHref>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="w-4 h-4 ml-2" /> יצירת תיקון חדש
              </Button>
            </Link>
          </div>

          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-secondary-foreground flex items-center gap-2">
                <Clock className="w-5 h-5" /> תיקונים אחרונים
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
                    <TableHead>עלות משוערת</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRepairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium text-foreground">{repair.id}</TableCell>
                      <TableCell className="text-muted-foreground">{repair.customerName}</TableCell>
                      <TableCell className="text-muted-foreground">{repair.itemType}</TableCell>
                      <TableCell>
                        <Badge className={statusManager.getStatusColorClass(repair.status)}>
                          {statusManager.getDisplayStatus(repair.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">₪{repair.estimatedCost.toFixed(2)}</TableCell>
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
