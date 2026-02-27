# Live Build: F1 Race Pace Explorer

Build a tool to compare how two F1 drivers performed across a race. Pick two drivers, see who was faster, where, and why.

~35 minutes. Use any AI tools you want. Completing Tier 1 is success.

## Getting Started

Run `npm install && npm run dev`. The app is at [localhost:5173](http://localhost:5173). All data is pre-loaded as static JSON in `public/data/` — no backend needed, just `fetch("/data/drivers.json")` etc. Check `src/api/data.ts` for examples and `src/types.ts` for TypeScript interfaces.

---

## Requirements

### Tier 1: MVP (This is "done")

1. **Driver Selection** — Two dropdowns to pick Driver A and Driver B (show name + car number)
2. **Lap Time Comparison** — Table showing: lap number, Driver A time, Driver B time, delta. Times formatted readably (not raw seconds). Delta shows who was faster.

### Tier 2: Better (If you have time)

3. **Pit Stop & Stint Integration** — Show where each driver pitted (which lap, how long), tire compound per stint, average lap time per stint (excluding pit-in/pit-out laps)
4. **Handle Outliers** — Identify unusually slow laps (safety car, pit laps). Don't let them skew averages.

### Tier 3: Exceptional (Bonus)

5. **Tell the Story** — Who was faster overall? By how much? Trends over the race? Make it something a non-technical person could glance at and understand.

---

## The Data

Real data from the **2024 United States Grand Prix** (56 laps, 20 drivers, 10 teams).

| File | What's In It | Records |
|------|-------------|---------|
| `data/race.json` | Race metadata (name, date, circuit, total laps) | 1 |
| `data/drivers.json` | All 20 drivers (name, team, car number, team color) | 20 |
| `data/laps.json` | Every lap for every driver (lap time, sectors, pit-out flag) | ~1,100 |
| `data/pit-stops.json` | Every pit stop (lap, duration, stop time) | ~23 |
| `data/stints.json` | Tire stints (which compound, which laps) | ~40 |

TypeScript interfaces are in `src/types.ts`. Data loading examples are in `src/api/data.ts`.

### Key Data Notes

- `lap_duration` is in **seconds** (e.g., `99.97` = 1:39.970). You'll need to format this for display.
- `team_colour` is a hex color **without the `#`** prefix (e.g., `"3671C6"` → use as `#3671C6`).
- `is_pit_out_lap: true` means the lap time includes pit lane exit — not representative of race pace.
- Some drivers have fewer laps (DNF). Some laps have `null` for `lap_duration` — skip gracefully.

### Suggested Matchups

**Leclerc (#16) vs Sainz (#55)** — Same Ferrari car, different strategies. Pitted 5 laps apart. Who was actually faster?

**Verstappen (#1) vs Norris (#4)** — Title rivals. Norris ran 6 laps longer before pitting, then closed the gap on fresher tires. Where was each faster?

Or pick any two of the 20 drivers.

---

## F1 Reference

Consult this section if you need to understand a concept. You don't need to read it all upfront.

**Lap times**: Lower = faster. A normal lap here is ~95-100s. Each lap has 3 sectors.

**Pit stops**: Drivers stop to change tires 1-2 times per race. `pit_duration` (~23-25s) is total pit lane time. `stop_duration` (~2-3s) is time stationary for the tire change.

**Pit-in/pit-out laps**: Both are slower than normal and don't represent true pace. Pit-out laps are flagged (`is_pit_out_lap: true`). Pit-in laps aren't flagged — they're the lap before a pit stop.

**Stints**: Consecutive laps on one set of tires. Average stint pace (excluding pit laps) is a key comparison metric.

**Tire compounds**: SOFT (fastest, wears quickly), MEDIUM (balanced), HARD (slowest, lasts longest). Strategy is about when to trade speed for durability.

**Safety car**: Laps 3-5 in this race. All drivers slow to ~120-170s (vs normal ~99s). No flag in the data — just anomalously slow times.

**DNF**: Hamilton (#44) retired after 1 lap — only ~1-2 records in the data.
