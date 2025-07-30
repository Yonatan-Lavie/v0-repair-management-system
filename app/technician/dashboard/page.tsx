"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wrench, Scan, Clock, CheckCircle, Package } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route" // Import ProtectedRoute
import { authManager } from "@/lib/auth" // Import authManager
import { statusManager } from "@/lib/status-manager" // Import statusManager

// Import the demo data at the top
import { demoData, getDemoData } from "@/lib/demo-data"

// Replace the mockTechnicianData with:
const mockTechnicianData = {
  stats: {
    assignedRepairs: 5,
    inProgress: 2,
    completedToday: 3,
    avgRepairTime: "2.1 ימים",
  },
  assignedRepairs: demoData.repairs
    .filter((repair) => repair.assignedTechnician === "יוסי בן-חיים")
    .map((repair) => ({
      repairId: repair.repairId,
      product: `${getDemoData.getProduct(repair.productId)?.brand} ${getDemoData.getProduct(repair.productId)?.model} ${getDemoData.getProduct(repair.productId)?.type}`,
      issue: repair.issue,
      status: repair.status,
      receivedAt: new Date(repair.createdAt).toLocaleDateString("he-IL"),
      priority: repair.priority,
    })),
}

export default function TechnicianDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(authManager.getCurrentSession()?.user.name || "טכנאי")
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "התקבל":
        return "secondary"
      case "בתהליך תיקון":
        return "default"
      case "תוקן - מוכן לשילוח":
        return "outline"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "גבוה":
        return "destructive"
      case "רגיל":
        return "default"
      case "נמוך":
        return "secondary"
      default:
        return "default"
    }
  }

  const updateRepairStatus = (repairId: string, newStatus: string) => {
    const currentUser = authManager.getCurrentSession()?.user.name || "טכנאי לא ידוע"
    statusManager.updateStatus(repairId, newStatus, currentUser)
    // In a real app, you'd also update the local state or refetch data
    console.log(`Updating ${repairId} to ${newStatus}`)
  }

  const handleLogout = async () => {
    await authManager.logout()
    window.location.href = "/login" // Redirect to login page
  }

  return (
    <ProtectedRoute requiredRole="technician">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Wrench className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">פאנל צורף/טכנאי</h1>
                  <p className="text-gray-600">שלום, {username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/technician/scan">
                    <Scan className="h-4 w-4 mr-2" />
                    סרוק QR
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
                <CardTitle className="text-sm font-medium">תיקונים שהוקצו</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTechnicianData.stats.assignedRepairs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">בתהליך</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTechnicianData.stats.inProgress}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">הושלמו היום</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTechnicianData.stats.completedToday}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">זמן ממוצע</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTechnicianData.stats.avgRepairTime}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  סריקת QR תכשיט
                </CardTitle>
                <CardDescription>סרוק QR של תכשיט שהתקבל לתיקון</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/technician/scan">פתח סורק</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  עדכון סטטוס
                </CardTitle>
                <CardDescription>עדכן סטטוס תיקון קיים</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline">
                  עדכן סטטוס
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="assigned" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assigned">תיקונים שהוקצו</TabsTrigger>
              <TabsTrigger value="in-progress">בתהליך</TabsTrigger>
              <TabsTrigger value="completed">מוכנים לשילוח</TabsTrigger>
            </TabsList>

            <TabsContent value="assigned">
              <Card>
                <CardHeader>
                  <CardTitle>כל התיקונים שהוקצו</CardTitle>
                  <CardDescription>תכשיטים שהתקבלו לתיקון</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>מזהה תיקון</TableHead>
                        <TableHead>תכשיט</TableHead>
                        <TableHead>תקלה</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead>עדיפות</TableHead>
                        <TableHead>התקבל</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTechnicianData.assignedRepairs.map((repair) => (
                        <TableRow key={repair.repairId}>
                          <TableCell className="font-medium">{repair.repairId}</TableCell>
                          <TableCell>{repair.product}</TableCell>
                          <TableCell>{repair.issue}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(repair.status)}>{repair.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(repair.priority)}>{repair.priority}</Badge>
                          </TableCell>
                          <TableCell>{repair.receivedAt}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {repair.status === "התקבל" && (
                                <Button size="sm" onClick={() => updateRepairStatus(repair.repairId, "בתהליך תיקון")}>
                                  התחל תיקון
                                </Button>
                              )}
                              {repair.status === "בתהליך תיקון" && (
                                <Button
                                  size="sm"
                                  onClick={() => updateRepairStatus(repair.repairId, "תוקן - מוכן לשילוח")}
                                >
                                  סמן כמוכן
                                </Button>
                              )}
                              {repair.status === "תוקן - מוכן לשילוח" && (
                                <Button size="sm" variant="outline" disabled>
                                  מוכן לשילוח
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

            <TabsContent value="in-progress">
              <Card>
                <CardHeader>
                  <CardTitle>תיקונים בתהליך</CardTitle>
                  <CardDescription>תכשיטים שנמצאים כרגע בתיקון</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>מזהה תיקון</TableHead>
                        <TableHead>תכשיט</TableHead>
                        <TableHead>תקלה</TableHead>
                        <TableHead>התחיל</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTechnicianData.assignedRepairs
                        .filter((repair) => repair.status === "בתהליך תיקון")
                        .map((repair) => (
                          <TableRow key={repair.repairId}>
                            <TableCell className="font-medium">{repair.repairId}</TableCell>
                            <TableCell>{repair.product}</TableCell>
                            <TableCell>{repair.issue}</TableCell>
                            <TableCell>{repair.receivedAt}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => updateRepairStatus(repair.repairId, "תוקן - מוכן לשילוח")}
                              >
                                סמן כמוכן
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>מוכנים לשילוח</CardTitle>
                  <CardDescription>תיקונים שהושלמו וממתינים להחזרה לחנות</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>מזהה תיקון</TableHead>
                        <TableHead>תכשיט</TableHead>
                        <TableHead>הושלם</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTechnicianData.assignedRepairs
                        .filter((repair) => repair.status === "תוקן - מוכן לשילוח")
                        .map((repair) => (
                          <TableRow key={repair.repairId}>
                            <TableCell className="font-medium">{repair.repairId}</TableCell>
                            <TableCell>{repair.product}</TableCell>
                            <TableCell>{repair.receivedAt}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" disabled>
                                ממתין לאיסוף
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
