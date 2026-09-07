// Gym locations: named places with an equipment kit and/or a machine catalog. Switching the
// active gym filters the library and can swap planned exercises onto whatever is on that floor.
import { EXIDX, allExercises } from './exercises.js'
import { KIT_EQ } from './starter.js'
import { buildStarter } from './starter.js'
import { uid } from './format.js'

export const emptyGym = (name = '', kit = 'gym') => ({
  id: uid(),
  name: name || 'Gym',
  kit,
  machines: []   // [{ raw, exId }]
})

export const activeGym = S => {
  if (!S?.activeGymId) return null
  return (S.gyms || []).find(g => g.id === S.activeGymId) || null
}

/** Equipment tags implied by a gym (kit shortcut when no machines listed yet). */
export function gymEquipment(gym) {
  if (!gym) return null
  if (gym.machines?.length) {
    const eqs = new Set()
    gym.machines.forEach(m => {
      const ex = EXIDX[m.exId]
      if (ex?.eq) eqs.add(ex.eq)
    })
    return [...eqs]
  }
  return KIT_EQ[gym.kit] || KIT_EQ.gym
}

/** Exercise ids available at a gym. null = whole library. */
export function gymExerciseIds(gym) {
  if (!gym) return null
  if (gym.machines?.length) return new Set(gym.machines.map(m => m.exId).filter(id => EXIDX[id] || id))
  const allowed = new Set(KIT_EQ[gym.kit] || KIT_EQ.gym)
  return new Set(Object.keys(EXIDX).filter(id => allowed.has(EXIDX[id]?.eq)))
}

/** Filter the searchable catalogue for the active gym. */
export function exercisesForGym(S) {
  const gym = activeGym(S)
  const all = allExercises(S)
  if (!gym) return all
  const ids = gymExerciseIds(gym)
  if (!ids) return all
  // Always keep customs the user made — they may be that gym's odd machine.
  return all.filter(e => e.custom || ids.has(e.id))
}

/**
 * Swap a planned exercise onto something available at `gym`, preferring same target muscle,
 * then same body part. Returns a new exercise config or the original if nothing fits.
 */
export function swapForGym(cfg, gym) {
  if (!gym || !cfg?.id) return { cfg, swapped: false }
  const ids = gymExerciseIds(gym)
  if (!ids || ids.has(cfg.id)) return { cfg, swapped: false }
  const src = EXIDX[cfg.id]
  if (!src) return { cfg, swapped: false }

  const candidates = [...ids].map(id => EXIDX[id]).filter(Boolean)
  const sameTg = candidates.filter(e => e.tg && e.tg === src.tg)
  const sameBp = candidates.filter(e => e.bp === src.bp)
  const pick = sameTg[0] || sameBp[0]
  if (!pick) return { cfg, swapped: false, missing: true }
  const { id: _drop, ...rest } = cfg
  return { cfg: { ...rest, id: pick.id }, swapped: true, from: cfg.id, to: pick.id }
}

/**
 * Adapt every routine exercise to the gym. Mutates a draft state `s` (call inside store.update).
 * Returns { swapped, missing } counts for the toast.
 */
export function adaptPlanToGym(s, gym) {
  let swapped = 0, missing = 0
  ;(s.routines || []).forEach(r => {
    r.ex = (r.ex || []).map(cfg => {
      const out = swapForGym(cfg, gym)
      if (out.swapped) swapped++
      if (out.missing) missing++
      return out.cfg
    })
  })
  return { swapped, missing }
}

/**
 * Build a starter plan restricted to exercises available at the gym.
 * Uses the evidence-based templates; when a template lift is missing, swapForGym fills it.
 */
export function buildPlanForGym(planId, gym) {
  const kit = gym?.kit && ['dumbbell', 'machine', 'gym'].includes(gym.kit) ? gym.kit : 'gym'
  // five5 / percent templates are gym-kit only
  let id = planId
  try {
    const built = buildStarter(id, kit)
    if (!gym?.machines?.length) return built
    const routines = built.routines.map(r => ({
      ...r,
      ex: r.ex.map(cfg => {
        const out = swapForGym(cfg, gym)
        return out.cfg
      })
    }))
    return { ...built, routines }
  } catch {
    const built = buildStarter('pplul', kit === 'dumbbell' || kit === 'machine' ? kit : 'gym')
    return built
  }
}
