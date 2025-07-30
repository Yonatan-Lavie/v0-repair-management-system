// This file provides a simple audit logging mechanism.
// In a real application, this would persist logs to a database or a dedicated logging service.

interface AuditLogEntry {
  timestamp: string
  userId: string
  userName: string
  event: string
  details: Record<string, any>
  ipAddress?: string // In a real app, this would be captured from the request
  userAgent?: string // In a real app, this would be captured from the request
}

export const auditLogger = {
  /**
   * Logs an audit event.
   * @param userId The ID of the user performing the action.
   * @param userName The name of the user performing the action.
   * @param event A descriptive name for the event (e.g., "User Login", "Repair Status Update").
   * @param details An object containing additional context or data for the event.
   */
  log(userId: string, userName: string, event: string, details: Record<string, any>): void {
    const logEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId,
      userName,
      event,
      details,
      ipAddress: "N/A", // Placeholder for demo
      userAgent: "N/A", // Placeholder for demo
    }

    // In a real application, this would send the logEntry to a database,
    // a logging service (e.g., Datadog, Sentry, ELK stack), or a file.
    console.log("AUDIT LOG:", JSON.stringify(logEntry, null, 2))
  },
}
