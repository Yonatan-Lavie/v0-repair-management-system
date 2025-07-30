// Status management system for repairs

import { demoData, getDemoData } from "./demo-data"
import { auditLogger } from "./audit-logger"

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
  updateStatus(repairId: string, newStatus: string, updatedBy: string): boolean {
    try {
      const repairIndex = demoData.repairs.findIndex((r) => r.repairId === repairId)

      if (repairIndex === -1) {
        console.error(`Repair with ID ${repairId} not found.`)
        auditLogger.log(updatedBy, updatedBy, "Repair Status Update Failed", {
          repairId,
          newStatus,
          reason: "Repair not found",
        })
        return false
      }

      const oldStatus = demoData.repairs[repairIndex].status
      demoData.repairs[repairIndex].status = newStatus

      // Update timeline
      const timeline = demoData.repairTimelines[repairId] || []
      const now = new Date().toLocaleString("he-IL")

      let newStep = ""
      switch (newStatus) {
        case "התקבל":
          newStep = "התקבל בסדנה"
          break
        case "בתהליך תיקון":
          newStep = "בתהליך תיקון"
          break
        case "תוקן - מוכן לשילוח":
          newStep = "הושלם - ממתין לשילוח"
          break
        case "ממתין לאיסוף": // This status is typically set by technician/shop-manager after repair is done and sent back to shop
          newStep = "מוכן לאיסוף בחנות"
          break
        case "הושלם": // This status means picked up by customer
          newStep = "נאסף על ידי לקוח"
          break
        default:
          newStep = `סטטוס עודכן ל: ${newStatus}`
      }

      // Find the corresponding step in the timeline and mark it complete, or add a new one
      const existingStepIndex = timeline.findIndex((t) => t.step.includes(newStep.split("(")[0].trim())) // Match by main part of step
      if (existingStepIndex !== -1) {
        timeline[existingStepIndex].completed = true
        timeline[existingStepIndex].date = now
        timeline[existingStepIndex].user = updatedBy
      } else {
        // Add new step if it doesn't exist or is a custom update
        timeline.push({ step: newStep, date: now, completed: true, user: updatedBy })
      }
      // Sort timeline by date if necessary (simple sort for demo)
      timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      demoData.repairTimelines[repairId] = timeline // Ensure it's saved back to mock data

      auditLogger.log(updatedBy, updatedBy, "Repair Status Updated", {
        repairId,
        oldStatus,
        newStatus,
      })

      console.log(`Repair ${repairId} status updated from ${oldStatus} to ${newStatus} by ${updatedBy}.`)
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

  /**
   * Adds a note to a repair.
   * @param repairId The ID of the repair.
   * @param noteContent The content of the note.
   * @param user The user adding the note.
   * @returns True if successful, false otherwise.
   */
  addNote(repairId: string, noteContent: string, user: string): boolean {
    const repair = getDemoData.getRepair(repairId)
    if (!repair) {
      console.error(`Repair with ID ${repairId} not found for adding note.`)
      auditLogger.log(user, user, "Add Note Failed", { repairId, noteContent, reason: "Repair not found" })
      return false
    }

    const newNote = {
      id: `NOTE${Date.now()}`,
      repairId,
      note: noteContent,
      user,
      date: new Date().toLocaleString("he-IL"),
    }

    if (!demoData.repairNotes[repairId]) {
      demoData.repairNotes[repairId] = []
    }
    demoData.repairNotes[repairId].push(newNote)

    auditLogger.log(user, user, "Repair Note Added", { repairId, noteId: newNote.id, noteContent })
    console.log(`Note added to repair ${repairId} by ${user}.`)
    return true
  }
}

// Export singleton instance
export const statusManager = RepairStatusManager.getInstance()
