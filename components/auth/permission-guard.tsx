import { redirect } from "next/navigation"
import { hasPermission as checkPermission } from "@/app/actions/auth"
import type React from "react"

interface PermissionGuardProps {
  children: React.ReactNode
  permission: string
  fallback?: React.ReactNode
}

export default async function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const hasRequiredPermission = await checkPermission(permission)

  if (!hasRequiredPermission) {
    if (fallback) {
      return <>{fallback}</>
    }
    redirect("/unauthorized")
  }

  return <>{children}</>
}
