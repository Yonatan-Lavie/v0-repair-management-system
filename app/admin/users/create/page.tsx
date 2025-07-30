"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, UserPlus, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { demoData } from "@/lib/demo-data"
import { ProtectedRoute } from "@/components/auth/protected-route" // Import ProtectedRoute
import { InputValidator } from "@/lib/input-validation" // Import InputValidator
import { authManager } from "@/lib/auth" // Import authManager

export default function CreateUser() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    shopId: "",
    password: "",
    confirmPassword: "",
    notes: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "password" || field === "confirmPassword") {
      const { valid, errors } = InputValidator.validatePassword(value)
      setPasswordErrors(errors)
    }
    setFormError(null) // Clear form error on input change
  }

  const handleSubmit = () => {
    // Basic client-side validation
    if (!InputValidator.isValidEmail(formData.email)) {
      setFormError("כתובת מייל לא תקינה")
      return
    }
    if (formData.phone && !InputValidator.isValidPhone(formData.phone)) {
      setFormError("מספר טלפון לא תקין")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("אישור סיסמה אינו תואם לסיסמה")
      return
    }
    if (passwordErrors.length > 0) {
      setFormError("הסיסמה אינה עומדת בדרישות")
      return
    }

    // In a real app, this would create the user in the database
    // For demo, we simulate success and log the action
    const currentUser = authManager.getCurrentSession()?.user
    if (currentUser) {
      // auditLogger.logUserManagement("create_user", "NEW_USER_ID", currentUser.id, formData); // Uncomment if auditLogger is used
    }

    setStep(2)
  }

  const handleComplete = () => {
    router.push("/admin/users")
  }

  return (
    <ProtectedRoute requiredRole="admin" requiredPermissions={["users:write"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/admin/users">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  חזור
                </Link>
              </Button>
              <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">יצירת משתמש חדש</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>פרטי המשתמש החדש</CardTitle>
                <CardDescription>הזן את פרטי המשתמש החדש במערכת</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formError && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">שם פרטי</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="הכנס שם פרטי"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">שם משפחה</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="הכנס שם משפחה"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">כתובת מייל</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="050-1234567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="role">תפקיד</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="shopId">חנות</Label>
                    <Select
                      value={formData.shopId}
                      onValueChange={(value) => handleInputChange("shopId", value)}
                      disabled={formData.role === "admin"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר חנות" />
                      </SelectTrigger>
                      <SelectContent>
                        {demoData.shops.map((shop) => (
                          <SelectItem key={shop.shopId} value={shop.shopId}>
                            {shop.shopName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">סיסמה</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="הכנס סיסמה"
                      required
                    />
                    {passwordErrors.length > 0 && (
                      <ul className="text-red-500 text-xs mt-1 list-disc pl-4">
                        {passwordErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">אישור סיסמה</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="אשר סיסמה"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">הערות (אופציונלי)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="הערות נוספות על המשתמש..."
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">הרשאות לפי תפקיד:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>
                      <strong>מנהל מערכת:</strong> גישה מלאה לכל המערכת
                    </li>
                    <li>
                      <strong>מנהל חנות:</strong> ניהול חנות, צוות ודוחות
                    </li>
                    <li>
                      <strong>מוכר:</strong> יצירת תיקונים, סריקת QR, מסירת תכשיטים
                    </li>
                    <li>
                      <strong>צורף/טכנאי:</strong> קבלת תיקונים, עדכון סטטוס
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !formData.role ||
                    !formData.password ||
                    formData.password !== formData.confirmPassword ||
                    (formData.role !== "admin" && !formData.shopId) ||
                    passwordErrors.length > 0
                  }
                >
                  צור משתמש חדש
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  משתמש נוצר בהצלחה!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {formData.firstName} {formData.lastName} נוסף למערכת!
                  </h3>
                  <p className="text-gray-600 mb-6">המשתמש החדש יכול כעת להתחבר למערכת</p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">מייל:</p>
                        <p className="font-semibold">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">תפקיד:</p>
                        <p className="font-semibold">
                          {formData.role === "admin" && "מנהל מערכת"}
                          {formData.role === "shop-manager" && "מנהל חנות"}
                          {formData.role === "seller" && "מוכר"}
                          {formData.role === "technician" && "צורף/טכנאי"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => setStep(1)} variant="outline" className="flex-1 bg-transparent">
                      הוסף משתמש נוסף
                    </Button>
                    <Button onClick={handleComplete} className="flex-1">
                      חזור לרשימת משתמשים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
