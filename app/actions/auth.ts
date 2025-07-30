"use server"

import { authCore, type AuthSession } from "@/lib/auth"
import { auditLogger } from "@/lib/audit-logger"
import { inputValidation } from "@/lib/input-validation"
import { cookies } from "next/headers"

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  try {
    if (!inputValidation.isValidEmail(email)) {
      return { success: false, error: "פורמט מייל לא תקין." }
    }
    if (password.length < 6) {
      return { success: false, error: "סיסמה קצרה מדי." }
    }

    const user = await authCore.validateCredentials(email, password)

    if (!user) {
      auditLogger.log("N/A", email, "Login Attempt Failed", { reason: "invalid_credentials" })
      return { success: false, error: "שם משתמש או סיסמה שגויים" }
    }

    if (!user.isActive) {
      auditLogger.log(user.id, user.name, "Login Attempt Failed", { reason: "account_disabled" })
      return { success: false, error: "החשבון מושבת" }
    }

    const token = await authCore.generateToken(user)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const session: AuthSession = {
      user: {
        ...user,
        permissions: authCore.ROLE_PERMISSIONS[user.role] || [],
        lastLogin: new Date().toISOString(),
      },
      token,
      expiresAt,
    }

    // Store token in a secure, HTTP-only cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    auditLogger.log(user.id, user.name, "Login Success", { email: user.email, role: user.role })
    return { success: true, session }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "שגיאה בהתחברות" }
  }
}

export async function logout(): Promise<void> {
  const token = cookies().get("auth_token")?.value
  if (token) {
    const user = await authCore.verifyToken(token)
    if (user) {
      auditLogger.log(user.id, user.name, "User Logout", {})
    }
  }
  cookies().delete("auth_token")
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const token = cookies().get("auth_token")?.value
  if (!token) {
    return null
  }

  const user = await authCore.verifyToken(token)
  if (!user) {
    cookies().delete("auth_token") // Clear invalid token
    return null
  }

  // Re-generate token to refresh expiry if needed, or just return current session
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // Assume token is valid for 24 hours from last verification
  return { user, token, expiresAt }
}

export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getCurrentSession()
  if (!session) return false

  if (session.user.role === "admin") return true

  return session.user.permissions.includes(permission)
}

export async function hasRole(requiredRoles: string[]): Promise<boolean> {
  const session = await getCurrentSession()
  if (!session) return false
  return requiredRoles.includes(session.user.role)
}

export async function canAccessShop(shopId: string): Promise<boolean> {
  const session = await getCurrentSession()
  if (!session) return false

  if (session.user.role === "admin") return true

  return session.user.shopId === shopId
}
