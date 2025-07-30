import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FileText, Download, Filter, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import { demoData } from "@/lib/demo-data"
import { statusManager } from "@/lib/status-manager"
import { getCurrentSession } from "@/app/actions/auth" // Import auth action
import { redirect } from "next/navigation"
;("use client")

import { Label } from "@/components/ui/label"

export default function ShopReportsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterTechnician, setFilterTechnician] = useState("all")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [shopRepairs, setShopRepairs] = useState<any[]>([])
  const [shopUsers, setShopUsers] = useState<any[]>([])

  // Fetch session and filter data on client side
  useState(() => {
    const fetchData = async () => {
      const session = await getCurrentSession()
      if (!session || !session.user.shopId) {
        redirect("/login")
        return
      }
      const userShopId = session.user.shopId
      const repairs = demoData.repairs.filter((r) => r.shopId === userShopId)
      const users = demoData.users.filter((u) => u.shopId === userShopId && u.role === "technician")
      setShopRepairs(repairs)
      setShopUsers(users)
    }
    fetchData()
  })

  const getFilteredRepairs = () => {
    let filtered = shopRepairs

    if (filterStatus !== "all") {
      filtered = filtered.filter((repair) => repair.status === filterStatus)
    }

    if (filterTechnician !== "all") {
      filtered = filtered.filter((repair) => repair.assignedTo === filterTechnician)
    }

    const now = new Date()
    if (filterPeriod === "last7days") {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
      filtered = filtered.filter((repair) => new Date(repair.createdAt) >= sevenDaysAgo)
    } else if (filterPeriod === "last30days") {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      filtered = filtered.filter((repair) => new Date(repair.createdAt) >= thirtyDaysAgo)
    } else if (filterPeriod === "thismonth") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      filtered = filtered.filter((repair) => new Date(repair.createdAt) >= startOfMonth)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const filteredRepairs = getFilteredRepairs()

  const totalRevenue = filteredRepairs
    .filter((r) => r.status === "הושלם" || r.status === "נמסר")
    .reduce((sum, repair) => sum + repair.estimatedCost, 0)

  const totalCompleted = filteredRepairs.filter((r) => r.status === "הושלם" || r.status === "נמסר").length
  const totalPending = filteredRepairs.filter((r) => r.status === "בבדיקה" || r.status === "בתיקון").length
  const totalCancelled = filteredRepairs.filter((r) => r.status === "בוטל").length

  const handleDownloadReport = () => {
    const headers = ["מספר תיקון", "לקוח", "תכשיט", "סטטוס", "עלות משוערת", "צורף/טכנאי", "תאריך פתיחה"]
    const rows = filteredRepairs.map((repair) => [
      repair.id,
      repair.customerName,
      repair.itemType,
      statusManager.getDisplayStatus(repair.status),
      repair.estimatedCost.toFixed(2),
      demoData.users.find((u) => u.id === repair.assignedTo)?.name || "N/A",
      new Date(repair.createdAt).toLocaleDateString("he-IL"),
    ])

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "repair_report.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["shop-manager"]}>
      <PermissionGuard permission="reports:read">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">דוחות חנות</h1>

          <Card className="max-w-full mx-auto shadow-lg border-none mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Filter className="w-6 h-6" /> אפשרויות סינון
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filterStatus">סטטוס</Label>
                <Select onValueChange={setFilterStatus} value={filterStatus}>
                  <SelectTrigger id="filterStatus" className="text-foreground">
                    <SelectValue placeholder="כל הסטטוסים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הסטטוסים</SelectItem>
                    {statusManager.getAllStatuses().map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusManager.getDisplayStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterTechnician">צורף/טכנאי</Label>
                <Select onValueChange={setFilterTechnician} value={filterTechnician}>
                  <SelectTrigger id="filterTechnician" className="text-foreground">
                    <SelectValue placeholder="כל הצורפים/טכנאים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הצורפים/טכנאים</SelectItem>
                    {shopUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterPeriod">תקופה</Label>
                <Select onValueChange={setFilterPeriod} value={filterPeriod}>
                  <SelectTrigger id="filterPeriod" className="text-foreground">
                    <SelectValue placeholder="כל התקופות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל התקופות</SelectItem>
                    <SelectItem value="last7days">7 ימים אחרונים</SelectItem>
                    <SelectItem value="last30days">30 ימים אחרונים</SelectItem>
                    <SelectItem value="thismonth">חודש נוכחי</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md border-none bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">הכנסות משוערות</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₪{totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">מתיקונים שהושלמו</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-yellow-100/10 to-yellow-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">תיקונים ממתינים</CardTitle>
                <Clock className="h-4 w-4 text-yellow-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalPending}</div>
                <p className="text-xs text-muted-foreground">בבדיקה או בתיקון</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-green-100/10 to-green-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">תיקונים שהושלמו</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalCompleted}</div>
                <p className="text-xs text-muted-foreground">הושלמו או נמסרו</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-none bg-gradient-to-br from-red-100/10 to-red-100/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">תיקונים שבוטלו</CardTitle>
                <XCircle className="h-4 w-4 text-red-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalCancelled}</div>
                <p className="text-xs text-muted-foreground">תיקונים שבוטלו</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-secondary-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" /> רשימת תיקונים
              </CardTitle>
              <Button onClick={handleDownloadReport} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="w-4 h-4 ml-2" /> הורד דוח CSV
              </Button>
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
                    <TableHead>צורף/טכנאי</TableHead>
                    <TableHead>תאריך פתיחה</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepairs.map((repair) => (
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
                      <TableCell className="text-muted-foreground">
                        {demoData.users.find((u) => u.id === repair.assignedTo)?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(repair.createdAt).toLocaleDateString("he-IL")}
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
