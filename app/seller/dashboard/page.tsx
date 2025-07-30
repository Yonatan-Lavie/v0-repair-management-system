"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode, Plus, Scan, Wrench, Clock } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route" // Import ProtectedRoute
import { authManager } from "@/lib/auth" // Import authManager

// Import the demo data at the top
import { demoData, getDemoData } from "@/lib/demo-data"

// Replace the mockSellerData with:
const mockSellerData = {
  stats: {
    myRepairs: 8,
    pendingPickup: 3,
    completedToday: 2,
    avgProcessTime: "45 דק",
  },
  myRepairs: demoData.repairs
    .filter((repair) => repair.createdBy === "רון אביב" || repair.createdBy === "שירה לוי")
    .slice(0, 5)
    .map((repair) => ({
      repairId: repair.repairId,
      customerName: getDemoData.getCustomer(repair.customerId)?.name || "לא ידוע",
      product: `${getDemoData.getProduct(repair.productId)?.brand} ${getDemoData.getProduct(repair.productId)?.model} ${getDemoData.getProduct(repair.productId)?.type}`,
      issue: repair.issue,
      status: repair.status,
      createdAt: new Date(repair.createdAt).toLocaleDateString("he-IL"),
      qrGenerated: true,
    })),
}

export default function SellerDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(authManager.getCurrentSession()?.user.name || "מוכר")
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ממתין לאיסוף":
        return "default"
      case "נשלח לתיקון":
        return "secondary"
      case "בתהליך תיקון":
        return "secondary"
      case "הושלם":
        return "outline"
      default:
        return "default"
    }
  }

  const handleLogout = async () => {
    await authManager.logout()
    window.location.href = "/login" // Redirect to login page
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <QrCode className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">פאנל מוכר</h1>
                  <p className="text-gray-600">שלום, {username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/seller/create-repair">
                    <Plus className="h-4 w-4 mr-2" />
                    תיקון חדש
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  יציאה
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">התיקונים שלי</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockSellerData.stats.myRepairs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ממתינים לאיסוף</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockSellerData.stats.pendingPickup}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">הושלמו היום</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockSellerData.stats.completedToday}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">זמן ממוצע לטיפול</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockSellerData.stats.avgProcessTime}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  תיקון חדש
                </CardTitle>
                <CardDescription>צור בקשת תיקון חדשה עם QR כפול</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/seller/create-repair">התחל תיקון חדש</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  סריקת QR
                </CardTitle>
                <CardDescription>סרוק QR למעקב או עדכון סטטוס</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/seller/scan">פתח סורק</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR ללקוח
                </CardTitle>
                <CardDescription>שלח QR ללקוח או הדפס מחדש</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline">
                  שלח QR
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="my-repairs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="my-repairs">התיקונים שלי</TabsTrigger>
              <TabsTrigger value="pending">ממתינים לטיפול</TabsTrigger>
            </TabsList>

            <TabsContent value="my-repairs">
              <Card>
                <CardHeader>
                  <CardTitle>התיקונים שלי</CardTitle>
                  <CardDescription>כל התיקונים שיצרתי ואני מטפל בהם</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>מזהה תיקון</TableHead>
                        <TableHead>לקוח</TableHead>
                        <TableHead>תכשיט</TableHead>
                        <TableHead>תקלה</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead>תאריך</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSellerData.myRepairs.map((repair) => (
                        <TableRow key={repair.repairId}>
                          <TableCell className="font-medium">{repair.repairId}</TableCell>
                          <TableCell>{repair.customerName}</TableCell>
                          <TableCell>{repair.product}</TableCell>
                          <TableCell>{repair.issue}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(repair.status)}>{repair.status}</Badge>
                          </TableCell>
                          <TableCell>{repair.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/seller/repair/${repair.repairId}`}>פרטים</Link>
                              </Button>
                              {repair.qrGenerated && (
                                <Button variant="outline" size="sm">
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>ממתינים לטיפול</CardTitle>
                  <CardDescription>תיקונים שחזרו מהמעבדה וממתינים לאיסוף</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">אין תיקונים הממתינים לטיפול כרגע</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
