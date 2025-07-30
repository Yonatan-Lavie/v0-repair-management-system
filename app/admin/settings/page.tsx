"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Save, Bell, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route" // Import ProtectedRoute

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    // General settings
    systemName: "מערכת ניהול תיקוני תכשיטים", // Updated system name
    defaultRepairTime: 3,
    maxRepairTime: 14,
    autoStatusUpdate: true,
    qrExpiration: 30,

    // Notification settings
    smsEnabled: true,
    emailEnabled: true,
    pushNotifications: true,
    customerNotifications: true,
    technicianNotifications: true,

    // SMS settings
    smsProvider: "twilio",
    smsApiKey: "",
    smsFromNumber: "",

    // Email settings
    emailProvider: "smtp",
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    emailFromAddress: "",

    // Business settings
    businessHours: {
      sunday: { open: "09:00", close: "18:00", enabled: true },
      monday: { open: "09:00", close: "18:00", enabled: true },
      tuesday: { open: "09:00", close: "18:00", enabled: true },
      wednesday: { open: "09:00", close: "18:00", enabled: true },
      thursday: { open: "09:00", close: "18:00", enabled: true },
      friday: { open: "09:00", close: "14:00", enabled: true },
      saturday: { open: "10:00", close: "16:00", enabled: false },
    },
  })

  const handleSave = () => {
    // In a real app, this would save to database
    console.log("Settings saved:", settings)
    alert("הגדרות נשמרו בהצלחה!")
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <ProtectedRoute requiredRole="admin" requiredPermissions={["settings:read", "settings:write"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  חזור
                </Link>
              </Button>
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">הגדרות מערכת</h1>
                <p className="text-gray-600">ניהול הגדרות כלליות של המערכת</p>
              </div>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              שמור הגדרות
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">כללי</TabsTrigger>
              <TabsTrigger value="notifications">התראות</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="email">מייל</TabsTrigger>
              <TabsTrigger value="business">שעות עבודה</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות כלליות</CardTitle>
                  <CardDescription>הגדרות בסיסיות של המערכת</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">שם המערכת</Label>
                    <Input
                      id="systemName"
                      value={settings.systemName}
                      onChange={(e) => updateSetting("systemName", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultRepairTime">זמן תיקון ברירת מחדל (ימים)</Label>
                      <Input
                        id="defaultRepairTime"
                        type="number"
                        value={settings.defaultRepairTime}
                        onChange={(e) => updateSetting("defaultRepairTime", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxRepairTime">זמן תיקון מקסימלי (ימים)</Label>
                      <Input
                        id="maxRepairTime"
                        type="number"
                        value={settings.maxRepairTime}
                        onChange={(e) => updateSetting("maxRepairTime", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qrExpiration">תוקף QR (ימים)</Label>
                    <Input
                      id="qrExpiration"
                      type="number"
                      value={settings.qrExpiration}
                      onChange={(e) => updateSetting("qrExpiration", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoStatusUpdate"
                      checked={settings.autoStatusUpdate}
                      onCheckedChange={(checked) => updateSetting("autoStatusUpdate", checked)}
                    />
                    <Label htmlFor="autoStatusUpdate">עדכון סטטוס אוטומטי</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    הגדרות התראות
                  </CardTitle>
                  <CardDescription>ניהול התראות ללקוחות וצוות</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsEnabled">הודעות SMS</Label>
                        <p className="text-sm text-gray-600">שליחת הודעות SMS ללקוחות</p>
                      </div>
                      <Switch
                        id="smsEnabled"
                        checked={settings.smsEnabled}
                        onCheckedChange={(checked) => updateSetting("smsEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailEnabled">הודעות מייל</Label>
                        <p className="text-sm text-gray-600">שליחת הודעות מייל ללקוחות</p>
                      </div>
                      <Switch
                        id="emailEnabled"
                        checked={settings.emailEnabled}
                        onCheckedChange={(checked) => updateSetting("emailEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">התראות דחיפה</Label>
                        <p className="text-sm text-gray-600">התראות במערכת לצוות</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="customerNotifications">התראות ללקוחות</Label>
                        <p className="text-sm text-gray-600">עדכונים אוטומטיים ללקוחות</p>
                      </div>
                      <Switch
                        id="customerNotifications"
                        checked={settings.customerNotifications}
                        onCheckedChange={(checked) => updateSetting("customerNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="technicianNotifications">התראות לטכנאים</Label>
                        <p className="text-sm text-gray-600">התראות על תיקונים חדשים</p>
                      </div>
                      <Switch
                        id="technicianNotifications"
                        checked={settings.technicianNotifications}
                        onCheckedChange={(checked) => updateSetting("technicianNotifications", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sms">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    הגדרות SMS
                  </CardTitle>
                  <CardDescription>הגדרת ספק SMS ופרטי חיבור</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="smsApiKey">API Key</Label>
                    <Input
                      id="smsApiKey"
                      type="password"
                      value={settings.smsApiKey}
                      onChange={(e) => updateSetting("smsApiKey", e.target.value)}
                      placeholder="הכנס API Key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smsFromNumber">מספר שולח</Label>
                    <Input
                      id="smsFromNumber"
                      value={settings.smsFromNumber}
                      onChange={(e) => updateSetting("smsFromNumber", e.target.value)}
                      placeholder="+972501234567"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      💡 לשימוש בשירות SMS נדרש חשבון אצל ספק SMS כמו Twilio או Infobip
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    הגדרות מייל
                  </CardTitle>
                  <CardDescription>הגדרת שרת SMTP לשליחת מיילים</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">שרת SMTP</Label>
                      <Input
                        id="smtpHost"
                        value={settings.smtpHost}
                        onChange={(e) => updateSetting("smtpHost", e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">פורט</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.smtpPort}
                        onChange={(e) => updateSetting("smtpPort", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">שם משתמש</Label>
                    <Input
                      id="smtpUser"
                      value={settings.smtpUser}
                      onChange={(e) => updateSetting("smtpUser", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">סיסמה</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => updateSetting("smtpPassword", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailFromAddress">כתובת שולח</Label>
                    <Input
                      id="emailFromAddress"
                      value={settings.emailFromAddress}
                      onChange={(e) => updateSetting("emailFromAddress", e.target.value)}
                      placeholder="noreply@yourcompany.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>שעות עבודה</CardTitle>
                  <CardDescription>הגדרת שעות עבודה לכל ימי השבוע</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={hours.enabled}
                          onCheckedChange={(checked) =>
                            updateSetting("businessHours", {
                              ...settings.businessHours,
                              [day]: { ...hours, enabled: checked },
                            })
                          }
                        />
                        <Label className="w-20">
                          {day === "sunday" && "ראשון"}
                          {day === "monday" && "שני"}
                          {day === "tuesday" && "שלישי"}
                          {day === "wednesday" && "רביעי"}
                          {day === "thursday" && "חמישי"}
                          {day === "friday" && "שישי"}
                          {day === "saturday" && "שבת"}
                        </Label>
                      </div>
                      {hours.enabled && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              updateSetting("businessHours", {
                                ...settings.businessHours,
                                [day]: { ...hours, open: e.target.value },
                              })
                            }
                            className="w-32"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              updateSetting("businessHours", {
                                ...settings.businessHours,
                                [day]: { ...hours, close: e.target.value },
                              })
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
