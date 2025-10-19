import * as chrono from 'chrono-node'
import { RRule } from 'rrule'
import { format } from 'date-fns'

export interface ParsedChip {
  type: 'date' | 'time' | 'recurrence' | 'tag' | 'priority' | 'duration'
  value: string
  text: string
  startIndex: number
  endIndex: number
}

export interface ParseResult {
  title: string
  chips: ParsedChip[]
  extracted: {
    startAt?: string
    endAt?: string
    recurrence?: string
    tags: string[]
    priority?: number
    duration?: number
  }
}

/**
 * Parse natural language input for task creation
 * Example: "Submit report Tue 3-4pm every 2 weeks #uni"
 */
export function parseTaskInput(input: string): ParseResult {
  const chips: ParsedChip[] = []
  let title = input
  const extracted = {
    tags: [],
    startAt: undefined,
    endAt: undefined,
    recurrence: undefined,
    priority: undefined,
    duration: undefined,
  } as ParseResult['extracted']

  // Extract tags (#tag)
  const tagRegex = /#(\w+)/g
  let tagMatch
  while ((tagMatch = tagRegex.exec(input)) !== null) {
    const tag = tagMatch[1].toLowerCase()
    extracted.tags.push(tag)

    chips.push({
      type: 'tag',
      value: tag,
      text: `#${tag}`,
      startIndex: tagMatch.index,
      endIndex: tagMatch.index + tagMatch[0].length,
    })
  }

  // Extract priority (P1, P2, P3, P4)
  const priorityRegex = /P([1-4])/gi
  let priorityMatch
  while ((priorityMatch = priorityRegex.exec(input)) !== null) {
    const priority = parseInt(priorityMatch[1])
    extracted.priority = priority

    chips.push({
      type: 'priority',
      value: priority.toString(),
      text: priorityMatch[0],
      startIndex: priorityMatch.index,
      endIndex: priorityMatch.index + priorityMatch[0].length,
    })
  }

  // Extract duration (30min, 2h, 1.5 hours, etc.)
  const durationRegex =
    /(\d+(?:\.\d+)?)\s*(min|mins|minute|minutes|h|hour|hours|hr|hrs)/gi
  let durationMatch
  while ((durationMatch = durationRegex.exec(input)) !== null) {
    const value = parseFloat(durationMatch[1])
    const unit = durationMatch[2].toLowerCase()
    let minutes: number

    if (unit.startsWith('h')) {
      minutes = value * 60
    } else {
      minutes = value
    }

    extracted.duration = minutes

    chips.push({
      type: 'duration',
      value: minutes.toString(),
      text: durationMatch[0],
      startIndex: durationMatch.index,
      endIndex: durationMatch.index + durationMatch[0].length,
    })
  }

  // Extract recurrence patterns
  const recurrencePatterns = [
    {
      pattern: /every\s+(\d+)\s+weeks?/gi,
      rrule: (n: number) => `FREQ=WEEKLY;INTERVAL=${n}`,
    },
    { pattern: /every\s+week/gi, rrule: () => 'FREQ=WEEKLY' },
    { pattern: /daily/gi, rrule: () => 'FREQ=DAILY' },
    { pattern: /every\s+day/gi, rrule: () => 'FREQ=DAILY' },
    { pattern: /weekly/gi, rrule: () => 'FREQ=WEEKLY' },
    { pattern: /monthly/gi, rrule: () => 'FREQ=MONTHLY' },
    {
      pattern: /every\s+(\d+)\s+days?/gi,
      rrule: (n: number) => `FREQ=DAILY;INTERVAL=${n}`,
    },
  ]

  for (const { pattern, rrule } of recurrencePatterns) {
    const match = pattern.exec(input)
    if (match) {
      const rule = match[1] ? rrule(parseInt(match[1])) : rrule(1)
      extracted.recurrence = rule

      chips.push({
        type: 'recurrence',
        value: rule,
        text: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
      break // Only match the first recurrence pattern
    }
  }

  // Extract dates and times using chrono
  const chronoResults = chrono.parse(input)
  for (const result of chronoResults) {
    const { start, end, text } = result

    // Check if start is valid by trying to get the date
    try {
      const startDate = start.date()
      const startTime =
        start.get('hour') !== undefined && start.get('minute') !== undefined

      if (startTime) {
        // Has specific time
        extracted.startAt = startDate.toISOString()

        // Check if end is valid
        try {
          const endDate = end?.date()
          if (endDate && endDate > startDate) {
            // Has end time
            extracted.endAt = endDate.toISOString()

            chips.push({
              type: 'time',
              value: `${startDate.toISOString()}|${endDate.toISOString()}`,
              text: `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`,
              startIndex: result.index,
              endIndex: result.index + text.length,
            })
          } else {
            // Start time only
            chips.push({
              type: 'time',
              value: startDate.toISOString(),
              text: format(startDate, 'h:mm a'),
              startIndex: result.index,
              endIndex: result.index + text.length,
            })
          }
        } catch {
          // End date invalid, just use start time
          chips.push({
            type: 'time',
            value: startDate.toISOString(),
            text: format(startDate, 'h:mm a'),
            startIndex: result.index,
            endIndex: result.index + text.length,
          })
        }
      } else {
        // Date only
        chips.push({
          type: 'date',
          value: startDate.toISOString(),
          text: format(startDate, 'MMM d'),
          startIndex: result.index,
          endIndex: result.index + text.length,
        })

        if (!extracted.startAt) {
          extracted.startAt = startDate.toISOString()
        }
      }
    } catch {
      // Skip invalid date results
      continue
    }
  }

  // Remove extracted parts from title
  title = removeExtractedParts(input, chips)

  return {
    title: title.trim(),
    chips: chips.sort((a, b) => a.startIndex - b.startIndex),
    extracted,
  }
}

/**
 * Remove extracted parts from the original input to get clean title
 */
function removeExtractedParts(input: string, chips: ParsedChip[]): string {
  // Sort chips by start index in descending order to avoid index shifting
  const sortedChips = [...chips].sort((a, b) => b.startIndex - a.startIndex)

  let result = input

  for (const chip of sortedChips) {
    // Only remove if it's not a tag (tags are usually kept in title)
    if (chip.type !== 'tag') {
      const before = result.substring(0, chip.startIndex)
      const after = result.substring(chip.endIndex)
      result = (before + after).trim()
    }
  }

  return result
}

/**
 * Remove a specific chip from the title
 */
export function removeChip(title: string, chip: ParsedChip): string {
  const before = title.substring(0, chip.startIndex)
  const after = title.substring(chip.endIndex)
  return (before + after).trim()
}

/**
 * Generate RRULE string from natural language
 */
export function generateRRule(input: string): string | undefined {
  const patterns = [
    {
      pattern: /every\s+(\d+)\s+weeks?/gi,
      rrule: (n: number) => `FREQ=WEEKLY;INTERVAL=${n}`,
    },
    { pattern: /every\s+week/gi, rrule: () => 'FREQ=WEEKLY' },
    { pattern: /daily/gi, rrule: () => 'FREQ=DAILY' },
    { pattern: /every\s+day/gi, rrule: () => 'FREQ=DAILY' },
    { pattern: /weekly/gi, rrule: () => 'FREQ=WEEKLY' },
    { pattern: /monthly/gi, rrule: () => 'FREQ=MONTHLY' },
    {
      pattern: /every\s+(\d+)\s+days?/gi,
      rrule: (n: number) => `FREQ=DAILY;INTERVAL=${n}`,
    },
  ]

  for (const { pattern, rrule } of patterns) {
    const match = pattern.exec(input)
    if (match) {
      return match[1] ? rrule(parseInt(match[1])) : rrule(1)
    }
  }

  return undefined
}

/**
 * Validate RRULE string
 */
export function validateRRule(rruleStr: string): boolean {
  try {
    RRule.fromString(rruleStr)
    return true
  } catch {
    return false
  }
}
