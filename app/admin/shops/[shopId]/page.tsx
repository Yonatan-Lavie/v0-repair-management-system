import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Users, Store, Package, MapPin, Phone, Mail } from "lucide-react"
import { demoData } from "@/lib/demo-data"
import { statusManager } from "@/lib/status-manager"
import { notFound, redirect } from "next/navigation"
import { canAccessShop } from "@/app/actions/auth" // Import auth action

interface ShopDetailsPageProps {
  params: {
    shopId: string
  }
}

export default async function AdminShopDetailsPage({ params }: ShopDetailsPageProps) {
  const shop = demoData.shops.find((s) => s.id === params.shopId)

  if (!shop) {
    notFound()
  }

  // Ensure admin or shop-manager can access their specific shop
  const hasAccess = await canAccessShop(params.shopId)
  if (!hasAccess) {
    redirect("/unauthorized")
  }

  const shopRepairs = demoData.repairs.filter((r) => r.shopId === shop.id)
  const shopUsers = demoData.users.filter((u) => u.shopId === shop.id)

  const totalRepairs = shopRepairs.length
  const pendingRepairs = shopRepairs.filter((r) => r.status === "בבדיקה" || r.status === "בתיקון").length
  const completedRepairs = shopRepairs.filter((r) => r.status === "הושלם" || r.status === "נמסר").length
  const cancelledRepairs = shopRepairs.filter((r) => r.status === "בוטל").length

  const recentRepairs = shopRepairs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <ProtectedRoute allowedRoles={["admin", "shop-manager"]}>
      <PermissionGuard permission="shops:read">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">פרטי חנות - {shop.name}</h1>

          <Card className="max-w-4xl mx-auto shadow-lg border-none mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Store className="w-6 h-6" /> פרטי החנות
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary-foreground" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-secondary-foreground" />
                <span>{shop.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-secondary-foreground" />
                <span>{shop.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary-foreground" />
                <span>שעות פתיחה: {shop.openingHours}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md border-none bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">תיקונים בסך הכל</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalRepairs}</div>
                <p className="text-xs text-muted-foreground">סה"כ תיקונים בחנות</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-secondary-foreground flex items-center gap-2">
                  <Users className="w-5 h-5" /> צוות החנות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם</TableHead>
                      <TableHead>תפקיד</TableHead>
                      <TableHead>מייל</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shopUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.role}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </PermissionGuard>
    </ProtectedRoute>
  )
}
