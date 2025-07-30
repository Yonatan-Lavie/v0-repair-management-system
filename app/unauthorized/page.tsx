"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">אין הרשאה</CardTitle>
          <CardDescription>אין לך הרשאה לגשת לעמוד זה</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">אנא פנה למנהל המערכת לקבלת הרשאות נוספות</p>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזור לדף הבית
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/login">התחבר מחדש</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
