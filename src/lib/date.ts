import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from 'date-fns'

export function formatDate(
  date: string | Date,
  formatStr: string = 'MMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'h:mm a')
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM d, yyyy h:mm a')
}

export function isDateToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isToday(dateObj)
}

export function isDateTomorrow(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isTomorrow(dateObj)
}

export function isDateYesterday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isYesterday(dateObj)
}

export function getRelativeDateLabel(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (isToday(dateObj)) return 'Today'
  if (isTomorrow(dateObj)) return 'Tomorrow'
  if (isYesterday(dateObj)) return 'Yesterday'

  const now = new Date()
  const diffInDays = Math.ceil(
    (dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} days ago`
  } else if (diffInDays <= 7) {
    return `In ${diffInDays} days`
  } else {
    return formatDate(dateObj)
  }
}

export function getDateRangeLabel(
  start: string | Date,
  end: string | Date
): string {
  const startObj = typeof start === 'string' ? parseISO(start) : start
  const endObj = typeof end === 'string' ? parseISO(end) : end

  if (isDateToday(startObj) && isDateToday(endObj)) {
    return 'Today'
  }

  if (startObj.toDateString() === endObj.toDateString()) {
    return formatDate(startObj)
  }

  return `${formatDate(startObj)} - ${formatDate(endObj)}`
}

export function getTodayRange(): { start: string; end: string } {
  const today = new Date()
  return {
    start: startOfDay(today).toISOString(),
    end: endOfDay(today).toISOString(),
  }
}

export function getWeekRange(): { start: string; end: string } {
  const today = new Date()
  return {
    start: startOfWeek(today, { weekStartsOn: 1 }).toISOString(), // Monday
    end: endOfWeek(today, { weekStartsOn: 1 }).toISOString(), // Sunday
  }
}

export function getMonthRange(): { start: string; end: string } {
  const today = new Date()
  return {
    start: startOfMonth(today).toISOString(),
    end: endOfMonth(today).toISOString(),
  }
}

export function getNext7DaysRange(): { start: string; end: string } {
  const today = new Date()
  return {
    start: startOfDay(today).toISOString(),
    end: endOfDay(addDays(today, 7)).toISOString(),
  }
}

export function isOverdue(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj < startOfDay(new Date())
}

export function isDueSoon(date: string | Date, hours: number = 24): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const threshold = addDays(new Date(), hours / 24)
  return dateObj <= threshold && dateObj >= new Date()
}
