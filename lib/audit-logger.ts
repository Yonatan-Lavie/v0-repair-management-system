interface AuditLogEntry {
  timestamp: string
  userId: string
  userName: string
  action: string
  details: Record<string, any>
  ipAddress?: string
}

// In a real application, this would interact with a database or a dedicated logging service.
// For this demo, we'll just log to the console and keep a small in-memory array.
const auditLogs: AuditLogEntry[] = []
const MAX_LOGS = 100

export const auditLogger = {
  /**
   * Logs an audit event.
   * @param userId The ID of the user performing the action.
   * @param userName The name of the user performing the action.
   * @param action A description of the action performed (e.g., "User Login", "Repair Status Update").
   * @param details An object containing additional context for the action.
   * @param ipAddress (Optional) The IP address from which the action originated.
   */
  log: (userId: string, userName: string, action: string, details: Record<string, any>, ipAddress?: string) => {
    const timestamp = new Date().toISOString()
    const logEntry: AuditLogEntry = {
      timestamp,
      userId,
      userName,
      action,
      details,
      ipAddress,
    }

    auditLogs.push(logEntry)
    if (auditLogs.length > MAX_LOGS) {
      auditLogs.shift() // Remove the oldest log if max limit is reached
    }

    console.log("AUDIT LOG:", logEntry)
  },

  /**
   * Retrieves all current audit logs.
   * In a real system, this would involve querying the database.
   * @returns An array of audit log entries.
   */
  getLogs: (): AuditLogEntry[] => {
    return [...auditLogs] // Return a copy to prevent external modification
  },

  /**
   * Clears all audit logs.
   * (For development/testing purposes only, not for production).
   */
  clearLogs: () => {
    auditLogs.length = 0
    console.log("AUDIT LOGS CLEARED.")
  },
}
