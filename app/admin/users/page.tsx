"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Users, Plus, Search, Edit, Trash2, Shield } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route" // Import ProtectedRoute
import { authManager } from "@/lib/auth" // Import authManager

// Import the demo data at the top
import { demoData } from "@/lib/demo-data"

// Replace the mockUsers with:
const mockUsers = demoData.users.map((user) => ({
  ...user,
  role: user.role,
  shop: user.shop,
  status: user.status,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
}))

export default function AllUsers() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "מנהל מערכת"
      case "shop-manager":
        return "מנהל חנות"
      case "seller":
        return "מוכר"
      case "technician":
        return "צורף/טכנאי" // Changed label
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "shop-manager":
        return "default"
      case "seller":
        return "secondary"
      case "technician":
        return "outline"
      default:
        return "outline"
    }
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleLogout = async () => {
    await authManager.logout()
    window.location.href = "/login" // Redirect to login page
  }

  return (
    <ProtectedRoute requiredRole="admin" requiredPermissions={["users:read"]}>
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
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
                  <p className="text-gray-600">כל המשתמשים במערכת</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/admin/users/create">
                  <Plus className="h-4 w-4 mr-2" />
                  הוסף משתמש
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">סה"כ משתמשים</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">פעילים</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.status === "פעיל").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">מנהלי חנויות</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "shop-manager").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">מוכרים וצורפים/טכנאים</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter((u) => u.role === "seller" || u.role === "technician").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>חיפוס וסינון</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="חפש לפי שם או מייל..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="סנן לפי תפקיד" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל התפקידים</SelectItem>
                    <SelectItem value="admin">מנהל מערכת</SelectItem>
                    <SelectItem value="shop-manager">מנהל חנות</SelectItem>
                    <SelectItem value="seller">מוכר</SelectItem>
                    <SelectItem value="technician">צורף/טכנאי</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="סנן לפי סטטוס" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הסטטוסים</SelectItem>
                    <SelectItem value="פעיל">פעיל</SelectItem>
                    <SelectItem value="לא פעיל">לא פעיל</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>רשימת משתמשים</CardTitle>
              <CardDescription>
                מציג {filteredUsers.length} מתוך {users.length} משתמשים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>מייל</TableHead>
                    <TableHead>תפקיד</TableHead>
                    <TableHead>חנות</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>כניסה אחרונה</TableHead>
                    <TableHead>נוצר</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                      </TableCell>
                      <TableCell>{user.shop}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
