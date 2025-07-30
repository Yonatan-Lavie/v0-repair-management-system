import ProtectedRoute from "@/components/auth/protected-route"
import PermissionGuard from "@/components/auth/permission-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { demoData } from "@/lib/demo-data"
import { deleteUser as deleteUserAction } from "@/app/actions/user" // Assuming a user action exists
import { useToast } from "@/hooks/use-toast"

// This component should be a client component if it uses useState/useToast
// For now, assuming it's a client component and will be wrapped by ProtectedRoute
;("use client")

import { useState } from "react"

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState(demoData.users) // Use state to manage users for deletion

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
      try {
        const result = await deleteUserAction(userId) // Call server action
        if (result.success) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
          toast({
            title: "משתמש נמחק בהצלחה",
            description: `המשתמש ${userId} נמחק מהמערכת.`,
          })
        } else {
          toast({
            title: "שגיאה במחיקת משתמש",
            description: result.error || "נסה שוב מאוחר יותר.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to delete user:", error)
        toast({
          title: "שגיאה בלתי צפויה",
          description: "אירעה שגיאה בעת מחיקת המשתמש.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <PermissionGuard permission="users:read">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">ניהול משתמשים</h1>

          <div className="flex justify-end mb-6">
            <Link href="/admin/users/create" passHref>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="w-4 h-4 ml-2" /> הוסף משתמש חדש
              </Button>
            </Link>
          </div>

          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-secondary-foreground flex items-center gap-2">
                <User className="w-5 h-5" /> רשימת משתמשים
              </CardTitle>
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
                    <TableHead className="text-right">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">{user.role}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.shopId ? demoData.shops.find((s) => s.id === user.shopId)?.name : "מערכת"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.status}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/users/edit/${user.id}`} passHref>
                            <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <PermissionGuard permission="users:delete" fallback={null}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    </ProtectedRoute>
  )
}
