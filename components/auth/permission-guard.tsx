"use client"

import type React from "react"

import { authManager } from "@/lib/auth"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: string
  role?: string
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, permission, role, fallback = null }: PermissionGuardProps) {
  const session = authManager.getCurrentSession()

  if (!session) {
    return <>{fallback}</>
  }

  // Check role
  if (role && !authManager.hasRole(role)) {
    return <>{fallback}</>
  }

  // Check permission
  if (permission && !authManager.hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
