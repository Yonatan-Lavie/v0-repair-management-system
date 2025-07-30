"use client"

import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentSession } from "@/app/actions/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authManager, type User } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default async function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/login")
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(session.user.role)) {
      redirect("/unauthorized")
    }
  }

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
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
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
