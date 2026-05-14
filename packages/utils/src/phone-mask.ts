/**
 * NANP (+1) phone input mask aligned with onboarding copy (`+1 XXX XXX XXXX`).
 * Strips non-digits, caps at ten national digits (optional leading country `1`),
 * and inserts spaces after `+1` and between digit groups.
 */

/**
 * Returns a display string for a phone field while the user types or pastes.
 * Uses implicit US/Canada country code `1` in the visible prefix.
 *
 * @param raw - Current input value (may include `+`, spaces, or punctuation).
 * @returns Masked value safe to bind to a controlled `<input type="tel" />`.
 */
export function formatPhoneNumberMask(raw: string): string {
  const digits = raw.replaceAll(/\D/g, '')

  if (digits.length === 0) {
    return raw.trim() === '+' ? '+' : ''
  }

  if (digits === '1') {
    return '+1'
  }

  const national = digits.startsWith('1')
    ? digits.slice(1, 11)
    : digits.slice(0, 10)

  if (national.length === 0) {
    return '+1'
  }

  const area = national.slice(0, 3)
  const prefix = national.slice(3, 6)
  const line = national.slice(6, 10)

  let formatted = '+1'
  if (area.length > 0) {
    formatted += ` ${area}`
  }
  if (prefix.length > 0) {
    formatted += ` ${prefix}`
  }
  if (line.length > 0) {
    formatted += ` ${line}`
  }

  return formatted
}
