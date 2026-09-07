// Match gym-floor machine names to the exercise library. Commercial brands (Life Fitness,
// Hammer Strength, Technogym…) label the same movement differently; this table + the fuzzy
// matcher from import-csv let a typed or pasted name land on a real EXDB id.
import { EXDB, EXIDX } from './exercises.js'

// Brand / colloquial aliases → preferred library id. Prefer common commercial names people
// actually read on a plate, not every synonym in the dataset.
export const MACHINE_ALIASES = {
  'pec deck': '0577',
  'pec fly': '0577',
  'chest press': '0577',
  'life fitness chest press': '0577',
  'hammer strength chest press': '0577',
  'technogym chest press': '0577',
  'incline chest press': '0748',
  'lat pulldown': '2330',
  'lat pull down': '2330',
  'lat pull-down': '2330',
  'life fitness lat pulldown': '2330',
  'assisted pull up': '0017',
  'assisted pull-up': '0017',
  'pull up assist': '0017',
  'seated row': '1350',
  'cable row': '0861',
  'low row': '0861',
  'hammer strength row': '1350',
  'leg press': '0739',
  '45 degree leg press': '0739',
  'hack squat': '0743',
  'smith hack squat': '0755',
  'leg extension': '0585',
  'leg curl': '0586',
  'lying leg curl': '0586',
  'seated leg curl': '0582',
  'calf raise': '0605',
  'standing calf': '0605',
  'shoulder press': '0603',
  'overhead press machine': '0603',
  'military press machine': '0603',
  'lateral raise machine': '0584',
  'cable lateral raise': '0178',
  'tricep pushdown': '0241',
  'triceps pushdown': '0241',
  'cable curl': '0868',
  'smith bench': '0748',
  'smith squat': '0770',
  'smith deadlift': '0752',
  'trap bar deadlift': '0811',
  'hex bar deadlift': '0811',
  'cable face pull': '1323',
  'face pull': '1323',
  'cable fly': '2144',
  'abductor': '0585',
  'adductor': '0585'
}

const FILLER = new Set(['the', 'a', 'an', 'with', 'and', 'machine', 'apparatus', 'station', 'selectorized', 'plate', 'loaded'])
const BRANDS = /\b(life fitness|hammer strength|technogym|cybex|nautilus|precor|matrix|hoist|panatta|freemotion|body solid|gym80|prime)\b/gi

function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .replace(BRANDS, ' ')
    .replace(/[()[\],./_-]+/g, ' ')
    .replace(/[^a-z0-9° ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function wordsOf(name) {
  return normalize(name).split(' ').filter(w => w && !FILLER.has(w))
}

let INDEX = null
function buildIndex() {
  if (INDEX) return INDEX
  INDEX = { exact: new Map(), all: [] }
  EXDB.forEach(e => {
    const w = wordsOf(e.n)
    const k = w.slice().sort().join(' ')
    if (!INDEX.exact.has(k)) INDEX.exact.set(k, e.id)
    INDEX.all.push({ id: e.id, set: new Set(w), n: w.length, name: e.n })
  })
  Object.entries(MACHINE_ALIASES).forEach(([alias, id]) => {
    const k = wordsOf(alias).sort().join(' ')
    if (k) INDEX.exact.set(k, id)
  })
  return INDEX
}

/**
 * Resolve a typed / pasted machine name to a library exercise id.
 * Returns { exId, score, name } or null when nothing is close enough.
 */
export function matchMachine(raw) {
  const text = String(raw || '').trim()
  if (!text) return null
  const aliasKey = normalize(text)
  if (MACHINE_ALIASES[aliasKey] && EXIDX[MACHINE_ALIASES[aliasKey]]) {
    const id = MACHINE_ALIASES[aliasKey]
    return { exId: id, score: 1, name: EXIDX[id].n }
  }
  const idx = buildIndex()
  const w = wordsOf(text)
  if (!w.length) return null
  const exact = idx.exact.get(w.slice().sort().join(' '))
  if (exact && EXIDX[exact]) return { exId: exact, score: 1, name: EXIDX[exact].n }

  // Jaccard against library names; require a useful overlap so "leg" alone does not match
  // every leg exercise.
  let best = null
  const set = new Set(w)
  idx.all.forEach(e => {
    let inter = 0
    set.forEach(x => { if (e.set.has(x)) inter++ })
    if (!inter) return
    const score = inter / (set.size + e.n - inter)
    if (!best || score > best.score) best = { exId: e.id, score, name: e.name }
  })
  if (!best || best.score < 0.45) return null
  return best
}

/** Split a pasted block into non-empty lines. */
export function parseMachineList(text) {
  return String(text || '')
    .split(/\r?\n|;/)
    .map(s => s.replace(/^[\s*\-•\d.)]+/, '').trim())
    .filter(Boolean)
}

/**
 * Match every line. Returns { matched: [{ raw, exId, name }], unmatched: [raw] }.
 * Duplicate exIds keep the first line.
 */
export function matchMachineList(text) {
  const seen = new Set()
  const matched = []
  const unmatched = []
  parseMachineList(text).forEach(raw => {
    const hit = matchMachine(raw)
    if (!hit) { unmatched.push(raw); return }
    if (seen.has(hit.exId)) return
    seen.add(hit.exId)
    matched.push({ raw, exId: hit.exId, name: hit.name })
  })
  return { matched, unmatched }
}
