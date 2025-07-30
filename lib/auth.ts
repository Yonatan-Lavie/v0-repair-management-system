// Authentication and authorization system - Core logic (server-side only)

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

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
const TOKEN_EXPIRATION_HOURS = 24 // Token valid for 24 hours

// Validate credentials (mock implementation)
async function _validateCredentials(email: string, password: string): Promise<User | null> {
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
async function _generateToken(user: User): Promise<string> {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    shopId: user.shopId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_HOURS * 60 * 60, // 24 hours
  }

  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(JWT_SECRET)
}

// Verify JWT token
async function _verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

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

// Export core functions for use in Server Actions
export const authCore = {
  validateCredentials: _validateCredentials,
  generateToken: _generateToken,
  verifyToken: _verifyToken,
  ROLE_PERMISSIONS,
}
