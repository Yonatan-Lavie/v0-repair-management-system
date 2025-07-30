// Status management system for repairs

export interface StatusUpdate {
  repairId: string
  newStatus: string
  updatedBy: string
  timestamp: string
  notes?: string
}

export class RepairStatusManager {
  private static instance: RepairStatusManager
  private statusHistory: StatusUpdate[] = []

  static getInstance(): RepairStatusManager {
    if (!RepairStatusManager.instance) {
      RepairStatusManager.instance = new RepairStatusManager()
    }
    return RepairStatusManager.instance
  }

  // Update repair status
  updateStatus(repairId: string, newStatus: string, updatedBy: string, notes?: string): boolean {
    try {
      const update: StatusUpdate = {
        repairId,
        newStatus,
        updatedBy,
        timestamp: new Date().toISOString(),
        notes,
      }

      this.statusHistory.push(update)

      // In a real app, this would update the database
      console.log(`Status updated: ${repairId} -> ${newStatus} by ${updatedBy}`)

      // Send notifications
      this.sendStatusNotification(repairId, newStatus, updatedBy)

      return true
    } catch (error) {
      console.error("Failed to update status:", error)
      return false
    }
  }

  // Get status history for a repair
  getStatusHistory(repairId: string): StatusUpdate[] {
    return this.statusHistory.filter((update) => update.repairId === repairId)
  }

  // Send notifications based on status change
  private sendStatusNotification(repairId: string, newStatus: string, updatedBy: string) {
    const notifications = this.getNotificationsForStatus(newStatus)

    notifications.forEach((notification) => {
      // In a real app, this would send actual notifications
      console.log(`Notification: ${notification.message} for ${repairId}`)
    })
  }

  // Get appropriate notifications for status
  private getNotificationsForStatus(status: string) {
    const notificationMap: Record<string, any[]> = {
      התקבל: [
        { type: "customer", message: "התכשיט שלך התקבל בסדנה" }, // Updated message
        { type: "technician", message: "תיקון תכשיט חדש הוקצה אליך" }, // Updated message
      ],
      "בתהליך תיקון": [{ type: "customer", message: "תיקון התכשיט החל - נעדכן אותך בהמשך" }], // Updated message
      "תוקן - מוכן לשילוח": [{ type: "shop", message: "תיקון תכשיט הושלם וחוזר לחנות" }], // Updated message
      "ממתין לאיסוף": [
        { type: "customer", message: "התכשיט מוכן לאיסוף!" }, // Updated message
        { type: "seller", message: "תכשיט מוכן למסירה ללקוח" }, // Updated message
      ],
      הושלם: [{ type: "customer", message: "תודה שבחרת בנו!" }],
    }

    return notificationMap[status] || []
  }

  // Validate status transition
  isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      נוצר: ["נשלח לסדנה", "בוטל"], // Changed "לתיקון" to "לסדנה"
      "נשלח לסדנה": ["התקבל", "בוטל"], // Changed "לתיקון" to "לסדנה"
      התקבל: ["בתהליך תיקון", "בוטל"],
      "בתהליך תיקון": ["תוקן - מוכן לשילוח", "דורש חלקים", "בעיה טכנית"],
      "תוקן - מוכן לשילוח": ["ממתין לאיסוף"],
      "ממתין לאיסוף": ["הושלם"],
      "דורש חלקים": ["בתהליך תיקון", "בוטל"],
      "בעיה טכנית": ["בתהליך תיקון", "בוטל"],
    }

    return validTransitions[currentStatus]?.includes(newStatus) || false
  }

  // Get next possible statuses
  getNextPossibleStatuses(currentStatus: string): string[] {
    const validTransitions: Record<string, string[]> = {
      נוצר: ["נשלח לסדנה"], // Changed "לתיקון" to "לסדנה"
      "נשלח לסדנה": ["התקבל"], // Changed "לתיקון" to "לסדנה"
      התקבל: ["בתהליך תיקון"],
      "בתהליך תיקון": ["תוקן - מוכן לשילוח", "דורש חלקים", "בעיה טכנית"],
      "תוקן - מוכן לשילוח": ["ממתין לאיסוף"],
      "ממתין לאיסוף": ["הושלם"],
      "דורש חלקים": ["בתהליך תיקון"],
      "בעיה טכנית": ["בתהליך תיקון"],
    }

    return validTransitions[currentStatus] || []
  }

  // Calculate repair duration
  calculateRepairDuration(repairId: string): number {
    const history = this.getStatusHistory(repairId)
    const startUpdate = history.find((h) => h.newStatus === "התקבל")
    const endUpdate = history.find((h) => h.newStatus === "הושלם")

    if (!startUpdate || !endUpdate) return 0

    const start = new Date(startUpdate.timestamp)
    const end = new Date(endUpdate.timestamp)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }
}

// Export singleton instance
export const statusManager = RepairStatusManager.getInstance()
