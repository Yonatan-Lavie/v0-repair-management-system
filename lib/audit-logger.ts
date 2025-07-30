// Audit logging system

export interface AuditLog {
  id: string
  timestamp: string
  userId?: string
  userEmail?: string
  action: string
  resource: string
  resourceId?: string
  details: any
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
}

class AuditLogger {
  private static instance: AuditLogger
  private logs: AuditLog[] = []

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  // Log user action
  log(params: {
    action: string
    resource: string
    resourceId?: string
    details?: any
    success?: boolean
    errorMessage?: string
    userId?: string
    userEmail?: string
  }): void {
    const logEntry: AuditLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId: params.userId,
      userEmail: params.userEmail,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      success: params.success !== false,
      errorMessage: params.errorMessage,
    }

    this.logs.push(logEntry)
    this.persistLog(logEntry)

    // In production, send to logging service
    console.log("Audit Log:", logEntry)
  }

  // Log authentication events
  logAuth(event: "login" | "logout" | "login_failed", userId?: string, email?: string, details?: any): void {
    this.log({
      action: event,
      resource: "authentication",
      userId,
      userEmail: email,
      details,
      success: event !== "login_failed",
    })
  }

  // Log repair actions
  logRepair(action: string, repairId: string, userId?: string, details?: any): void {
    this.log({
      action,
      resource: "repair",
      resourceId: repairId,
      userId,
      details,
    })
  }

  // Log user management actions
  logUserManagement(action: string, targetUserId: string, adminUserId?: string, details?: any): void {
    this.log({
      action,
      resource: "user",
      resourceId: targetUserId,
      userId: adminUserId,
      details,
    })
  }

  // Log security events
  logSecurity(event: string, details: any, userId?: string): void {
    this.log({
      action: event,
      resource: "security",
      userId,
      details,
      success: !event.includes("failed") && !event.includes("blocked"),
    })
  }

  // Get logs with filtering
  getLogs(filters?: {
    userId?: string
    action?: string
    resource?: string
    startDate?: string
    endDate?: string
    success?: boolean
  }): AuditLog[] {
    let filteredLogs = [...this.logs]

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter((log) => log.action.includes(filters.action!))
      }
      if (filters.resource) {
        filteredLogs = filteredLogs.filter((log) => log.resource === filters.resource)
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate!)
      }
      if (filters.success !== undefined) {
        filteredLogs = filteredLogs.filter((log) => log.success === filters.success)
      }
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Generate unique ID
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get client IP (mock for demo)
  private getClientIP(): string {
    // In a real app, get from request headers
    return "127.0.0.1"
  }

  // Get user agent
  private getUserAgent(): string {
    if (typeof window !== "undefined") {
      return window.navigator.userAgent
    }
    return "Unknown"
  }

  // Persist log (mock implementation)
  private persistLog(log: AuditLog): void {
    // In a real app, send to database or logging service
    if (typeof window !== "undefined") {
      const existingLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]")
      existingLogs.push(log)

      // Keep only last 1000 logs in localStorage
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000)
      }

      localStorage.setItem("audit_logs", JSON.stringify(existingLogs))
    }
  }

  // Load persisted logs
  loadPersistedLogs(): void {
    if (typeof window !== "undefined") {
      const persistedLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]")
      this.logs = persistedLogs
    }
  }
}

export const auditLogger = AuditLogger.getInstance()
