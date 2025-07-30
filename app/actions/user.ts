"use server"

import {
  demoData,
  createUser as createUserHelper,
  updateUser as updateUserHelper,
  deleteUser as deleteUserHelper,
} from "@/lib/demo-helpers"
import { auditLogger } from "@/lib/audit-logger"
import { getCurrentSession } from "./auth"

// Define types for user (simplified for demo)
interface User {
  id: string
  name: string
  email: string
  password?: string // Password should not be returned in real app
  role: string
  shopId?: string
  status: string
  permissions: string[]
}

const ROLE_PERMISSIONS = {
  admin: [
    "system:read",
    "system:write",
    "users:read",
    "users:write",
    "users:delete",
    "shops:read",
    "shops:write",
    "shops:delete",
    "repairs:read",
    "repairs:write",
    "reports:read",
    "settings:read",
    "settings:write",
  ],
  "shop-manager": [
    "shop:read",
    "shop:write",
    "staff:read",
    "staff:write",
    "repairs:read",
    "repairs:write",
    "reports:read",
    "customers:read",
  ],
  seller: [
    "repairs:create",
    "repairs:read",
    "repairs:update",
    "qr:scan",
    "qr:generate",
    "customers:read",
    "customers:write",
  ],
  technician: ["repairs:read", "repairs:update", "qr:scan", "status:update"],
}

export async function createUser(
  newUserData: Omit<User, "id" | "permissions">,
): Promise<{ success: boolean; user?: User; error?: string }> {
  const session = await getCurrentSession()
  if (!session || !session.user.permissions.includes("users:write")) {
    return { success: false, error: "Unauthorized" }
  }

  // In a real app, hash password before storing
  const newUser: User = {
    id: `USER${Date.now()}`, // Simple ID generation for demo
    ...newUserData,
    permissions: ROLE_PERMISSIONS[newUserData.role as keyof typeof ROLE_PERMISSIONS] || [],
  }

  const result = createUserHelper(newUser) // Use demo helper
  if (result.success) {
    auditLogger.log(session.user.id, session.user.name, "User Created", {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })
    return { success: true, user: result.user as User }
  }
  return { success: false, error: result.error }
}

export async function updateUser(updatedUserData: User): Promise<{ success: boolean; user?: User; error?: string }> {
  const session = await getCurrentSession()
  if (!session || !session.user.permissions.includes("users:write")) {
    return { success: false, error: "Unauthorized" }
  }

  // In a real app, you'd fetch the existing user from DB, then update
  const existingUser = demoData.users.find((u) => u.id === updatedUserData.id)
  if (!existingUser) {
    return { success: false, error: "User not found" }
  }

  // Ensure permissions are updated based on role if role changes
  const permissions = ROLE_PERMISSIONS[updatedUserData.role as keyof typeof ROLE_PERMISSIONS] || []

  const userToUpdate = { ...updatedUserData, permissions }

  const result = updateUserHelper(userToUpdate) // Use demo helper
  if (result.success) {
    auditLogger.log(session.user.id, session.user.name, "User Updated", {
      userId: updatedUserData.id,
      email: updatedUserData.email,
      role: updatedUserData.role,
    })
    return { success: true, user: result.user as User }
  }
  return { success: false, error: result.error }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const session = await getCurrentSession()
  if (!session || !session.user.permissions.includes("users:delete")) {
    return { success: false, error: "Unauthorized" }
  }

  // Prevent deleting self or admin for demo simplicity
  if (userId === session.user.id || userId === "1") {
    // "1" is admin@system.com
    return { success: false, error: "Cannot delete this user" }
  }

  const result = deleteUserHelper(userId) // Use demo helper
  if (result.success) {
    auditLogger.log(session.user.id, session.user.name, "User Deleted", { userId })
    return { success: true }
  }
  return { success: false, error: result.error }
}
