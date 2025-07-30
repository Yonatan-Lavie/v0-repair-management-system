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
  calculateEstimatedCompletion: (issueType: string, priority: string) => {
    const baseDays = {
      "שריטות/פגמים במתכת": 2,
      "אבן חסרה/רופפת": 3,
      "תיקון סוגר/שרשרת": 1,
      "ניקוי וליטוש": 1,
      "הקטנה/הגדלה": 2,
      "החלפת סוללה (שעון)": 1,
      אחר: 3,
    }

    const priorityMultiplier = {
      נמוך: 1.5,
      רגיל: 1,
      גבוה: 0.7,
      דחוף: 0.5,
    }

    const base = baseDays[issueType as keyof typeof baseDays] || 3
    const multiplier = priorityMultiplier[priority as keyof typeof priorityMultiplier] || 1
    const estimatedDays = Math.ceil(base * multiplier)

    const completionDate = new Date()
    completionDate.setDate(completionDate.getDate() + estimatedDays)

    return completionDate.toISOString().split("T")[0]
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
}
