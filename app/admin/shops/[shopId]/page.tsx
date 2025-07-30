"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Store, Settings, BarChart3, Plus, Edit } from "lucide-react" // Added Gem icon
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Import the demo data at the top
import { demoData, getDemoData } from "@/lib/demo-data"

// Replace the mockShopDetails with:
const mockShopDetails = Object.fromEntries(
  demoData.shops.map((shop) => [
    shop.shopId,
    {
      ...shop,
      staff: demoData.users
        .filter((user) => user.shopId === shop.shopId)
        .map((user) => ({
          id: user.id,
          name: user.name,
          role:
            user.role === "seller"
              ? "מוכר"
              : user.role === "technician"
                ? "צורף/טכנאי"
                : user.role === "shop-manager"
                  ? "מנהל חנות"
                  : user.role,
          email: user.email,
          status: user.status,
        })),
      recentRepairs: demoData.repairs
        .filter((repair) => repair.shopId === shop.shopId)
        .slice(0, 5)
        .map((repair) => ({
          repairId: repair.repairId,
          customer: getDemoData.getCustomer(repair.customerId)?.name || "לא ידוע",
          product:
            `${getDemoData.getProduct(repair.productId)?.brand || ""} ${getDemoData.getProduct(repair.productId)?.model || ""} ${getDemoData.getProduct(repair.productId)?.type || ""}`.trim(),
          status: repair.status,
          date: new Date(repair.createdAt).toLocaleDateString("he-IL"),
        })),
    },
  ]),
)

export default function ShopDetails() {
  const params = useParams()
  const shopId = params.shopId as string
  const [isEditing, setIsEditing] = useState(false)
  const [shopData, setShopData] = useState(mockShopDetails[shopId as keyof typeof mockShopDetails])

  if (!shopData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">חנות לא נמצאה</div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "פעיל":
        return "default"
      case "לא פעיל":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/admin/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    חזור
                  </Link>
                </Button>
                <Store className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{shopData.shopName}</h1>
                  <p className="text-muted-foreground">{shopData.location}</p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "שמור שינויים" : "ערוך פרטים"}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">סה"כ תיקונים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{shopData.stats.totalRepairs}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">פעילים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{shopData.stats.activeRepairs}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">החודש</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{shopData.stats.completedThisMonth}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">זמן ממוצע</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{shopData.stats.avgRepairTime}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">שביעות רצון</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{shopData.stats.customerSatisfaction}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                פרטים כלליים
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                ניהול צוות
              </TabsTrigger>
              <TabsTrigger
                value="repairs"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                תיקונים אחרונים
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                אנליטיקה
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">פרטי החנות</CardTitle>
                  <CardDescription className="text-muted-foreground">מידע בסיסי על החנות ומנהל החנות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">פרטי החנות</h3>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">שם החנות</Label>
                        <Input value={shopData.shopName} disabled={!isEditing} className="text-foreground" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">כתובת</Label>
                        <Input value={shopData.address} disabled={!isEditing} className="text-foreground" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">טלפון</Label>
                        <Input value={shopData.phone} disabled={!isEditing} className="text-foreground" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">מייל</Label>
                        <Input value={shopData.email} disabled={!isEditing} className="text-foreground" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">מנהל החנות</h3>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">שם מלא</Label>
                        <Input value={shopData.manager.name} disabled={!isEditing} className="text-foreground" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">מייל</Label>
                        <Input value={shopData.manager.email} disabled={!isEditing} className="text-foreground" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">טלפון</Label>
                        <Input value={shopData.manager.phone} disabled={!isEditing} className="text-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">צוות החנות</CardTitle>
                      <CardDescription className="text-muted-foreground">ניהול עובדי החנות והרשאות</CardDescription>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      הוסף עובד
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>שם</TableHead>
                        <TableHead>תפקיד</TableHead>
                        <TableHead>מייל</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shopData.staff.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                          <TableCell className="text-muted-foreground">{member.role}</TableCell>
                          <TableCell className="text-muted-foreground">{member.email}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground bg-transparent"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground bg-transparent"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="repairs">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">תיקונים אחרונים</CardTitle>
                  <CardDescription className="text-muted-foreground">פעילות תיקונים בחנות</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>מזהה תיקון</TableHead>
                        <TableHead>לקוח</TableHead>
                        <TableHead>תכשיט</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead>תאריך</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shopData.recentRepairs.map((repair) => (
                        <TableRow key={repair.repairId}>
                          <TableCell className="font-medium text-foreground">{repair.repairId}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.customer}</TableCell>
                          <TableCell className="text-muted-foreground">{repair.product}</TableCell>
                          <TableCell>
                            <Badge variant="default">{repair.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{repair.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">אנליטיקה מתקדמת</CardTitle>
                  <CardDescription className="text-muted-foreground">נתונים מפורטים על ביצועי החנות</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted" />
                    <p className="text-muted-foreground">אנליטיקה מתקדמת תתווסף בגרסה הבאה</p>
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
