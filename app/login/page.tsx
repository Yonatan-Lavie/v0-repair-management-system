"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { authManager } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    const session = authManager.loadSession()
    if (session) {
      redirectToRoleDashboard(session.user.role)
    }
  }, [])

  const handleLoginSuccess = (session: any) => {
    redirectToRoleDashboard(session.user.role)
  }

  const redirectToRoleDashboard = (role: string) => {
    switch (role) {
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
        router.push("/")
    }
  }

  return <LoginForm onSuccess={handleLoginSuccess} />
}
