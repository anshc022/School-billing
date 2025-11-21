import { describe, it, expect } from 'vitest'
import { generateReceiptId, formatCurrency, getMonthName } from '../src/main/utils'

describe('Utils', () => {
  it('generates a receipt ID in the correct format', () => {
    const receiptId = generateReceiptId()
    expect(receiptId).toMatch(/^RCPT-\d{8}-\d{4}$/)
  })

  it('formats currency correctly', () => {
    const formatted = formatCurrency(100000)
    expect(formatted).toContain('1')
  })

  it('returns correct month name', () => {
    expect(getMonthName(1)).toBe('January')
    expect(getMonthName(12)).toBe('December')
    expect(getMonthName(13)).toBe('Invalid')
  })
})
