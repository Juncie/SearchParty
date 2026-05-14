import { describe, expect, it } from 'vitest'

import { formatPhoneNumberMask } from './phone-mask.ts'

describe('formatPhoneNumberMask', () => {
  it('returns empty string for empty input', () => {
    expect(formatPhoneNumberMask('')).toBe('')
  })

  it('preserves a lone plus while the user starts typing', () => {
    expect(formatPhoneNumberMask('+')).toBe('+')
    expect(formatPhoneNumberMask('+   ')).toBe('+')
  })

  it('formats after the leading country digit', () => {
    expect(formatPhoneNumberMask('1')).toBe('+1')
    expect(formatPhoneNumberMask('15')).toBe('+1 5')
  })

  it('adds implicit +1 for ten-digit national numbers', () => {
    expect(formatPhoneNumberMask('555')).toBe('+1 555')
    expect(formatPhoneNumberMask('5551234567')).toBe('+1 555 123 4567')
  })

  it('handles eleven digits starting with 1', () => {
    expect(formatPhoneNumberMask('15551234567')).toBe('+1 555 123 4567')
    expect(formatPhoneNumberMask('+1 (555) 123-4567')).toBe('+1 555 123 4567')
  })

  it('truncates extra digits beyond NANP length', () => {
    expect(formatPhoneNumberMask('15551234567890')).toBe('+1 555 123 4567')
  })
})
