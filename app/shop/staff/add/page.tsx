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

export default function AddSeller() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // In a real app, this would create the user
    setStep(2)
  }

  const handleComplete = () => {
    router.push("/shop/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link href="/shop/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזור
              </Link>
            </Button>
            <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">הוספת עובד חדש</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>פרטי העובד החדש</CardTitle>
              <CardDescription>הזן את פרטי העובד החדש שיתווסף לחנות</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">שם פרטי</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="הכנס שם פרטי"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">שם משפחה</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="הכנס שם משפחה"
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

              <div className="space-y-2">
                <Label htmlFor="role">תפקיד</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תפקיד" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seller">מוכר</SelectItem>
                    <SelectItem value="technician">טכנאי</SelectItem>
                    <SelectItem value="shop-manager">מנהל חנות</SelectItem>
                  </SelectContent>
                </Select>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אישור סיסמה</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="אשר סיסמה"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">הערות (אופציונלי)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="הערות נוספות על העובד..."
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">הרשאות לפי תפקיד:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>
                    <strong>מוכר:</strong> יצירת תיקונים, סריקת QR, מסירת מוצרים
                  </li>
                  <li>
                    <strong>טכנאי:</strong> קבלת תיקונים, עדכון סטטוס, מידע מוגבל על לקוחות
                  </li>
                  <li>
                    <strong>מנהל חנות:</strong> כל ההרשאות + ניהול צוות ודוחות
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
                  formData.password !== formData.confirmPassword
                }
              >
                צור עובד חדש
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                עובד נוצר בהצלחה!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {formData.firstName} {formData.lastName} נוסף לצוות!
                </h3>
                <p className="text-gray-600 mb-6">העובד החדש יכול כעת להתחבר למערכת</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">מייל:</p>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">תפקיד:</p>
                      <p className="font-semibold">
                        {formData.role === "seller" && "מוכר"}
                        {formData.role === "technician" && "טכנאי"}
                        {formData.role === "shop-manager" && "מנהל חנות"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    ✅ נשלח מייל עם פרטי התחברות לעובד החדש
                    <br />✅ העובד יכול להתחבר באמצעות המייל והסיסמה שהוגדרו
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1 bg-transparent">
                    הוסף עובד נוסף
                  </Button>
                  <Button onClick={handleComplete} className="flex-1">
                    חזור לדשבורד
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
