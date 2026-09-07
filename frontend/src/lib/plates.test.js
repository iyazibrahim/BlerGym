import { describe, it, expect } from 'vitest'
import { platesFor, formatPlates, BAR } from './plates.js'

describe('platesFor', () => {
  it('loads an exact kg target', () => {
    const r = platesFor(100, 'kg')
    expect(r.bar).toBe(20)
    expect(r.leftover).toBe(0)
    expect(r.total).toBe(100)
    // 40 per side → greedy takes 25 + 15
    expect(r.perSide).toEqual([
      { weight: 25, count: 1 },
      { weight: 15, count: 1 }
    ])
  })

  it('reports leftover when not exact', () => {
    const r = platesFor(61, 'kg')
    expect(r.total).toBeLessThan(61)
    expect(r.leftover).toBeGreaterThan(0)
  })

  it('returns empty sides at or below the bar', () => {
    expect(platesFor(20, 'kg').perSide).toEqual([])
    expect(platesFor(15, 'kg').perSide).toEqual([])
    expect(platesFor(BAR.lb, 'lb').perSide).toEqual([])
  })

  it('works in pounds', () => {
    const r = platesFor(135, 'lb')
    expect(r.bar).toBe(45)
    expect(r.leftover).toBe(0)
    expect(r.total).toBe(135)
    expect(r.perSide).toEqual([{ weight: 45, count: 1 }])
  })

  it('formatPlates joins the stack', () => {
    expect(formatPlates([{ weight: 25, count: 1 }, { weight: 10, count: 2 }], 'kg'))
      .toBe('25 × 1, 10 × 2 kg')
    expect(formatPlates([])).toBe('')
  })
})
