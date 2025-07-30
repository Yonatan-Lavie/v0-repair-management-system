"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Store, Users, Activity, Plus, Settings } from "lucide-react"
import Link from "next/link"

// Mock data
const mockData = {
  shops: [
    {
      shopId: "SHOP001",
      shopName: "FixIt Electronics",
      location: "תל אביב",
      manager: "דנה ברק",
      activeRepairs: 12,
      totalRepairs: 156,
      status: "פעיל",
    },
    {
      shopId: "SHOP002",
      shopName: "TechFix Pro",
      location: "חיפה",
      manager: "אבי כהן",
      activeRepairs: 8,
      totalRepairs: 89,
      status: "פעיל",
    },
  ],
  systemStats: {
    totalShops: 2,
    totalUsers: 15,
    activeRepairs: 20,
    completedRepairs: 245,
  },
}

export default function AdminDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "מנהל מערכת")
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">פאנל מנהל מערכת</h1>
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
              <CardTitle className="text-sm font-medium">סה"כ חנויות</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.systemStats.totalShops}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">סה"כ משתמשים</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.systemStats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">תיקונים פעילים</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.systemStats.activeRepairs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">תיקונים שהושלמו</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.systemStats.completedRepairs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="shops" className="space-y-4">
          <TabsList>
            <TabsTrigger value="shops">ניהול חנויות</TabsTrigger>
            <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
            <TabsTrigger value="system">הגדרות מערכת</TabsTrigger>
          </TabsList>

          <TabsContent value="shops">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>חנויות במערכת</CardTitle>
                    <CardDescription>ניהול וצפייה בכל החנויות</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    הוסף חנות חדשה
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם החנות</TableHead>
                      <TableHead>מיקום</TableHead>
                      <TableHead>מנהל</TableHead>
                      <TableHead>תיקונים פעילים</TableHead>
                      <TableHead>סה"כ תיקונים</TableHead>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.shops.map((shop) => (
                      <TableRow key={shop.shopId}>
                        <TableCell className="font-medium">{shop.shopName}</TableCell>
                        <TableCell>{shop.location}</TableCell>
                        <TableCell>{shop.manager}</TableCell>
                        <TableCell>{shop.activeRepairs}</TableCell>
                        <TableCell>{shop.totalRepairs}</TableCell>
                        <TableCell>
                          <Badge variant="default">{shop.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>ניהול משתמשים</CardTitle>
                <CardDescription>הוספה ועריכה של משתמשי המערכת</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">ניהול משתמשים יתווסף בגרסה הבאה</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>הגדרות מערכת</CardTitle>
                <CardDescription>תצורה כללית של המערכת</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">הגדרות מערכת יתווספו בגרסה הבאה</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
