// Plate calculator — how to load a barbell for a target weight.
// Greedy largest-first; leftover is returned when the load cannot be made exactly.

export const BAR = { kg: 20, lb: 45 }
export const PLATES = {
  kg: [25, 20, 15, 10, 5, 2.5, 1.25],
  lb: [45, 35, 25, 10, 5, 2.5]
}

/**
 * @param {number} target
 * @param {'kg'|'lb'} unit
 * @param {{ bar?: number, plates?: number[] }} [opts]
 * @returns {{ bar: number, perSide: { weight: number, count: number }[], leftover: number, total: number }}
 */
export function platesFor(target, unit = 'kg', opts = {}) {
  const u = unit === 'lb' ? 'lb' : 'kg'
  const bar = opts.bar > 0 ? opts.bar : BAR[u]
  const available = (opts.plates && opts.plates.length ? opts.plates : PLATES[u]).slice().sort((a, b) => b - a)
  const goal = Math.max(0, Number(target) || 0)

  if (goal <= bar) {
    return { bar, perSide: [], leftover: Math.max(0, goal - bar), total: bar }
  }

  let remaining = Math.round((goal - bar) * 100) / 100
  // Each plate is paired — load one side, then mirror.
  let side = Math.round((remaining / 2) * 100) / 100
  const counts = new Map()
  for (const p of available) {
    const n = Math.floor((side + 1e-9) / p)
    if (n > 0) {
      counts.set(p, n)
      side = Math.round((side - n * p) * 100) / 100
    }
  }
  const perSide = [...counts.entries()].map(([weight, count]) => ({ weight, count }))
  const loaded = perSide.reduce((s, x) => s + x.weight * x.count * 2, 0)
  const total = Math.round((bar + loaded) * 100) / 100
  const leftover = Math.round((goal - total) * 100) / 100
  return { bar, perSide, leftover: leftover > 0.001 ? leftover : 0, total }
}

/** Human-readable per-side summary, e.g. "25 × 1, 10 × 2". */
export function formatPlates(perSide, unit = 'kg') {
  if (!perSide.length) return ''
  return perSide.map(p => `${p.weight} × ${p.count}`).join(', ') + (unit ? ` ${unit}` : '')
}
