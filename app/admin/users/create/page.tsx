import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createUser as createUserAction } from "@/app/actions/user" // Assuming a user action exists
import { demoData } from "@/lib/demo-data"
import { UserPlus, Loader2 } from "lucide-react"
;("use client")

import type React from "react"

export default function CreateUserPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // Updated default value
    shopId: "",
    status: "פעיל",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newUser = {
        id: `USER${Date.now()}`,
        ...formData,
        permissions: [], // Permissions will be set by role on server
      }

      const result = await createUserAction(newUser) // Call server action

      if (result.success) {
        toast({
          title: "משתמש נוצר בהצלחה!",
          description: `המשתמש ${newUser.name} נוסף למערכת.`,
        })
        router.push("/admin/users")
      } else {
        toast({
          title: "שגיאה ביצירת משתמש",
          description: result.error || "נסה שוב מאוחר יותר.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to create user:", error)
      toast({
        title: "שגיאה בלתי צפויה",
        description: "אירעה שגיאה בעת יצירת המשתמש.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <PermissionGuard permission="users:write">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">יצירת משתמש חדש</h1>

          <Card className="max-w-2xl mx-auto shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <UserPlus className="w-6 h-6" /> פרטי משתמש
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">כתובת מייל</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">תפקיד</Label>
                  <Select onValueChange={(value) => handleSelectChange("role", value)} value={formData.role} required>
                    <SelectTrigger id="role" className="text-foreground">
                      <SelectValue placeholder="בחר תפקיד" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">מנהל מערכת</SelectItem>
                      <SelectItem value="shop-manager">מנהל חנות</SelectItem>
                      <SelectItem value="seller">מוכר</SelectItem>
                      <SelectItem value="technician">צורף/טכנאי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopId">חנות (אם רלוונטי)</Label>
                  <Select onValueChange={(value) => handleSelectChange("shopId", value)} value={formData.shopId}>
                    <SelectTrigger id="shopId" className="text-foreground">
                      <SelectValue placeholder="בחר חנות" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">ללא (מנהל מערכת)</SelectItem>
                      {demoData.shops.map((shop) => (
                        <SelectItem key={shop.id} value={shop.id}>
                          {shop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">סטטוס</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("status", value)}
                    value={formData.status}
                    required
                  >
                    <SelectTrigger id="status" className="text-foreground">
                      <SelectValue placeholder="בחר סטטוס" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="פעיל">פעיל</SelectItem>
                      <SelectItem value="לא פעיל">לא פעיל</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        יוצר משתמש...
                      </>
                    ) : (
                      "צור משתמש"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    </ProtectedRoute>
  )
}
