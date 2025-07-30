// Input validation and sanitization

export class InputValidator {
  // Validate email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone number (Israeli format)
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+972|0)([23489]|5[0248]|77)[0-9]{7}$/
    return phoneRegex.test(phone.replace(/[-\s]/g, ""))
  }

  // Validate password strength
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("הסיסמה חייבת להכיל לפחות 8 תווים")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("הסיסמה חייבת להכיל לפחות אות גדולה אחת")
    }

    if (!/[a-z]/.test(password)) {
      errors.push("הסיסמה חייבת להכיל לפחות אות קטנה אחת")
    }

    if (!/[0-9]/.test(password)) {
      errors.push("הסיסמה חייבת להכיל לפחות ספרה אחת")
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("הסיסמה חייבת להכיל לפחות תו מיוחד אחד")
    }

    return { valid: errors.length === 0, errors }
  }

  // Sanitize HTML input
  static sanitizeHTML(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  }

  // Validate repair ID format
  static isValidRepairId(repairId: string): boolean {
    const repairIdRegex = /^REPAIR\d{3,6}$/
    return repairIdRegex.test(repairId)
  }

  // Validate Serial Number (generic, can be adapted for specific formats)
  static isValidSerialNumber(serialNumber: string): boolean {
    // For jewelry, a simple non-empty alphanumeric check might suffice,
    // or a specific regex if brands have known patterns.
    // This is a basic example.
    return serialNumber.trim().length > 0 && /^[a-zA-Z0-9-]+$/.test(serialNumber)
  }

  // Rate limiting check
  static checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    if (typeof window === "undefined") return true // Skip on server

    const now = Date.now()
    const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || "[]")

    // Remove old attempts outside the window
    const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs)

    if (validAttempts.length >= maxAttempts) {
      return false // Rate limit exceeded
    }

    // Add current attempt
    validAttempts.push(now)
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validAttempts))

    return true
  }

  // XSS protection
  static preventXSS(input: string): string {
    const div = document.createElement("div")
    div.textContent = input
    return div.innerHTML
  }

  // SQL injection prevention (for display purposes)
  static sanitizeForDisplay(input: string): string {
    return input
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim()
  }
}
