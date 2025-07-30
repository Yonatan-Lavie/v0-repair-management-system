import { getDemoData } from "./demo-data"

export const demoHelpers = {
  // Generate realistic timestamps
  generateTimestamp: (daysAgo: number, hour = 10, minute = 0) => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    date.setHours(hour, minute, 0, 0)
    return date.toISOString()
  },

  // Format Hebrew date
  formatHebrewDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  },

  // Calculate repair duration
  calculateRepairDuration: (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  },

  // Get status color for UI
  getStatusColor: (status: string) => {
    const statusColors = {
      נוצר: "secondary",
      "נשלח לסדנה": "secondary",
      התקבל: "default",
      "בתהליך תיקון": "default",
      "תוקן - מוכן לשילוח": "outline",
      "ממתין לאיסוף": "default",
      הושלם: "outline",
    }
    return statusColors[status as keyof typeof statusColors] || "secondary"
  },

  // Get priority color
  getPriorityColor: (priority: string) => {
    const priorityColors = {
      נמוך: "secondary",
      רגיל: "default",
      גבוה: "destructive",
      דחוף: "destructive",
    }
    return priorityColors[priority as keyof typeof priorityColors] || "default"
  },

  // Generate QR code URL (now handled by qr-security.ts)
  generateQRCode: (data: string, size = 200) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`
  },

  // Get repair progress percentage
  getRepairProgress: (status: string) => {
    const progressMap = {
      נוצר: 10,
      "נשלח לסדנה": 25,
      התקבל: 40,
      "בתהליך תיקון": 60,
      "תוקן - מוכן לשילוח": 80,
      "ממתין לאיסוף": 90,
      הושלם: 100,
    }
    return progressMap[status as keyof typeof progressMap] || 0
  },

  // Simulate SMS sending
  simulateSMS: (phone: string, message: string) => {
    console.log(`📱 SMS נשלח ל-${phone}: ${message}`)
    return {
      success: true,
      messageId: `SMS_${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
  },

  // Simulate email sending
  simulateEmail: (email: string, subject: string, body: string) => {
    console.log(`📧 מייל נשלח ל-${email}: ${subject}`)
    return {
      success: true,
      messageId: `EMAIL_${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
  },

  // Get shop working hours
  getShopWorkingHours: (shopId: string) => {
    return {
      sunday: "09:00-18:00",
      monday: "09:00-18:00",
      tuesday: "09:00-18:00",
      wednesday: "09:00-18:00",
      thursday: "09:00-18:00",
      friday: "09:00-14:00",
      saturday: "סגור",
    }
  },

  // Calculate estimated completion - adapted for jewelry issues
  calculateEstimatedCompletion: (issue: string, productType: string): string => {
    let baseDays = 3 // Default for general jewelry repair

    if (issue.includes("אבן חסרה") || issue.includes("שיבוץ")) {
      baseDays += 5 // More time for stone replacement/setting
    }
    if (issue.includes("שריטה") || issue.includes("ליטוש")) {
      baseDays += 2 // Polishing and scratch removal
    }
    if (issue.includes("ניקוי") || issue.includes("הברקה")) {
      baseDays += 1 // Simple cleaning
    }
    if (issue.includes("סוגר שבור") || issue.includes("תיקון שרשרת")) {
      baseDays += 3 // Chain/clasp repair
    }
    if (productType === "שעון יוקרה") {
      baseDays += 7 // Watches often require specialized attention
    }

    const completionDate = new Date()
    completionDate.setDate(completionDate.getDate() + baseDays)

    return completionDate.toLocaleDateString("he-IL")
  },

  // Generate repair statistics
  generateRepairStats: (repairs: any[]) => {
    const total = repairs.length
    const completed = repairs.filter((r) => r.status === "הושלם").length
    const active = repairs.filter((r) =>
      ["נשלח לסדנה", "התקבל", "בתהליך תיקון", "ממתין לאיסוף"].includes(r.status),
    ).length

    const avgTime =
      repairs
        .filter((r) => r.completedAt)
        .reduce((acc, r) => {
          const duration = demoHelpers.calculateRepairDuration(r.createdAt, r.completedAt)
          return acc + duration
        }, 0) / completed || 0

    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : "0",
      avgTime: avgTime.toFixed(1),
    }
  },

  // Get repair status history
  getRepairStatusHistory: (repairId: string) => {
    const repair = getDemoData.getRepair(repairId)
    if (!repair) return []

    const timeline = getDemoData.repairTimelines[repairId] || []
    return timeline.map((event) => ({
      status: event.step,
      date: event.date,
      user: event.user,
    }))
  },

  // Get product details
  getProductDetails: (productId: string) => {
    return getDemoData.getProduct(productId)
  },

  // Get customer details
  getCustomerDetails: (customerId: string) => {
    return getDemoData.getCustomer(customerId)
  },
}
