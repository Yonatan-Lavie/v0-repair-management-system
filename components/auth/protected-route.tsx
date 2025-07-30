"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authManager, type User } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRole?: string
  shopId?: string
}

export function ProtectedRoute({ children, requiredPermissions = [], requiredRole, shopId }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Try to load existing session
      const session = authManager.loadSession()

      if (!session) {
        router.push("/login")
        return
      }

      const currentUser = session.user

      // Check role requirement
      if (requiredRole && currentUser.role !== requiredRole) {
        router.push("/unauthorized")
        return
      }

      // Check permissions
      const hasAllPermissions = requiredPermissions.every((permission) => currentUser.permissions.includes(permission))

      if (requiredPermissions.length > 0 && !hasAllPermissions) {
        router.push("/unauthorized")
        return
      }

      // Check shop access
      if (shopId && !authManager.canAccessShop(shopId)) {
        router.push("/unauthorized")
        return
      }

      setUser(currentUser)
      setIsAuthorized(true)
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">בודק הרשאות...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Will redirect
  }

  return <>{children}</>
}
