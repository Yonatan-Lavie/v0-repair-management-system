import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateSettings as updateSettingsAction } from "@/app/actions/settings" // Assuming a settings action exists
import { demoData } from "@/lib/demo-data"
;("use client")

import type React from "react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(demoData.settings)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateSettingsAction(settings) // Call server action

      if (result.success) {
        toast({
          title: "הגדרות נשמרו בהצלחה!",
          description: "הגדרות המערכת עודכנו.",
        })
      } else {
        toast({
          title: "שגיאה בשמירת הגדרות",
          description: result.error || "נסה שוב מאוחר יותר.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "שגיאה בלתי צפויה",
        description: "אירעה שגיאה בעת שמירת ההגדרות.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <PermissionGuard permission="settings:write">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">הגדרות מערכת</h1>

          <Card className="max-w-3xl mx-auto shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Settings className="w-6 h-6" /> הגדרות כלליות
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">שם המערכת</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={handleInputChange}
                    required
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">מייל ליצירת קשר</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">טלפון תמיכה</Label>
                  <Input
                    id="supportPhone"
                    type="tel"
                    value={settings.supportPhone}
                    onChange={handleInputChange}
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicyUrl">קישור למדיניות פרטיות</Label>
                  <Input
                    id="privacyPolicyUrl"
                    type="url"
                    value={settings.privacyPolicyUrl}
                    onChange={handleInputChange}
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termsOfServiceUrl">קישור לתנאי שירות</Label>
                  <Input
                    id="termsOfServiceUrl"
                    type="url"
                    value={settings.termsOfServiceUrl}
                    onChange={handleInputChange}
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">הודעת פתיחה (לדף הבית)</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={settings.welcomeMessage}
                    onChange={handleInputChange}
                    rows={4}
                    className="text-foreground"
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        שומר...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" /> שמור הגדרות
                      </>
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
