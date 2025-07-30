// This file contains utility functions for input validation.

export const inputValidation = {
  /**
   * Validates if a string is a valid email format.
   * @param email The email string to validate.
   * @returns True if valid, false otherwise.
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validates if a string is not empty and optionally meets a minimum length.
   * @param value The string to validate.
   * @param minLength Optional minimum length.
   * @returns True if valid, false otherwise.
   */
  isNotEmpty(value: string | null | undefined, minLength = 1): boolean {
    return typeof value === "string" && value.trim().length >= minLength
  },

  /**
   * Validates if a string is a valid phone number format (basic check).
   * @param phone The phone number string to validate.
   * @returns True if valid, false otherwise.
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?\d{7,15}$/ // Basic regex for 7-15 digits, optional leading +
    return phoneRegex.test(phone)
  },

  /**
   * Validates if a number is positive.
   * @param num The number to validate.
   * @returns True if positive, false otherwise.
   */
  isPositiveNumber(num: number): boolean {
    return typeof num === "number" && num > 0
  },

  /**
   * Validates if a string is a valid UUID (basic check).
   * @param uuid The UUID string to validate.
   * @returns True if valid, false otherwise.
   */
  isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  },

  /**
   * Sanitizes a string by removing leading/trailing whitespace.
   * @param value The string to sanitize.
   * @returns The sanitized string.
   */
  sanitizeString(value: string): string {
    return value.trim()
  },
}
