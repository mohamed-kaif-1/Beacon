/**
 * Date and time formatting helpers for Helm Windows
 */

export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return ''
  const now = Date.now()
  const diffSec = Math.floor((now - timestamp) / 1000)

  if (diffSec < 10) return 'Just now'
  if (diffSec < 60) return `${diffSec}s ago`
  
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  const d = new Date(timestamp)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function formatDueDate(timestamp?: number): {
  label: string
  isOverdue: boolean
  isToday: boolean
  isUpcoming: boolean
} {
  if (!timestamp) {
    return { label: '', isOverdue: false, isToday: false, isUpcoming: false }
  }

  const now = new Date()
  const target = new Date(timestamp)

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()
  const endOfTomorrow = endOfToday + 24 * 60 * 60 * 1000

  const isOverdue = timestamp < startOfToday
  const isToday = timestamp >= startOfToday && timestamp <= endOfToday
  const isTomorrow = timestamp > endOfToday && timestamp <= endOfTomorrow

  const timeStr = target.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

  if (isOverdue) {
    const daysOverdue = Math.max(1, Math.floor((startOfToday - timestamp) / (24 * 60 * 60 * 1000)))
    return {
      label: daysOverdue === 1 ? `Overdue by 1 day (${timeStr})` : `Overdue (${daysOverdue}d ago)`,
      isOverdue: true,
      isToday: false,
      isUpcoming: false
    }
  }

  if (isToday) {
    return {
      label: `Today at ${timeStr}`,
      isOverdue: false,
      isToday: true,
      isUpcoming: false
    }
  }

  if (isTomorrow) {
    return {
      label: `Tomorrow at ${timeStr}`,
      isOverdue: false,
      isToday: false,
      isUpcoming: true
    }
  }

  return {
    label: target.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    isOverdue: false,
    isToday: false,
    isUpcoming: true
  }
}

/**
 * Converts timestamp to YYYY-MM-DDTHH:mm string for datetime-local input
 */
export function toInputDateTimeString(timestamp?: number): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const pad = (num: number): string => String(num).padStart(2, '0')
  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

/**
 * Parses YYYY-MM-DDTHH:mm string to timestamp
 */
export function fromInputDateTimeString(dateStr: string): number | undefined {
  if (!dateStr || dateStr.trim() === '') return undefined
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? undefined : parsed.getTime()
}
