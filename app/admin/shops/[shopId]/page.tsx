"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Store, Settings, BarChart3, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route" // Import ProtectedRoute

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
                ? "צורף/טכנאי" // Changed label
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
          product: `${getDemoData.getProduct(repair.productId)?.brand} ${getDemoData.getProduct(repair.productId)?.model} ${getDemoData.getProduct(repair.productId)?.type}`, // Updated product display
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
    return <div>חנות לא נמצאה</div>
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    חזור
                  </Link>
                </Button>
                <Store className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{shopData.shopName}</h1>
                  <p className="text-gray-600">{shopData.location}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "שמור שינויים" : "ערוך פרטים"}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">סה"כ תיקונים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.stats.totalRepairs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">פעילים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.stats.activeRepairs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">החודש</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.stats.completedThisMonth}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">זמן ממוצע</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.stats.avgRepairTime}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">שביעות רצון</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.stats.customerSatisfaction}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">פרטים כלליים</TabsTrigger>
              <TabsTrigger value="staff">ניהול צוות</TabsTrigger>
              <TabsTrigger value="repairs">תיקונים אחרונים</TabsTrigger>
              <TabsTrigger value="analytics">אנליטיקה</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>פרטי החנות</CardTitle>
                  <CardDescription>מידע בסיסי על החנות ומנהל החנות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">פרטי החנות</h3>
                      <div className="space-y-2">
                        <Label>שם החנות</Label>
                        <Input value={shopData.shopName} disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>כתובת</Label>
                        <Input value={shopData.address} disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>טלפון</Label>
                        <Input value={shopData.phone} disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>מייל</Label>
                        <Input value={shopData.email} disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">מנהל החנות</h3>
                      <div className="space-y-2">
                        <Label>שם מלא</Label>
                        <Input value={shopData.manager.name} disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>מייל</Label>
                        <Input value={shopData.manager.email} disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>טלפון</Label>
                        <Input value={shopData.manager.phone} disabled={!isEditing} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>צוות החנות</CardTitle>
                      <CardDescription>ניהול עובדי החנות והרשאות</CardDescription>
                    </div>
                    <Button>
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
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
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
              <Card>
                <CardHeader>
                  <CardTitle>תיקונים אחרונים</CardTitle>
                  <CardDescription>פעילות תיקונים בחנות</CardDescription>
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
                          <TableCell className="font-medium">{repair.repairId}</TableCell>
                          <TableCell>{repair.customer}</TableCell>
                          <TableCell>{repair.product}</TableCell>
                          <TableCell>
                            <Badge variant="default">{repair.status}</Badge>
                          </TableCell>
                          <TableCell>{repair.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>אנליטיקה מתקדמת</CardTitle>
                  <CardDescription>נתונים מפורטים על ביצועי החנות</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">אנליטיקה מתקדמת תתווסף בגרסה הבאה</p>
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
