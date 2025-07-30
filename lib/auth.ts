import { sign, verify } from "jsonwebtoken"
import { inputValidation } from "./input-validation"
import { auditLogger } from "./audit-logger"
import { demoData } from "./demo-data"

// Define session interface
export interface UserSession {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
    shopId?: string
    permissions: string[]
  }
  expiresAt: string
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkeyforjewelryrepairsystem"
const TOKEN_EXPIRATION_HOURS = 24 // Token valid for 24 hours

export const authManager = {
  /**
   * Simulates user login.
   * @param email User's email.
   * @param password User's password.
   * @returns A success object with session data or an error object.
   */
  login: async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; session?: UserSession; error?: string }> => {
    // Basic input validation
    if (!inputValidation.isValidEmail(email)) {
      return { success: false, error: "פורמט מייל לא תקין." }
    }
    // In a real app, password would be hashed and compared securely
    if (password.length < 6) {
      // Simple check for demo
      return { success: false, error: "סיסמה קצרה מדי." }
    }

    // Simulate user lookup
    const user = demoData.users.find((u) => u.email === email)

    if (!user) {
      auditLogger.log("N/A", email, "Login Attempt Failed", { reason: "User not found" })
      return { success: false, error: "משתמש או סיסמה שגויים." }
    }

    // Simulate password check (replace with actual hash comparison)
    const isPasswordCorrect =
      (user.email === "admin@system.com" && password === "admin123") ||
      (user.email === "dana@fixit.com" && password === "manager123") ||
      (user.email === "seller@fixit.com" && password === "seller123") ||
      (user.email === "tech@fixit.com" && password === "tech123")

    if (!isPasswordCorrect) {
      auditLogger.log(user.id, user.name, "Login Attempt Failed", { reason: "Incorrect password" })
      return { success: false, error: "משתמש או סיסמה שגויים." }
    }

    if (user.status === "לא פעיל") {
      auditLogger.log(user.id, user.name, "Login Attempt Failed", { reason: "Account inactive" })
      return { success: false, error: "החשבון אינו פעיל. אנא פנה למנהל המערכת." }
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      shopId: user.shopId,
      permissions: user.permissions,
    }
    const token = sign(payload, JWT_SECRET, { expiresIn: `${TOKEN_EXPIRATION_HOURS}h` })

    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000).toISOString()

    const session: UserSession = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
        permissions: user.permissions,
      },
      expiresAt,
    }

    // Store token in localStorage (client-side simulation)
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt_token", token)
      localStorage.setItem("username", user.name) // Store username for display
      localStorage.setItem("user_role", user.role) // Store role for display
      localStorage.setItem("user_shop_id", user.shopId || "") // Store shopId
    }

    auditLogger.log(user.id, user.name, "User Login Success", { email: user.email, role: user.role })
    return { success: true, session }
  },

  /**
   * Simulates user logout.
   */
  logout: async (): Promise<void> => {
    if (typeof window !== "undefined") {
      const currentUser = authManager.getCurrentSession()?.user
      if (currentUser) {
        auditLogger.log(currentUser.id, currentUser.name, "User Logout", {})
      }
      localStorage.removeItem("jwt_token")
      localStorage.removeItem("username")
      localStorage.removeItem("user_role")
      localStorage.removeItem("user_shop_id")
    }
  },

  /**
   * Verifies the JWT token and returns the user session.
   * @param token The JWT token to verify.
   * @returns The user session if valid, otherwise null.
   */
  verifyToken: (token: string): UserSession | null => {
    try {
      const decoded = verify(token, JWT_SECRET) as {
        userId: string
        userName: string
        userEmail: string
        userRole: string
        shopId?: string
        permissions: string[]
        exp: number
      }

      const expiresAt = new Date(decoded.exp * 1000).toISOString()

      return {
        token,
        user: {
          id: decoded.userId,
          name: decoded.userName,
          email: decoded.userEmail,
          role: decoded.userRole,
          shopId: decoded.shopId,
          permissions: decoded.permissions,
        },
        expiresAt,
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  },

  /**
   * Gets the current user session from localStorage.
   * @returns The current user session or null if not logged in.
   */
  getCurrentSession: (): UserSession | null => {
    if (typeof window === "undefined") {
      return null // Not available on server side directly from localStorage
    }
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      return null
    }
    return authManager.verifyToken(token)
  },

  /**
   * Checks if the current user has a specific permission.
   * @param permission The permission string to check (e.g., "users:read").
   * @returns True if the user has the permission, false otherwise.
   */
  hasPermission: (permission: string): boolean => {
    const session = authManager.getCurrentSession()
    if (!session) return false

    // Admin role has all permissions
    if (session.user.role === "admin") return true

    return session.user.permissions.includes(permission)
  },

  /**
   * Checks if the current user has one of the required roles.
   * @param requiredRoles An array of roles.
   * @returns True if the user has at least one of the required roles, false otherwise.
   */
  hasRole: (requiredRoles: string[]): boolean => {
    const session = authManager.getCurrentSession()
    if (!session) return false
    return requiredRoles.includes(session.user.role)
  },

  /**
   * Checks if the current user's shopId matches the required shopId.
   * @param requiredShopId The shopId to match.
   * @returns True if the shopId matches or if the user is an admin, false otherwise.
   */
  isShopSpecificUser: (requiredShopId: string): boolean => {
    const session = authManager.getCurrentSession()
    if (!session) return false

    // Admins can access any shop's data
    if (session.user.role === "admin") return true

    return session.user.shopId === requiredShopId
  },
}
