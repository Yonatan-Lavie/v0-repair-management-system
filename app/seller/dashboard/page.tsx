"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode, Plus, Scan, Wrench, Clock, Gem, CheckCircle } from "lucide-react" // Added Gem and CheckCircle icons
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { authManager } from "@/lib/auth"

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
      product:
        `${getDemoData.getProduct(repair.productId)?.brand || ""} ${getDemoData.getProduct(repair.productId)?.model || ""} ${getDemoData.getProduct(repair.productId)?.type || ""}`.trim(),
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
    window.location.href = "/login"
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Gem className="h-8 w-8 text-primary" /> {/* Changed icon to Gem */}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">פאנל מוכר</h1>
                  <p className="text-muted-foreground">שלום, {username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/seller/create-repair">
                    <Plus className="h-4 w-4 mr-2" />
                    תיקון חדש
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground bg-transparent"
                >
                  יציאה
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">התיקונים שלי</CardTitle>
                <Wrench className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockSellerData.stats.myRepairs}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">ממתינים לאיסוף</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockSellerData.stats.pendingPickup}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">הושלמו היום</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" /> {/* Changed icon to CheckCircle */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockSellerData.stats.completedToday}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">זמן ממוצע לטיפול</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockSellerData.stats.avgProcessTime}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Plus className="h-5 w-5 text-primary" />
                  תיקון חדש
                </CardTitle>
                <CardDescription className="text-muted-foreground">צור בקשת תיקון חדשה עם QR כפול</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/seller/create-repair">התחל תיקון חדש</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow border-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Scan className="h-5 w-5 text-primary" />
                  סריקת QR
                </CardTitle>
                <CardDescription className="text-muted-foreground">סרוק QR למעקב או עדכון סטטוס</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                  variant="outline"
                  asChild
                >
                  <Link href="/seller/scan">פתח סורק</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow border-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <QrCode className="h-5 w-5 text-primary" />
                  QR ללקוח
                </CardTitle>
                <CardDescription className="text-muted-foreground">שלח QR ללקוח או הדפס מחדש</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                  variant="outline"
                >
                  שלח QR
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="my-repairs" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger
                value="my-repairs"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                התיקונים שלי
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                ממתינים לטיפול
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-repairs">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">התיקונים שלי</CardTitle>
                  <CardDescription className="text-muted-foreground">כל התיקונים שיצרתי ואני מטפל בהם</CardDescription>
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
                          <TableCell className="font-medium text-foreground">{repair.repairId}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.customerName}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.product}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.issue}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(repair.status)}>{repair.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{repair.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-muted-foreground hover:text-foreground bg-transparent"
                              >
                                <Link href={`/seller/repair/${repair.repairId}`}>פרטים</Link>
                              </Button>
                              {repair.qrGenerated && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground bg-transparent"
                                >
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
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">ממתינים לטיפול</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    תיקונים שחזרו מהמעבדה וממתינים לאיסוף
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted" />
                    <p className="text-muted-foreground">אין תיקונים הממתינים לטיפול כרגע</p>
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
