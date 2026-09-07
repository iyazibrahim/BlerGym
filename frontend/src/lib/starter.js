// Evidence-based starter plans. Each hypertrophy template ships in three equipment kits
// (dumbbell / machine / gym) so the same week structure works at home, on a machine floor,
// or in a full gym. Frequencies follow ACSM 2026 (≥2×/week per major muscle) and Schoenfeld
// 2016; see docs/STARTER_EVIDENCE.md. The classic 3-day PPL is kept as a time-crunched option
// because the demo history is built on top of exactly those three routines.
import { uid } from './format.js'

// Equipment tags allowed under each kit. Must match the library `eq` field.
export const KIT_EQ = {
  dumbbell: ['dumbbell', 'body weight'],
  machine: ['leverage machine', 'smith machine', 'cable', 'assisted', 'sled machine'],
  gym: ['barbell', 'ez barbell', 'dumbbell', 'cable', 'leverage machine', 'smith machine', 'trap bar', 'body weight', 'sled machine']
}

export const KIT_NAME = {
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  gym: 'Gym'
}

export const KIT_DESC = {
  dumbbell: 'Dumbbells and bodyweight — home, hotel, or a small kit.',
  machine: 'Cables, levers, Smith and assisted machines — no free barbell needed.',
  gym: 'Barbell, dumbbells, cables and machines — a full gym floor.'
}

// One exercise: [id, sets, reps] or [id, sets, reps, { prog, tm, … }].
const ex = (id, sets, reps, extra) => ({ id, sets, reps, weight: 0, ...(extra || {}) })
const list = rows => rows.map(r => (Array.isArray(r) ? ex(...r) : r))

// --- Gym kit (barbell-first) -----------------------------------------------------------
const GYM = {
  push: ['Push', 'barbell', [
    ['0025', 4, 8], ['0047', 3, 10], ['0426', 3, 10], ['0334', 3, 12], ['0241', 3, 12], ['0251', 3, 10]
  ]],
  pull: ['Pull', 'pullup', [
    ['2330', 4, 10], ['0027', 4, 8], ['1323', 3, 10], ['0031', 3, 10], ['0313', 3, 12]
  ]],
  legs: ['Legs', 'legs', [
    ['0043', 4, 8], ['0085', 3, 10], ['0739', 3, 12], ['0585', 3, 12], ['0586', 3, 12], ['0605', 4, 15]
  ]],
  upper: ['Upper', 'barbell', [
    ['0025', 3, 8], ['0027', 3, 8], ['0091', 3, 8], ['2330', 3, 10], ['0334', 3, 12], ['0241', 3, 12]
  ]],
  lower: ['Lower', 'legs', [
    ['0043', 3, 8], ['0032', 3, 5], ['0085', 3, 10], ['0585', 3, 12], ['0586', 3, 12], ['0605', 3, 15]
  ]],
  upperA: ['Upper A', 'barbell', [
    ['0025', 4, 8], ['0027', 4, 8], ['0091', 3, 8], ['2330', 3, 10], ['0334', 3, 12], ['0241', 3, 12]
  ]],
  lowerA: ['Lower A', 'legs', [
    ['0043', 4, 8], ['0085', 3, 10], ['0585', 3, 12], ['0586', 3, 12], ['0605', 3, 15]
  ]],
  upperB: ['Upper B', 'barbell', [
    ['0047', 4, 8], ['1323', 4, 8], ['0426', 3, 10], ['2330', 3, 10], ['0313', 3, 12], ['0251', 3, 10]
  ]],
  lowerB: ['Lower B', 'legs', [
    ['0032', 3, 5], ['0739', 3, 10], ['0085', 3, 10], ['0585', 3, 12], ['0605', 3, 15]
  ]],
  upperC: ['Upper C', 'barbell', [
    ['0025', 3, 8], ['0027', 3, 8], ['0091', 3, 8], ['0334', 3, 12], ['0031', 3, 12]
  ]],
  fullA: ['Full body A', 'barbell', [
    ['0043', 3, 8], ['0025', 3, 8], ['0027', 3, 8], ['0091', 3, 10], ['0586', 3, 12]
  ]],
  fullB: ['Full body B', 'barbell', [
    ['0032', 3, 5], ['0047', 3, 8], ['2330', 3, 10], ['0426', 3, 10], ['0585', 3, 12]
  ]],
  fullC: ['Full body C', 'barbell', [
    ['0085', 3, 10], ['0025', 3, 8], ['1323', 3, 10], ['0334', 3, 12], ['0605', 3, 15]
  ]],
  fiveA: ['5×5 A', 'barbell', [
    ['0043', 5, 5, { prog: 'linear' }], ['0025', 5, 5, { prog: 'linear' }], ['0027', 5, 5, { prog: 'linear' }]
  ]],
  fiveB: ['5×5 B', 'barbell', [
    ['0043', 5, 5, { prog: 'linear' }], ['0091', 5, 5, { prog: 'linear' }], ['0032', 1, 5, { prog: 'linear' }]
  ]],
  // 5/3/1 — one main lift per day; TM left unset so the first session asks for it.
  s531Squat: ['Squat day', 'legs', [
    ['0043', 3, 5, { prog: 'percent' }], ['0085', 3, 10], ['0585', 3, 12], ['0605', 3, 15]
  ]],
  s531Bench: ['Bench day', 'barbell', [
    ['0025', 3, 5, { prog: 'percent' }], ['0047', 3, 10], ['0334', 3, 12], ['0241', 3, 12]
  ]],
  s531Dead: ['Deadlift day', 'pullup', [
    ['0032', 3, 5, { prog: 'percent' }], ['2330', 3, 10], ['0027', 3, 8], ['0313', 3, 12]
  ]],
  s531Press: ['Press day', 'barbell', [
    ['0091', 3, 5, { prog: 'percent' }], ['0426', 3, 10], ['1323', 3, 10], ['0251', 3, 10]
  ]]
}

// --- Dumbbell kit ----------------------------------------------------------------------
const DB = {
  push: ['Push', 'dumbbell', [
    ['0289', 4, 8], ['0314', 3, 10], ['0426', 3, 10], ['0334', 3, 12], ['0333', 3, 12], ['0259', 3, 12]
  ]],
  pull: ['Pull', 'dumbbell', [
    ['0293', 4, 10], ['0292', 3, 10], ['0406', 3, 12], ['0294', 3, 10], ['0313', 3, 12]
  ]],
  legs: ['Legs', 'legs', [
    ['1760', 4, 10], ['1459', 3, 10], ['0336', 3, 10], ['0431', 3, 12], ['0400', 3, 15], ['0443', 3, 15]
  ]],
  upper: ['Upper', 'dumbbell', [
    ['0289', 3, 8], ['0293', 3, 8], ['0426', 3, 10], ['0334', 3, 12], ['0333', 3, 12], ['0294', 3, 12]
  ]],
  lower: ['Lower', 'legs', [
    ['1760', 3, 10], ['1459', 3, 10], ['0336', 3, 10], ['0431', 3, 12], ['0400', 3, 15]
  ]],
  upperA: ['Upper A', 'dumbbell', [
    ['0289', 4, 8], ['0293', 4, 8], ['0426', 3, 10], ['0334', 3, 12], ['0333', 3, 12]
  ]],
  lowerA: ['Lower A', 'legs', [
    ['1760', 4, 10], ['1459', 3, 10], ['0336', 3, 12], ['0400', 3, 15]
  ]],
  upperB: ['Upper B', 'dumbbell', [
    ['0314', 4, 8], ['0292', 4, 10], ['0414', 3, 10], ['0308', 3, 12], ['0313', 3, 12]
  ]],
  lowerB: ['Lower B', 'legs', [
    ['0300', 3, 8], ['0431', 3, 12], ['1459', 3, 10], ['0400', 3, 15]
  ]],
  upperC: ['Upper C', 'dumbbell', [
    ['0289', 3, 8], ['0293', 3, 8], ['0426', 3, 10], ['0334', 3, 12], ['0294', 3, 12]
  ]],
  fullA: ['Full body A', 'dumbbell', [
    ['1760', 3, 10], ['0289', 3, 8], ['0293', 3, 10], ['0426', 3, 10], ['0443', 3, 15]
  ]],
  fullB: ['Full body B', 'dumbbell', [
    ['1459', 3, 10], ['0314', 3, 10], ['0292', 3, 10], ['0334', 3, 12], ['0336', 3, 12]
  ]],
  fullC: ['Full body C', 'dumbbell', [
    ['0336', 3, 10], ['0289', 3, 8], ['0293', 3, 10], ['0333', 3, 12], ['0400', 3, 15]
  ]]
}

// --- Machine kit -----------------------------------------------------------------------
const MACH = {
  push: ['Push', 'barbell', [
    ['0577', 4, 8], ['0748', 3, 10], ['0603', 3, 10], ['0584', 3, 12], ['0019', 3, 12]
  ]],
  pull: ['Pull', 'pullup', [
    ['0673', 4, 10], ['0017', 3, 8], ['1350', 3, 10], ['0861', 3, 10], ['0868', 3, 12]
  ]],
  legs: ['Legs', 'legs', [
    ['0743', 4, 10], ['0739', 3, 10], ['0585', 3, 12], ['0586', 3, 12], ['0605', 4, 15]
  ]],
  upper: ['Upper', 'barbell', [
    ['0577', 3, 8], ['1350', 3, 8], ['0603', 3, 10], ['0673', 3, 10], ['0584', 3, 12], ['0019', 3, 12]
  ]],
  lower: ['Lower', 'legs', [
    ['0755', 3, 10], ['0752', 3, 6], ['0585', 3, 12], ['0586', 3, 12], ['0605', 3, 15]
  ]],
  upperA: ['Upper A', 'barbell', [
    ['0577', 4, 8], ['1350', 4, 8], ['0603', 3, 10], ['0673', 3, 10], ['0019', 3, 12]
  ]],
  lowerA: ['Lower A', 'legs', [
    ['0743', 4, 10], ['0585', 3, 12], ['0586', 3, 12], ['0605', 3, 15]
  ]],
  upperB: ['Upper B', 'barbell', [
    ['0748', 4, 8], ['0861', 4, 10], ['0219', 3, 10], ['0017', 3, 8], ['0178', 3, 12]
  ]],
  lowerB: ['Lower B', 'legs', [
    ['0739', 3, 10], ['0752', 3, 6], ['0586', 3, 12], ['0605', 3, 15]
  ]],
  upperC: ['Upper C', 'barbell', [
    ['0577', 3, 8], ['1350', 3, 8], ['0603', 3, 10], ['0584', 3, 12], ['0868', 3, 12]
  ]],
  fullA: ['Full body A', 'barbell', [
    ['0743', 3, 10], ['0577', 3, 8], ['1350', 3, 10], ['0603', 3, 10], ['0586', 3, 12]
  ]],
  fullB: ['Full body B', 'barbell', [
    ['0739', 3, 10], ['0748', 3, 8], ['0673', 3, 10], ['0219', 3, 10], ['0585', 3, 12]
  ]],
  fullC: ['Full body C', 'barbell', [
    ['0752', 3, 6], ['0577', 3, 8], ['0861', 3, 10], ['0584', 3, 12], ['0605', 3, 15]
  ]]
}

const byKit = { gym: GYM, dumbbell: DB, machine: MACH }

function buildRoutine([name, emoji, rows], prog) {
  const r = { id: uid(), name, emoji, ex: list(rows) }
  if (prog) r.prog = prog
  return r
}

function materialise(plan, kit) {
  const table = byKit[kit]
  if (!table) throw new Error('unknown kit: ' + kit)
  const routines = plan.routineKeys.map(key => {
    const spec = table[key]
    if (!spec) throw new Error(`plan ${plan.id} / kit ${kit} missing routine ${key}`)
    return buildRoutine(spec, plan.prog)
  })
  const week = {}
  Object.entries(plan.days).forEach(([day, ri]) => { week[Number(day)] = routines[ri].id })
  return { routines, week, toast: plan.toast }
}

/** Plan catalogue shown in the picker. `kits` lists which equipment variants exist. */
export const STARTER_PLANS = [
  {
    id: 'pplul',
    name: '5-day Push / Pull / Legs',
    subtitle: 'Push · Pull · Legs · Upper · Lower — each muscle twice a week',
    badge: 'Recommended',
    kits: ['dumbbell', 'machine', 'gym'],
    days: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 },
    routineKeys: ['push', 'pull', 'legs', 'upper', 'lower'],
    toast: '5-day plan loaded — Mon–Fri PPL + Upper + Lower'
  },
  {
    id: 'ul5',
    name: '5-day Upper / Lower',
    subtitle: 'Upper · Lower · Upper · Lower · Upper',
    kits: ['dumbbell', 'machine', 'gym'],
    days: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 },
    routineKeys: ['upperA', 'lowerA', 'upperB', 'lowerB', 'upperC'],
    toast: 'Upper/Lower plan loaded — five days'
  },
  {
    id: 'fb3',
    name: '3-day Full body',
    subtitle: 'Mon · Wed · Fri — three different full-body sessions',
    kits: ['dumbbell', 'machine', 'gym'],
    days: { 1: 0, 3: 1, 5: 2 },
    routineKeys: ['fullA', 'fullB', 'fullC'],
    toast: 'Full-body plan loaded — Mon / Wed / Fri'
  },
  {
    id: 'ppl3',
    name: '3-day Push / Pull / Legs',
    subtitle: 'Time-crunched — each muscle once a week',
    badge: 'Time-crunched',
    kits: ['dumbbell', 'machine', 'gym'],
    days: { 1: 0, 3: 1, 5: 2 },
    routineKeys: ['push', 'pull', 'legs'],
    toast: 'Starter plan loaded — Mon Push · Wed Pull · Fri Legs'
  },
  {
    id: 'five5',
    name: '5×5',
    subtitle: 'Novice barbell strength — A/B, linear jumps',
    kits: ['gym'],
    prog: 'linear',
    days: { 1: 0, 3: 1, 5: 0 },
    routineKeys: ['fiveA', 'fiveB'],
    toast: '5×5 plan loaded — Mon A · Wed B · Fri A'
  },
  {
    id: 'f531',
    name: '5/3/1',
    subtitle: 'Four main-lift days — percentage wave off a training max',
    kits: ['gym'],
    days: { 1: 0, 2: 1, 4: 2, 5: 3 },
    routineKeys: ['s531Squat', 's531Bench', 's531Dead', 's531Press'],
    toast: '5/3/1 plan loaded — set a training max on each main lift'
  }
]

export function planById(id) {
  return STARTER_PLANS.find(p => p.id === id) || null
}

/** Build fresh routines + week for one plan/kit. Demo still uses starterRoutines(). */
export function buildStarter(planId, kit = 'gym') {
  const plan = planById(planId)
  if (!plan) throw new Error('unknown plan: ' + planId)
  if (!plan.kits.includes(kit)) throw new Error(`kit ${kit} not available for ${planId}`)
  return materialise(plan, kit)
}

/**
 * The classic 3-day PPL (gym kit). Kept for the demo seed and any caller that still expects
 * exactly [push, pull, legs] — those three routine names are part of the demo's contract.
 */
export const starterRoutines = () => {
  const { routines } = buildStarter('ppl3', 'gym')
  return routines
}

/** Every exercise id used by a plan/kit, for tests and gym adaptation. */
export function exerciseIdsOf(planId, kit) {
  const { routines } = buildStarter(planId, kit)
  return [...new Set(routines.flatMap(r => r.ex.map(e => e.id)))]
}
