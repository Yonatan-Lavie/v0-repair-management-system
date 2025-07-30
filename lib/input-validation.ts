export const inputValidation = {
  /**
   * Validates an email address.
   * @param email The email string to validate.
   * @returns True if the email is valid, false otherwise.
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validates a password based on complexity requirements.
   * Requires at least 8 characters, one uppercase, one lowercase, one number, one special character.
   * @param password The password string to validate.
   * @returns True if the password is valid, false otherwise.
   */
  isValidPassword: (password: string): boolean => {
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
  },

  /**
   * Validates a phone number (simple check for digits and common length).
   * @param phone The phone number string to validate.
   * @returns True if the phone number is valid, false otherwise.
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?\d{7,15}$/ // Allows optional + and 7-15 digits
    return phoneRegex.test(phone)
  },

  /**
   * Validates a serial number.
   * Assumes serial numbers can be alphanumeric and typically have a certain length range.
   * This is a generic validation; specific formats might require more precise regex.
   * @param serialNumber The serial number string to validate.
   * @returns True if the serial number is valid, false otherwise.
   */
  isValidSerialNumber: (serialNumber: string): boolean => {
    // Example: alphanumeric, 5 to 20 characters long
    const serialNumberRegex = /^[a-zA-Z0-9]{5,20}$/
    return serialNumberRegex.test(serialNumber)
  },

  /**
   * Sanitizes a string to prevent XSS attacks.
   * @param input The string to sanitize.
   * @returns The sanitized string.
   */
  sanitizeString: (input: string): string => {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    }
    const reg = /[&<>"'/]/gi
    return input.replace(reg, (match) => map[match])
  },
}
