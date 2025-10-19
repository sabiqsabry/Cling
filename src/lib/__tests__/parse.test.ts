import { describe, it, expect } from 'vitest'
import { parseTaskInput, ParsedTask } from '../parse'

describe('parseTaskInput', () => {
  it('should parse basic task title', () => {
    const result = parseTaskInput('Buy groceries')
    
    expect(result.title).toBe('Buy groceries')
    expect(result.tags).toEqual([])
    expect(result.priority).toBeUndefined()
    expect(result.startAt).toBeUndefined()
    expect(result.chips).toHaveLength(0)
  })

  it('should parse task with tags', () => {
    const result = parseTaskInput('Review project proposal #work #urgent')
    
    expect(result.title).toBe('Review project proposal')
    expect(result.tags).toEqual(['work', 'urgent'])
    expect(result.chips).toHaveLength(2)
    expect(result.chips[0].type).toBe('tag')
    expect(result.chips[0].value).toBe('work')
  })

  it('should parse task with priority', () => {
    const result = parseTaskInput('Fix critical bug P1')
    
    expect(result.title).toBe('Fix critical bug')
    expect(result.priority).toBe(1)
    expect(result.chips).toHaveLength(1)
    expect(result.chips[0].type).toBe('priority')
    expect(result.chips[0].value).toBe('1')
  })

  it('should parse task with date', () => {
    const result = parseTaskInput('Submit report tomorrow')
    
    expect(result.title).toBe('Submit report')
    expect(result.startAt).toBeDefined()
    expect(result.chips).toHaveLength(1)
    expect(result.chips[0].type).toBe('date')
  })

  it('should parse task with time', () => {
    const result = parseTaskInput('Meeting at 3pm')
    
    expect(result.title).toBe('Meeting')
    expect(result.startAt).toBeDefined()
    expect(result.chips).toHaveLength(1)
    expect(result.chips[0].type).toBe('time')
  })

  it('should parse task with duration', () => {
    const result = parseTaskInput('Workout for 30 minutes')
    
    expect(result.title).toBe('Workout')
    expect(result.duration).toBe(30)
    expect(result.chips).toHaveLength(1)
    expect(result.chips[0].type).toBe('duration')
  })

  it('should parse complex task with multiple elements', () => {
    const result = parseTaskInput('Submit project proposal tomorrow 3pm #work P1 2 hours')
    
    expect(result.title).toBe('Submit project proposal')
    expect(result.tags).toEqual(['work'])
    expect(result.priority).toBe(1)
    expect(result.duration).toBe(120) // 2 hours = 120 minutes
    expect(result.startAt).toBeDefined()
    expect(result.chips.length).toBeGreaterThan(0)
  })

  it('should parse recurrence patterns', () => {
    const result = parseTaskInput('Weekly team meeting every Monday')
    
    expect(result.title).toBe('Weekly team meeting')
    expect(result.recurrence).toBeDefined()
    expect(result.chips.some(chip => chip.type === 'recurrence')).toBe(true)
  })

  it('should handle empty input', () => {
    const result = parseTaskInput('')
    
    expect(result.title).toBe('')
    expect(result.tags).toEqual([])
    expect(result.chips).toHaveLength(0)
  })

  it('should handle input with only special characters', () => {
    const result = parseTaskInput('#work P1 tomorrow 3pm')
    
    expect(result.title).toBe('')
    expect(result.tags).toEqual(['work'])
    expect(result.priority).toBe(1)
    expect(result.startAt).toBeDefined()
  })

  it('should preserve description when provided', () => {
    const result = parseTaskInput('Buy groceries - Get milk, bread, and eggs')
    
    expect(result.title).toBe('Buy groceries')
    expect(result.description).toBe('Get milk, bread, and eggs')
  })

  it('should handle multiple priorities and use the last one', () => {
    const result = parseTaskInput('Task P1 P2 P3')
    
    expect(result.title).toBe('Task')
    expect(result.priority).toBe(3)
  })

  it('should handle case insensitive tags', () => {
    const result = parseTaskInput('Task #WORK #Personal')
    
    expect(result.title).toBe('Task')
    expect(result.tags).toEqual(['work', 'personal'])
  })

  it('should handle mixed case priority', () => {
    const result = parseTaskInput('Task p1 P2 p3')
    
    expect(result.title).toBe('Task')
    expect(result.priority).toBe(3)
  })
})
