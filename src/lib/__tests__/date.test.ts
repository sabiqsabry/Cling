import { describe, it, expect } from 'vitest'
import { 
  formatDate, 
  isDateToday, 
  isDateTomorrow, 
  isDateYesterday,
  getRelativeDateLabel,
  getDateRangeLabel
} from '../date'

describe('date utilities', () => {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const result = formatDate(today)
      expect(result).toMatch(/\w{3} \d{1,2}, \d{4}/) // e.g., "Jan 15, 2024"
    })

    it('should format date with custom format', () => {
      const result = formatDate(today, 'yyyy-MM-dd')
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/) // e.g., "2024-01-15"
    })

    it('should handle string input', () => {
      const result = formatDate(today.toISOString())
      expect(result).toMatch(/\w{3} \d{1,2}, \d{4}/)
    })
  })

  describe('isDateToday', () => {
    it('should return true for today', () => {
      expect(isDateToday(today)).toBe(true)
      expect(isDateToday(today.toISOString())).toBe(true)
    })

    it('should return false for tomorrow', () => {
      expect(isDateToday(tomorrow)).toBe(false)
      expect(isDateToday(tomorrow.toISOString())).toBe(false)
    })

    it('should return false for yesterday', () => {
      expect(isDateToday(yesterday)).toBe(false)
      expect(isDateToday(yesterday.toISOString())).toBe(false)
    })
  })

  describe('isDateTomorrow', () => {
    it('should return true for tomorrow', () => {
      expect(isDateTomorrow(tomorrow)).toBe(true)
      expect(isDateTomorrow(tomorrow.toISOString())).toBe(true)
    })

    it('should return false for today', () => {
      expect(isDateTomorrow(today)).toBe(false)
      expect(isDateTomorrow(today.toISOString())).toBe(false)
    })

    it('should return false for yesterday', () => {
      expect(isDateTomorrow(yesterday)).toBe(false)
      expect(isDateTomorrow(yesterday.toISOString())).toBe(false)
    })
  })

  describe('isDateYesterday', () => {
    it('should return true for yesterday', () => {
      expect(isDateYesterday(yesterday)).toBe(true)
      expect(isDateYesterday(yesterday.toISOString())).toBe(true)
    })

    it('should return false for today', () => {
      expect(isDateYesterday(today)).toBe(false)
      expect(isDateYesterday(today.toISOString())).toBe(false)
    })

    it('should return false for tomorrow', () => {
      expect(isDateYesterday(tomorrow)).toBe(false)
      expect(isDateYesterday(tomorrow.toISOString())).toBe(false)
    })
  })

  describe('getRelativeDateLabel', () => {
    it('should return "Today" for today', () => {
      expect(getRelativeDateLabel(today)).toBe('Today')
      expect(getRelativeDateLabel(today.toISOString())).toBe('Today')
    })

    it('should return "Tomorrow" for tomorrow', () => {
      expect(getRelativeDateLabel(tomorrow)).toBe('Tomorrow')
      expect(getRelativeDateLabel(tomorrow.toISOString())).toBe('Tomorrow')
    })

    it('should return "Yesterday" for yesterday', () => {
      expect(getRelativeDateLabel(yesterday)).toBe('Yesterday')
      expect(getRelativeDateLabel(yesterday.toISOString())).toBe('Yesterday')
    })

    it('should return formatted date for other dates', () => {
      const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      const result = getRelativeDateLabel(futureDate)
      expect(result).toMatch(/\w{3} \d{1,2}/) // e.g., "Jan 22"
    })
  })

  describe('getDateRangeLabel', () => {
    it('should return "Today" for same day range', () => {
      const start = today
      const end = today
      expect(getDateRangeLabel(start, end)).toBe('Today')
    })

    it('should return formatted date for single day range', () => {
      const start = tomorrow
      const end = tomorrow
      expect(getDateRangeLabel(start, end)).toMatch(/\w{3} \d{1,2}, \d{4}/)
    })

    it('should return date range for multi-day range', () => {
      const start = today
      const end = tomorrow
      const result = getDateRangeLabel(start, end)
      expect(result).toContain(' - ')
    })
  })
})
