"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Store, Users, Activity, Plus, Settings } from "lucide-react" // Added Gem icon
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { authManager } from "@/lib/auth"

// Import the demo data at the top
import { demoData } from "@/lib/demo-data"

// Replace the mockData object with:
const mockData = {
  shops: demoData.shops.map((shop) => ({
    shopId: shop.shopId,
    shopName: shop.shopName,
    location: shop.location,
    manager: shop.manager.name, // Extract just the name
    activeRepairs: shop.stats.activeRepairs,
    totalRepairs: shop.stats.totalRepairs,
    status: shop.status,
  })),
  systemStats: demoData.systemStats,
}

export default function AdminDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(authManager.getCurrentSession()?.user.name || "מנהל מערכת")
  }, [])

  const handleLogout = async () => {
    await authManager.logout()
    window.location.href = "/login"
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">פאנל מנהל מערכת</h1>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">סה"כ חנויות</CardTitle>
                <Store className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockData.systemStats.totalShops}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">סה"כ משתמשים</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockData.systemStats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">תיקונים פעילים</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockData.systemStats.activeRepairs}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">תיקונים שהושלמו</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockData.systemStats.completedRepairs}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="shops" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger
                value="shops"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                ניהול חנויות
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                ניהול משתמשים
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                הגדרות מערכת
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shops">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">חנויות במערכת</CardTitle>
                      <CardDescription className="text-muted-foreground">ניהול וצפייה בכל החנויות</CardDescription>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                          <TableCell className="font-medium text-foreground">{shop.shopName}</TableCell>
                          <TableCell className="text-muted-foreground">{shop.location}</TableCell>
                          <TableCell className="text-muted-foreground">{shop.manager}</TableCell>
                          <TableCell className="text-muted-foreground">{shop.activeRepairs}</TableCell>
                          <TableCell className="text-muted-foreground">{shop.totalRepairs}</TableCell>
                          <TableCell>
                            <Badge variant="default">{shop.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-muted-foreground hover:text-foreground bg-transparent"
                            >
                              <Link href={`/admin/shops/${shop.shopId}`}>
                                <Settings className="h-4 w-4" />
                              </Link>
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
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">ניהול משתמשים</CardTitle>
                  <CardDescription className="text-muted-foreground">הוספה ועריכה של משתמשי המערכת</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted" />
                    <p className="text-muted-foreground">ניהול משתמשים יתווסף בגרסה הבאה</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system">
              <Card className="shadow-lg border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">הגדרות מערכת</CardTitle>
                  <CardDescription className="text-muted-foreground">תצורה כללית של המערכת</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-muted" />
                    <p className="text-muted-foreground">הגדרות מערכת יתווספו בגרסה הבאה</p>
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
