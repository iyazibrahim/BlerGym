# Why the starter plans look the way they do

openGym's starter catalogue is built to match published resistance-training
guidance, not forum folklore. This note is the audit trail.

## What the evidence says

1. **ACSM Position Stand, 2026** — *Resistance Training Prescription for Muscle
   Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview
   of Reviews* (Medicine & Science in Sports & Exercise; overview of 137 systematic
   reviews). Primary recommendation: healthy adults should train **all major
   muscle groups at least twice per week**, with high effort. For hypertrophy, aim
   around **~10 weekly sets per muscle**. Machines, free weights, bands and
   bodyweight all work; consistency beats a "perfect" split.
   - [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/)
   - [ACSM summary](https://acsm.org/resistance-training-guidelines-update-2026/)

2. **Schoenfeld et al., 2016** — *Effects of Resistance Training Frequency on
   Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis*
   (*Sports Medicine*). On a volume-equated basis, training a muscle **≥2×/week**
   produces greater hypertrophy than **1×/week**.

## How that maps onto the catalogue

| Plan | Days | Muscle frequency | Role |
| --- | --- | --- | --- |
| **5-day Push / Pull / Legs** (PPLUL) | Push · Pull · Legs · Upper · Lower | ~2×/week each | Default 5-day hypertrophy path |
| **5-day Upper / Lower** | U · L · U · L · U | Upper 3×, lower 2× | Alternative 5-day path |
| **3-day Full body** | A · B · C | ~3×/week | Best fit when only three days are available |
| **3-day Push / Pull / Legs** | P · P · L | 1×/week | Kept as a **time-crunched** option (and for the demo seed) |
| **5×5** | A · B · A | Novice strength | Gym-kit only; linear jumps |
| **5/3/1** | four main-lift days | Percentage wave | Gym-kit only; see progression engine |

Session templates use roughly **4–6 working exercises** and **3–4 sets** on
compounds so major muscles land near **8–12 weekly sets** across their two hits.

## What we deliberately rejected

- Classic 3-day PPL as the *only* starter (each muscle once a week).
- Body-part "chest Monday" splits.
- A 5-day calendar that is just Push / Pull / Legs / Push / Pull (legs still once
  a week).

## Equipment kits

Each hypertrophy split ships three times:

- **Dumbbell** — `dumbbell` + `body weight`
- **Machine** — `leverage machine`, `smith machine`, `cable`, `assisted`, `sled machine`
- **Gym** — barbell, ez barbell, dumbbell, cable, machines, trap bar, body weight

Same days, sets and muscle roles; only the movement changes (barbell squat →
goblet squat → lever / sled hack squat). That matches ACSM's finding that many
forms of resistance training work when effort and weekly volume are in place.
