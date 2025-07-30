import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldOff } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-destructive p-3 rounded-full shadow-md">
            <ShieldOff className="h-8 w-8 text-destructive-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">גישה נדחתה</h1>
        <p className="text-muted-foreground mt-2">אין לך הרשאות לגשת לדף זה.</p>

        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground">שגיאת הרשאה</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              ייתכן שניסית לגשת לדף שאינו מורשה עבור תפקידך.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login" passHref>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                חזור לדף ההתחברות
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
