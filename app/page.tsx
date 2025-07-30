"use client"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form" // Import the new login form

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = (session: any) => {
    // Store role and username from session for demo purposes
    localStorage.setItem("userRole", session.user.role)
    localStorage.setItem("username", session.user.name)

    // Redirect based on role
    switch (session.user.role) {
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
        break
    }
  }

  // Render the new LoginForm component
  return <LoginForm onSuccess={handleLoginSuccess} />
}
