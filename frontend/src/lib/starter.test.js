import { describe, it, expect } from 'vitest'
import { EXIDX } from './exercises.js'
import {
  STARTER_PLANS, KIT_EQ, buildStarter, starterRoutines, exerciseIdsOf, planById
} from './starter.js'

const MAIN_BPS = ['chest', 'back', 'upper legs', 'shoulders']

describe('starter plans', () => {
  it('exposes the expected catalogue', () => {
    expect(STARTER_PLANS.map(p => p.id)).toEqual(['pplul', 'ul5', 'fb3', 'ppl3', 'five5', 'f531'])
  })

  it('keeps starterRoutines as a fresh 3-day PPL for the demo', () => {
    const a = starterRoutines()
    const b = starterRoutines()
    expect(a.map(r => r.name)).toEqual(['Push', 'Pull', 'Legs'])
    expect(a.map(r => r.id)).not.toEqual(b.map(r => r.id))
  })

  for (const plan of STARTER_PLANS) {
    for (const kit of plan.kits) {
      it(`${plan.id} / ${kit}: every exercise exists and matches the kit`, () => {
        const { routines, week } = buildStarter(plan.id, kit)
        expect(routines.length).toBe(plan.routineKeys.length)
        const allowed = new Set(KIT_EQ[kit])
        routines.forEach(r => {
          expect(r.ex.length).toBeGreaterThanOrEqual(3)
          r.ex.forEach(e => {
            const ex = EXIDX[e.id]
            expect(ex, `missing ${e.id}`).toBeTruthy()
            expect(allowed.has(ex.eq), `${ex.n} has eq=${ex.eq}`).toBe(true)
            expect(e.sets).toBeGreaterThan(0)
            expect(e.reps).toBeGreaterThan(0)
          })
        })
        Object.values(week).forEach(id => expect(routines.some(r => r.id === id)).toBe(true))
      })
    }
  }

  it('PPLUL and UL5 hit major body parts on at least two weekdays', () => {
    for (const planId of ['pplul', 'ul5']) {
      const { routines, week } = buildStarter(planId, 'gym')
      const byBp = {}
      Object.entries(week).forEach(([day, rid]) => {
        const r = routines.find(x => x.id === rid)
        r.ex.forEach(e => {
          const bp = EXIDX[e.id].bp
          ;(byBp[bp] ||= new Set()).add(Number(day))
        })
      })
      MAIN_BPS.forEach(bp => {
        expect((byBp[bp] || new Set()).size, `${planId} ${bp}`).toBeGreaterThanOrEqual(2)
      })
    }
  })

  it('5×5 and 5/3/1 are gym-only', () => {
    expect(planById('five5').kits).toEqual(['gym'])
    expect(planById('f531').kits).toEqual(['gym'])
    const { routines } = buildStarter('five5', 'gym')
    expect(routines.every(r => r.prog === 'linear')).toBe(true)
    expect(() => buildStarter('five5', 'dumbbell')).toThrow()
    const f531 = buildStarter('f531', 'gym')
    expect(f531.routines.length).toBe(4)
    expect(f531.routines.some(r => r.ex.some(e => e.prog === 'percent'))).toBe(true)
  })

  it('exerciseIdsOf returns unique library ids', () => {
    const ids = exerciseIdsOf('pplul', 'dumbbell')
    expect(ids.length).toBeGreaterThan(10)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
