"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Gem } from "lucide-react"
import { login } from "@/app/actions/auth" // Import login action

interface LoginFormProps {
  onSuccess: (session: any) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(formData.email, formData.password) // Call the server action

      if (result.success && result.session) {
        // Client-side storage for immediate use (cookie is HTTP-only)
        localStorage.setItem("username", result.session.user.name)
        localStorage.setItem("user_role", result.session.user.role)
        localStorage.setItem("user_shop_id", result.session.user.shopId || "")
        onSuccess(result.session)
      } else {
        setError(result.error || "שגיאה בהתחברות")
      }
    } catch (error) {
      setError("שגיאה בהתחברות למערכת")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user types
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full shadow-md">
              <Gem className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">התחברות מאובטחת</h1>
          <p className="text-muted-foreground mt-2">מערכת ניהול תיקוני תכשיטים</p>
        </div>

        <Card className="shadow-lg border-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl font-bold text-foreground">כניסה למערכת</CardTitle>
            <CardDescription className="text-center text-muted-foreground">הזן את פרטי ההתחברות שלך</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">כתובת מייל</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">סיסמה</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="הכנס סיסמה"
                    required
                    disabled={isLoading}
                    className="text-foreground"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    מתחבר...
                  </>
                ) : (
                  "התחבר"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary/20 border border-secondary rounded-lg text-secondary-foreground">
              <h4 className="font-semibold mb-2">חשבונות לדמו:</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>מנהל:</strong> admin@system.com / admin123
                </p>
                <p>
                  <strong>מנהל חנות:</strong> dana@fixit.com / manager123
                </p>
                <p>
                  <strong>מוכר:</strong> seller@fixit.com / seller123
                </p>
                <p>
                  <strong>טכנאי:</strong> tech@fixit.com / tech123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
