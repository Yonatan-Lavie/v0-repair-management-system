"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, Shield, QrCode, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("")
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    if (!selectedRole) return

    // Store role in localStorage for demo purposes
    localStorage.setItem("userRole", selectedRole)
    localStorage.setItem("username", username || getDefaultUsername(selectedRole))

    // Redirect based on role
    switch (selectedRole) {
      case "admin":
        router.push("/admin/dashboard")
        break
      case "shop-manager":
        router.push("/shop/dashboard")
        break
      case "seller":
        router.push("/seller/dashboard")
        break
      case "technician":
        router.push("/technician/dashboard")
        break
      default:
        break
    }
  }

  const getDefaultUsername = (role: string) => {
    switch (role) {
      case "admin":
        return "מנהל מערכת"
      case "shop-manager":
        return "דנה ברק"
      case "seller":
        return "מוכר חנות"
      case "technician":
        return "יוסי בן-חיים"
      default:
        return "משתמש"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">מערכת ניהול תיקונים</h1>
          <p className="text-gray-600 mt-2">מעקב ואימות עם QR כפול</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">כניסה למערכת</CardTitle>
            <CardDescription className="text-center">בחר את התפקיד שלך להתחלת הדמו</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">תפקיד</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תפקיד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      מנהל מערכת
                    </div>
                  </SelectItem>
                  <SelectItem value="shop-manager">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      מנהל חנות
                    </div>
                  </SelectItem>
                  <SelectItem value="seller">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      מוכר
                    </div>
                  </SelectItem>
                  <SelectItem value="technician">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      טכנאי
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">שם משתמש (אופציונלי)</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={selectedRole ? getDefaultUsername(selectedRole) : "הכנס שם משתמש"}
              />
            </div>

            <Button onClick={handleLogin} className="w-full" disabled={!selectedRole}>
              כניסה למערכת
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>דמו - מערכת ניהול תיקונים עם אימות QR כפול</p>
        </div>
      </div>
    </div>
  )
}
