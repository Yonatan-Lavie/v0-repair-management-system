"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Store, Wrench, Clock, CheckCircle, BarChart3 } from "lucide-react" // Added Gem icon
import { ProtectedRoute } from "@/components/auth/protected-route"
import { authManager } from "@/lib/auth"

// Import the demo data at the top
import { demoData, getDemoData } from "@/lib/demo-data"

// Replace the mockShopData with:
const mockShopData = {
  shop: demoData.shops[0], // FixIt Electronics
  stats: demoData.shops[0].stats,
  recentRepairs: demoData.repairs
    .filter((repair) => repair.shopId === "SHOP001")
    .slice(0, 5)
    .map((repair) => ({
      repairId: repair.repairId,
      customerName: getDemoData.getCustomer(repair.customerId)?.name || "לא ידוע",
      product:
        `${getDemoData.getProduct(repair.productId)?.brand || ""} ${getDemoData.getProduct(repair.productId)?.model || ""} ${getDemoData.getProduct(repair.productId)?.type || ""}`.trim(),
      issue: repair.issue,
      status: repair.status,
      createdAt: new Date(repair.createdAt).toLocaleDateString("he-IL"),
      technician: repair.assignedTechnician,
    })),
  staff: demoData.users
    .filter((user) => user.shopId === "SHOP001")
    .map((user) => ({
      name: user.name,
      role: user.role === "seller" ? "מוכר" : user.role === "technician" ? "צורף/טכנאי" : "מנהל חנות",
      activeRepairs: getDemoData
        .getRepairsByTechnician(user.name)
        .filter((r) => ["נשלח לתיקון", "התקבל", "בתהליך תיקון"].includes(r.status)).length,
    })),
}

export default function ShopDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(authManager.getCurrentSession()?.user.name || "מנהל חנות")
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ממתין לאיסוף":
        return "default"
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
    <ProtectedRoute requiredRole="shop-manager" shopId={mockShopData.shop.shopId}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Store className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{mockShopData.shop.shopName}</h1>
                  <p className="text-muted-foreground">שלום, {username}</p>
                </div>
              </div>
              <div className="flex gap-2">
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
                <CardTitle className="text-sm font-medium text-muted-foreground">תיקונים פעילים</CardTitle>
                <Wrench className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockShopData.stats.activeRepairs}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">הושלמו היום</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockShopData.stats.completedToday}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">זמן ממוצע</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockShopData.stats.avgRepairTime}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">שביעות רצון</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockShopData.stats.customerSatisfaction}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="repairs" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger
                value="repairs"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                תיקונים אחרונים
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                צוות
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                דוחות
              </TabsTrigger>
            </TabsList>

            <TabsContent value="repairs">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">תיקונים אחרונים</CardTitle>
                  <CardDescription className="text-muted-foreground">מעקב אחר כל התיקונים בחנות</CardDescription>
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
                        <TableHead>צורף/טכנאי</TableHead>
                        <TableHead>תאריך</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockShopData.recentRepairs.map((repair) => (
                        <TableRow key={repair.repairId}>
                          <TableCell className="font-medium text-foreground">{repair.repairId}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.customerName}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.product}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.issue}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(repair.status)}>{repair.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{repair.technician}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">צוות החנות</CardTitle>
                  <CardDescription className="text-muted-foreground">מידע על עובדי החנות ועומס העבודה</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>שם</TableHead>
                        <TableHead>תפקיד</TableHead>
                        <TableHead>תיקונים פעילים</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockShopData.staff.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                          <TableCell className="text-muted-foreground">{member.role}</TableCell>
                          <TableCell className="text-muted-foreground">{member.activeRepairs}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground bg-transparent"
                            >
                              צפה בפרטים
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">דוחות ואנליטיקה</CardTitle>
                  <CardDescription className="text-muted-foreground">סטטיסטיקות ודוחות מפורטים</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted" />
                    <p className="text-muted-foreground">דוחות מפורטים יתווספו בגרסה הבאה</p>
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
