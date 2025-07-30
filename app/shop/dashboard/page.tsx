"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Store, Wrench, Clock, CheckCircle, BarChart3 } from "lucide-react"
import Link from "next/link"

// Mock data for shop
const mockShopData = {
  shop: {
    shopId: "SHOP001",
    shopName: "FixIt Electronics",
    location: "תל אביב",
    manager: "דנה ברק",
  },
  stats: {
    activeRepairs: 12,
    completedToday: 5,
    avgRepairTime: "3.2 ימים",
    customerSatisfaction: "4.8/5",
  },
  recentRepairs: [
    {
      repairId: "REPAIR001",
      customerName: "רועי כהן",
      product: "Samsung Galaxy S21",
      issue: "לא נדלק",
      status: "ממתין לאיסוף",
      createdAt: "2025-07-20",
      technician: "יוסי בן-חיים",
    },
    {
      repairId: "REPAIR002",
      customerName: "מאיה לוי",
      product: "iPad Pro",
      issue: "סדק במסך",
      status: "בתהליך תיקון",
      createdAt: "2025-07-25",
      technician: "יוסי בן-חיים",
    },
    {
      repairId: "REPAIR003",
      customerName: "דני אברהם",
      product: "iPhone 13",
      issue: "בעיית סוללה",
      status: "הושלם",
      createdAt: "2025-07-26",
      technician: "יוסי בן-חיים",
    },
  ],
  staff: [
    { name: "מוכר 1", role: "מוכר", activeRepairs: 8 },
    { name: "מוכר 2", role: "מוכר", activeRepairs: 4 },
    { name: "יוסי בן-חיים", role: "טכנאי", activeRepairs: 12 },
  ],
}

export default function ShopDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "מנהל חנות")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockShopData.shop.shopName}</h1>
                <p className="text-gray-600">שלום, {username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">יציאה</Link>
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
              <CardTitle className="text-sm font-medium">תיקונים פעילים</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockShopData.stats.activeRepairs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">הושלמו היום</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockShopData.stats.completedToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">זמן ממוצע</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockShopData.stats.avgRepairTime}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">שביעות רצון</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockShopData.stats.customerSatisfaction}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="repairs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="repairs">תיקונים אחרונים</TabsTrigger>
            <TabsTrigger value="staff">צוות</TabsTrigger>
            <TabsTrigger value="reports">דוחות</TabsTrigger>
          </TabsList>

          <TabsContent value="repairs">
            <Card>
              <CardHeader>
                <CardTitle>תיקונים אחרונים</CardTitle>
                <CardDescription>מעקב אחר כל התיקונים בחנות</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>מזהה תיקון</TableHead>
                      <TableHead>לקוח</TableHead>
                      <TableHead>מוצר</TableHead>
                      <TableHead>תקלה</TableHead>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>טכנאי</TableHead>
                      <TableHead>תאריך</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockShopData.recentRepairs.map((repair) => (
                      <TableRow key={repair.repairId}>
                        <TableCell className="font-medium">{repair.repairId}</TableCell>
                        <TableCell>{repair.customerName}</TableCell>
                        <TableCell>{repair.product}</TableCell>
                        <TableCell>{repair.issue}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(repair.status)}>{repair.status}</Badge>
                        </TableCell>
                        <TableCell>{repair.technician}</TableCell>
                        <TableCell>{repair.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>צוות החנות</CardTitle>
                <CardDescription>מידע על עובדי החנות ועומס העבודה</CardDescription>
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
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.activeRepairs}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
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
            <Card>
              <CardHeader>
                <CardTitle>דוחות ואנליטיקה</CardTitle>
                <CardDescription>סטטיסטיקות ודוחות מפורטים</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">דוחות מפורטים יתווספו בגרסה הבאה</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
