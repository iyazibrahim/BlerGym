<div align="center">

<img src="assets/banner.png" alt="BlerGym" width="720">

<br>

**BlerGym** — self-hosted gym & body-weight tracking, built for how you actually train.

Evidence-based starter plans (dumbbell, machine, or full gym), named gym locations with
machine catalogs, 5/3/1 percentage programming, plate calculator, and an optional AI Coach.
Your data stays on your server. No subscription, no ads, no telemetry.

<br>

[![License: AGPL v3](https://img.shields.io/badge/license-AGPL--3.0-a3e635?style=flat-square)](LICENSE)
![Self-hosted](https://img.shields.io/badge/self--hosted-%F0%9F%8F%A0-60a5fa?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-installable-a78bfa?style=flat-square)
![React](https://img.shields.io/badge/React-19-38bdf8?style=flat-square&logo=react&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Version](https://img.shields.io/badge/version-1.3.0-lime?style=flat-square)
<br>
[![GitHub](https://img.shields.io/badge/github-iyazibrahim%2FBlerGym-181717?style=flat-square&logo=github)](https://github.com/iyazibrahim/BlerGym)

</div>

<br>

> **BlerGym** is based on [openGym](https://github.com/DuarteSantos8/openGym) (and the
> [AI Coach fork](https://github.com/alexpcosta/opengym)). This release adds gym-aware
> planning, science-backed starter templates, notes, plates, and classic 5/3/1 on the
> progression engine.

<br>

<div align="center">
<table>
<tr>
<td align="center"><img src="assets/screenshots/home.png" alt="Home" width="230"><br><sub><b>Home</b> — today's workout & weight</sub></td>
<td align="center"><img src="assets/screenshots/workout.png" alt="Workout" width="230"><br><sub><b>Guided workout</b> — animated demos & sets</sub></td>
<td align="center"><img src="assets/screenshots/stats.png" alt="Stats" width="230"><br><sub><b>Stats</b> — heatmap, charts & PRs</sub></td>
</tr>
</table>
</div>

## What’s new in BlerGym 1.3

- **Evidence-based starters** — 5-day PPLUL, 5-day Upper/Lower, 3-day full body, time-crunched PPL, 5×5, and 5/3/1. Each hypertrophy split comes in **Dumbbell**, **Machine**, and **Gym** kits so major muscles are trained at least twice a week ([why →](docs/STARTER_EVIDENCE.md)).
- **Gyms & machines** — save each place you train, type or paste machine names (brand aliases welcome), switch gyms to filter the library and adapt your plan to that floor.
- **5/3/1 (percentage)** — training max, classic 4-week wave, AMRAP top sets, deload week, TM bump after a successful cycle. Pure math from history — no hidden counters.
- **Per-exercise notes** — cues that show up mid-workout and travel with shared plans.
- **Plate calculator** — tap the weight header during a set for plates per side (kg / lb).
- **AI Coach** (optional, from upstream) — designs and revises plans on your server under your provider account. **[Guide →](docs/AI_COACH.md)**

## Features

- Body-weight tracking with a goal line
- Weekly plan over **1,324 exercises** (searchable, animated demos)
- Reschedule any day without rewriting the week
- Guided workouts — body-weight check-in, last-time weights, rest timer, PRs, screen stays awake
- Supersets, timed holds, cardio (time + speed)
- Progression: linear, Greyskull LP, double progression, time, **5/3/1**
- Estimated 1RM, optional RIR / RPE per set
- Muscle map, activity heatmap, plan share / PDF
- Passkeys (no passwords), multi-device sync, guest mode
- Import FitNotes / Strong / Hevy / Apple Health body weight
- 12 UI languages · light/dark · 8 accents · optional admin dashboard
- Standalone Android APK path (Capacitor) — see [docs/MOBILE.md](docs/MOBILE.md)

## Quick start

You need [Docker](https://docs.docker.com/get-docker/) with Compose.

```bash
git clone https://github.com/iyazibrahim/BlerGym.git
cd BlerGym
cp .env.example .env
docker compose up -d --build
```

Open **http://localhost:8080**, tap **Create profile**, and you’re in. First launch downloads
exercise media (~140 MB) once.

For HTTPS + passkeys from your phone, set `RP_ID` / `ORIGIN` in `.env` — see
**[docs/SELF_HOSTING.md](docs/SELF_HOSTING.md)**.

| Variable | What it is | Default |
| --- | --- | --- |
| `RP_ID` | Hostname passkeys are bound to | `localhost` |
| `ORIGIN` | Full URL the app is served from | `http://localhost:8080` |
| `WEB_PORT` | Host port for the web UI | `8080` |
| `RP_NAME` | Name in the passkey prompt | `BlerGym` |
| `ADMIN_UIDS` | User ids with admin dashboard | *(none)* |
| `INVITE_ONLY` | Require invite codes | *(off)* |
| `COACH_DISABLED` | Force AI Coach off | *(unset)* |

## How it works

```
┌─────────────┐        ┌──────────────────────────────┐
│  Your phone │──HTTPS─▶│  web  (nginx)                │
│  / laptop   │        │   ├─ serves the built app    │
└─────────────┘        │   └─ proxies /api ──────────┐│
                       └──────────────────────────────┘│
                                                        ▼
                                        ┌──────────────────────────┐
                                        │  api  (Node + WebAuthn)  │
                                        │   └─ ./data (JSON files) │
                                        └──────────────────────────┘
```

- **frontend/** — React 19 + Vite (React Router, Zustand)
- **api/** — Node, JSON files under `./data`
- **web/** — builds the frontend and serves it with nginx (one origin for passkeys)

**Back up `./data` and you’ve backed up everything.**

## Docs (user-facing)

| Doc | Contents |
| --- | --- |
| [docs/SELF_HOSTING.md](docs/SELF_HOSTING.md) | Deploy, HTTPS, reverse proxy, Coach |
| [docs/AI_COACH.md](docs/AI_COACH.md) | Optional AI Coach |
| [docs/MOBILE.md](docs/MOBILE.md) | Capacitor Android / iOS |
| [docs/STARTER_EVIDENCE.md](docs/STARTER_EVIDENCE.md) | Why the starter splits look the way they do |
| [Claude-setup-instructions.md](Claude-setup-instructions.md) / [ChatGPT-setup-instructions.md](ChatGPT-setup-instructions.md) | Coach provider sign-in |

## Credits & license

BlerGym builds on [DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym) and
[alexpcosta/opengym](https://github.com/alexpcosta/opengym) (AI Coach). Exercise media from
[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) — see [NOTICE.md](NOTICE.md).

[GNU AGPL v3.0](LICENSE) — free to self-host, use, modify and share; network use of a modified
version requires offering that source under the same license.
