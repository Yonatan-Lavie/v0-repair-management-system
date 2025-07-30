// Authentication and authorization system

import { jwtVerify, SignJWT } from "jose"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "shop-manager" | "seller" | "technician"
  shopId?: string
  permissions: string[]
  lastLogin?: string
  isActive: boolean
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

// Role-based permissions
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

class AuthManager {
  private static instance: AuthManager
  private currentSession: AuthSession | null = null
  private readonly JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  // Login with email and password
  async login(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    try {
      // In a real app, this would validate against database
      const user = await this.validateCredentials(email, password)

      if (!user) {
        this.logSecurityEvent("login_failed", { email, reason: "invalid_credentials" })
        return { success: false, error: "שם משתמש או סיסמה שגויים" }
      }

      if (!user.isActive) {
        this.logSecurityEvent("login_failed", { email, reason: "account_disabled" })
        return { success: false, error: "החשבון מושבת" }
      }

      // Generate JWT token
      const token = await this.generateToken(user)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      const session: AuthSession = {
        user: {
          ...user,
          permissions: ROLE_PERMISSIONS[user.role] || [],
          lastLogin: new Date().toISOString(),
        },
        token,
        expiresAt,
      }

      this.currentSession = session
      this.storeSession(session)
      this.logSecurityEvent("login_success", { userId: user.id, email })

      return { success: true, session }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "שגיאה בהתחברות" }
    }
  }

  // Logout
  async logout(): Promise<void> {
    if (this.currentSession) {
      this.logSecurityEvent("logout", { userId: this.currentSession.user.id })
      this.clearSession()
    }
  }

  // Validate credentials (mock implementation)
  private async validateCredentials(email: string, password: string): Promise<User | null> {
    // Mock users for demo - in real app, query database with hashed passwords
    const mockUsers: Record<string, User> = {
      "admin@system.com": {
        id: "1",
        email: "admin@system.com",
        name: "מנהל מערכת",
        role: "admin",
        permissions: [],
        isActive: true,
      },
      "dana@fixit.com": {
        id: "2",
        email: "dana@fixit.com",
        name: "דנה ברק",
        role: "shop-manager",
        shopId: "SHOP001",
        permissions: [],
        isActive: true,
      },
      "seller@fixit.com": {
        id: "3",
        email: "seller@fixit.com",
        name: "מוכר חנות",
        role: "seller",
        shopId: "SHOP001",
        permissions: [],
        isActive: true,
      },
      "tech@fixit.com": {
        id: "4",
        email: "tech@fixit.com",
        name: "יוסי בן-חיים",
        role: "technician",
        shopId: "SHOP001",
        permissions: [],
        isActive: true,
      },
    }

    // Simple password check for demo (in real app, use bcrypt)
    const validPasswords: Record<string, string> = {
      "admin@system.com": "admin123",
      "dana@fixit.com": "manager123",
      "seller@fixit.com": "seller123",
      "tech@fixit.com": "tech123",
    }

    if (validPasswords[email] === password) {
      return mockUsers[email] || null
    }

    return null
  }

  // Generate JWT token
  private async generateToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    }

    return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(this.JWT_SECRET)
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<User | null> {
    try {
      const { payload } = await jwtVerify(token, this.JWT_SECRET)

      // Get user from payload
      const user: User = {
        id: payload.userId as string,
        email: payload.email as string,
        name: "", // Would be fetched from DB
        role: payload.role as User["role"],
        shopId: payload.shopId as string,
        permissions: ROLE_PERMISSIONS[payload.role as User["role"]] || [],
        isActive: true,
      }

      return user
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  }

  // Check if user has permission
  hasPermission(permission: string): boolean {
    if (!this.currentSession) return false
    return this.currentSession.user.permissions.includes(permission)
  }

  // Check if user has role
  hasRole(role: string): boolean {
    if (!this.currentSession) return false
    return this.currentSession.user.role === role
  }

  // Check if user can access shop
  canAccessShop(shopId: string): boolean {
    if (!this.currentSession) return false

    const user = this.currentSession.user

    // Admin can access all shops
    if (user.role === "admin") return true

    // Others can only access their assigned shop
    return user.shopId === shopId
  }

  // Get current session
  getCurrentSession(): AuthSession | null {
    return this.currentSession
  }

  // Store session in localStorage
  private storeSession(session: AuthSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "auth_session",
        JSON.stringify({
          user: session.user,
          token: session.token,
          expiresAt: session.expiresAt.toISOString(),
        }),
      )
    }
  }

  // Load session from localStorage
  loadSession(): AuthSession | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem("auth_session")
      if (!stored) return null

      const parsed = JSON.parse(stored)
      const expiresAt = new Date(parsed.expiresAt)

      // Check if session expired
      if (expiresAt < new Date()) {
        this.clearSession()
        return null
      }

      const session: AuthSession = {
        user: parsed.user,
        token: parsed.token,
        expiresAt,
      }

      this.currentSession = session
      return session
    } catch (error) {
      console.error("Failed to load session:", error)
      this.clearSession()
      return null
    }
  }

  // Clear session
  private clearSession(): void {
    this.currentSession = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session")
    }
  }

  // Log security events
  private logSecurityEvent(event: string, data: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      ip: "unknown", // In real app, get from request
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
    }

    console.log("Security Event:", logEntry)

    // In real app, store in database or send to security monitoring service
  }
}

export const authManager = AuthManager.getInstance()
