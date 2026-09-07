import { describe, it, expect } from 'vitest'
import { matchMachine, matchMachineList, parseMachineList } from './machines.js'
import { EXIDX } from './exercises.js'
import {
  emptyGym, gymExerciseIds, swapForGym, adaptPlanToGym, buildPlanForGym, exercisesForGym
} from './gyms.js'

describe('matchMachine', () => {
  it('resolves commercial aliases to library ids', () => {
    expect(matchMachine('Life Fitness chest press').exId).toBe('0577')
    expect(matchMachine('lat pulldown').exId).toBe('2330')
    expect(matchMachine('Hammer Strength row').exId).toBe('1350')
    expect(matchMachine('leg press').exId).toBe('0739')
    expect(EXIDX[matchMachine('smith squat').exId].n.toLowerCase()).toContain('squat')
  })

  it('returns null for nonsense', () => {
    expect(matchMachine('')).toBeNull()
    expect(matchMachine('xyzzy purple unicorn press')).toBeNull()
  })
})

describe('matchMachineList', () => {
  it('parses lines and reports unmatched', () => {
    expect(parseMachineList('a\nb\n\n  c  ').length).toBe(3)
    const { matched, unmatched } = matchMachineList('chest press\nnot a real machine 999\nleg curl')
    expect(matched.map(m => m.exId)).toContain('0577')
    expect(matched.map(m => m.exId)).toContain('0586')
    expect(unmatched.some(u => /not a real/i.test(u))).toBe(true)
  })
})

describe('gym adaptation', () => {
  it('machine-only gym swaps a barbell squat onto a machine pattern', () => {
    const gym = emptyGym('Hotel gym', 'machine')
    gym.machines = [
      { raw: 'hack squat', exId: '0743' },
      { raw: 'chest press', exId: '0577' },
      { raw: 'lat pulldown', exId: '2330' },
      { raw: 'leg curl', exId: '0586' },
      { raw: 'leg extension', exId: '0585' },
      { raw: 'seated row', exId: '1350' },
      { raw: 'shoulder press', exId: '0603' },
      { raw: 'calf raise', exId: '0605' }
    ]
    const ids = gymExerciseIds(gym)
    expect(ids.has('0043')).toBe(false)
    expect(ids.has('0743')).toBe(true)

    const out = swapForGym({ id: '0043', sets: 4, reps: 8, weight: 0, note: 'depth' }, gym)
    expect(out.swapped).toBe(true)
    expect(out.cfg.id).not.toBe('0043')
    expect(ids.has(out.cfg.id)).toBe(true)
    expect(out.cfg.sets).toBe(4)
    expect(out.cfg.note).toBe('depth')
  })

  it('adaptPlanToGym rewrites routines in place', () => {
    const gym = emptyGym('Machines', 'machine')
    gym.machines = [
      { raw: 'chest press', exId: '0577' },
      { raw: 'leg press', exId: '0739' }
    ]
    const s = {
      routines: [{ id: 'r1', name: 'Day', ex: [{ id: '0025', sets: 3, reps: 8 }, { id: '0043', sets: 3, reps: 8 }] }]
    }
    const { swapped } = adaptPlanToGym(s, gym)
    expect(swapped).toBeGreaterThan(0)
    expect(s.routines[0].ex.every(e => gymExerciseIds(gym).has(e.id))).toBe(true)
  })

  it('buildPlanForGym returns routines for a kit', () => {
    const gym = emptyGym('Home', 'dumbbell')
    const { routines, week } = buildPlanForGym('pplul', gym)
    expect(routines.length).toBe(5)
    expect(Object.keys(week).length).toBe(5)
  })

  it('exercisesForGym filters the catalogue', () => {
    const gym = emptyGym('X', 'dumbbell')
    gym.id = 'g1'
    const S = { gyms: [gym], activeGymId: 'g1', customEx: [] }
    const list = exercisesForGym(S)
    expect(list.every(e => e.eq === 'dumbbell' || e.eq === 'body weight' || e.custom)).toBe(true)
  })
})
