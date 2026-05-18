export type ValidationResult =
  | { valid: true }
  | { valid: false; message: string }

export function isValidResult(result: ValidationResult): result is { valid: true } {
  return result.valid
}

export function validateRequired(value: string, label: string): ValidationResult {
  if (!value.trim()) {
    return { valid: false, message: `${label} is required.` }
  }
  return { valid: true }
}

export function validateMinLength(
  value: string,
  min: number,
  label: string,
): ValidationResult {
  if (value.trim().length < min) {
    return {
      valid: false,
      message: `${label} must be at least ${min} characters.`,
    }
  }
  return { valid: true }
}

export function validateMaxLength(
  value: string,
  max: number,
  label: string,
): ValidationResult {
  if (value.length > max) {
    return {
      valid: false,
      message: `${label} must be ${max} characters or fewer.`,
    }
  }
  return { valid: true }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string): ValidationResult {
  const trimmed = value.trim()
  const required = validateRequired(trimmed, 'Email address')
  if (!required.valid) return required
  if (!EMAIL_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Enter a valid email address.' }
  }
  return { valid: true }
}

const NAME_PATTERN = /^[\p{L}\s'.-]+$/u

export function validateName(value: string): ValidationResult {
  const trimmed = value.trim()
  const required = validateRequired(trimmed, 'Full name')
  if (!required.valid) return required
  const min = validateMinLength(trimmed, 2, 'Full name')
  if (!min.valid) return min
  if (!NAME_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: 'Name may only include letters, spaces, hyphens, and apostrophes.',
    }
  }
  return { valid: true }
}

export function validatePhone(value: string): ValidationResult {
  const trimmed = value.trim()
  const required = validateRequired(trimmed, 'Phone number')
  if (!required.valid) return required
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 10) {
    return {
      valid: false,
      message: 'Enter a valid phone number (at least 10 digits).',
    }
  }
  if (digits.length > 15) {
    return { valid: false, message: 'Phone number is too long.' }
  }
  return { valid: true }
}

export function validateMessage(value: string, min = 20, max = 2000): ValidationResult {
  const trimmed = value.trim()
  const required = validateRequired(trimmed, 'Message')
  if (!required.valid) return required
  const minLen = validateMinLength(trimmed, min, 'Message')
  if (!minLen.valid) return minLen
  const maxLen = validateMaxLength(trimmed, max, 'Message')
  if (!maxLen.valid) return maxLen
  return { valid: true }
}

export function validateCommentName(value: string): ValidationResult {
  const trimmed = value.trim()
  const required = validateRequired(trimmed, 'Your name')
  if (!required.valid) return required
  const min = validateMinLength(trimmed, 2, 'Your name')
  if (!min.valid) return min
  const max = validateMaxLength(trimmed, 80, 'Your name')
  if (!max.valid) return max
  if (!NAME_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: 'Name may only include letters, spaces, hyphens, and apostrophes.',
    }
  }
  return { valid: true }
}

export function validateCommentText(value: string): ValidationResult {
  const trimmed = value.trim()
  const required = validateRequired(trimmed, 'Comment')
  if (!required.valid) return required
  const min = validateMinLength(trimmed, 3, 'Comment')
  if (!min.valid) return min
  const max = validateMaxLength(trimmed, 1000, 'Comment')
  if (!max.valid) return max
  return { valid: true }
}

export function validateMatter(value: string): ValidationResult {
  if (!value.trim()) {
    return { valid: false, message: 'Please select a type of matter.' }
  }
  return { valid: true }
}

export function validateSearchQuery(value: string): ValidationResult {
  const trimmed = value.trim()
  if (trimmed.length === 0) return { valid: true }
  if (trimmed.length < 2) {
    return { valid: false, message: 'Enter at least 2 characters to search.' }
  }
  return { valid: true }
}

export function validatePersonName(value: string, label: string): ValidationResult {
  const trimmed = value.trim()
  const required = validateRequired(trimmed, label)
  if (!required.valid) return required
  const min = validateMinLength(trimmed, 2, label)
  if (!min.valid) return min
  if (!NAME_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: `${label} may only include letters, spaces, hyphens, and apostrophes.`,
    }
  }
  return { valid: true }
}

export function validatePassword(value: string, minLen = 8): ValidationResult {
  const trimmed = value
  const required = validateRequired(trimmed, 'Password')
  if (!required.valid) return required
  if (trimmed.length < minLen) {
    return {
      valid: false,
      message: `Password must be at least ${minLen} characters.`,
    }
  }
  return { valid: true }
}

export function validateConfirmPassword(password: string, confirm: string): ValidationResult {
  if (password !== confirm) {
    return { valid: false, message: 'Passwords must match.' }
  }
  return { valid: true }
}

export type AuthLoginPayload = {
  email: string
  password: string
}

export function validateAuthLogin(values: AuthLoginPayload): Record<string, string> {
  const errors: Record<string, string> = {}

  const email = validateEmail(values.email)
  if (!email.valid) errors.email = email.message

  const password = validatePassword(values.password)
  if (!password.valid) errors.password = password.message

  return errors
}

export type AuthSignupPayload = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

export function validateAuthSignup(values: AuthSignupPayload): Record<string, string> {
  const errors: Record<string, string> = {}

  const first = validatePersonName(values.firstName, 'First name')
  if (!first.valid) errors.firstName = first.message

  const last = validatePersonName(values.lastName, 'Last name')
  if (!last.valid) errors.lastName = last.message

  const phone = validatePhone(values.phone)
  if (!phone.valid) errors.phone = phone.message

  const email = validateEmail(values.email)
  if (!email.valid) errors.email = email.message

  const password = validatePassword(values.password)
  if (!password.valid) errors.password = password.message

  const confirm = validateConfirmPassword(values.password, values.confirmPassword)
  if (!confirm.valid) errors.confirmPassword = confirm.message

  return errors
}

export type ContactFormValues = {
  name: string
  phone: string
  email: string
  matter: string
  message: string
}

export function validateContactForm(values: ContactFormValues): Record<string, string> {
  const errors: Record<string, string> = {}

  const name = validateName(values.name)
  if (!name.valid) errors.name = name.message

  const phone = validatePhone(values.phone)
  if (!phone.valid) errors.phone = phone.message

  const email = validateEmail(values.email)
  if (!email.valid) errors.email = email.message

  const matter = validateMatter(values.matter)
  if (!matter.valid) errors.matter = matter.message

  const message = validateMessage(values.message)
  if (!message.valid) errors.message = message.message

  return errors
}

export function validateCommentForm(values: {
  name: string
  text: string
}): Record<string, string> {
  const errors: Record<string, string> = {}

  const name = validateCommentName(values.name)
  if (!name.valid) errors.name = name.message

  const text = validateCommentText(values.text)
  if (!text.valid) errors.text = text.message

  return errors
}

export function validateOptionalPhone(value: string): ValidationResult {
  const trimmed = value.trim()
  if (!trimmed) return { valid: true }
  return validatePhone(trimmed)
}

export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0
}
