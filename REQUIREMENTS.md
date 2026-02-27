# Live Build: F1 Race Pace Explorer

## Context

You're building a quick internal tool for an F1 team strategist.
They want to compare how two drivers performed across a race — lap times,
pit strategy, and overall pace.

**User:** Team strategist analyzing race performance
**Goal:** Pick two drivers and understand who was faster, where, and why

---

## How F1 Works (everything you need to know)

### The Basics

- An F1 race has 20 drivers, each from one of 10 teams (2 drivers per team)
- A race is a fixed number of laps around a circuit (56 laps at this circuit)
- **Lower lap time = faster = better**
- Each driver has a unique car number (e.g., #1 Verstappen, #4 Norris, #16 Leclerc)

### Lap Times

- A lap time is how long it takes to go around the circuit once
- Measured in **seconds** (e.g., `99.97` seconds = 1 minute 39.970 seconds)
- A "fast" lap at this circuit is ~95-100 seconds
- Each lap is divided into 3 **sectors** — sector times add up to the total lap time
- Speed is measured at two intermediate points (km/h)

### Pit Stops

- During a race, drivers must stop in the pit lane to change tires (usually 1-2 times)
- A pit stop has two durations:
  - **Pit duration** (~23-25s): Total time from entering to exiting the pit lane
  - **Stop duration** (~2-3s): Time the car is stationary while the crew changes tires
- A pit stop happens on a specific lap number

### Pit-In and Pit-Out Laps

This is important for analyzing pace:

- **Pit-in lap**: The lap where a driver enters the pit lane. The lap time is slower because they slow down and drive through the pit lane instead of the full track. There's no flag in the data for this — you'd identify it as the lap just before a pit stop.
- **Pit-out lap**: The lap where a driver exits the pit lane. The lap time is slower because they start from the pit lane instead of the main track. **This IS flagged in the data as `is_pit_out_lap: true`.**
- Both pit-in and pit-out laps are NOT representative of a driver's actual race pace and should be handled carefully in averages.

### Stints

- A **stint** is a sequence of consecutive laps on one set of tires
- Example: Lap 1-26 on Medium tires = Stint 1, Lap 27-56 on Hard tires = Stint 2
- **Average stint pace** (excluding pit-in and pit-out laps) is a key metric for comparing drivers

### Tire Compounds

There are 3 dry-weather tire compounds, with a trade-off between speed and durability:

| Compound | Speed | Durability | Color |
|----------|-------|------------|-------|
| **SOFT** | Fastest | Wears out quickly | Red |
| **MEDIUM** | Middle | Moderate wear | Yellow |
| **HARD** | Slowest | Lasts longest | White |

Strategy matters: a driver on fresh Soft tires will be faster lap-by-lap, but a driver on Hard tires can run longer before needing to pit.

### DNF (Did Not Finish)

Some drivers don't finish the race — mechanical failure, crash, etc. They'll have fewer laps of data than other drivers. Hamilton (#44) retired after just 1 lap in this race.

### Safety Car

When there's an incident on track, a safety car comes out and all drivers must slow down significantly. Safety car laps are **much slower** than normal — 120-170 seconds vs. the normal ~99 seconds. There's no explicit "safety car" flag in the data — you can only identify these laps by their unusually slow times.

In this race, laps 3-5 were under safety car.

### What "Good" Looks Like

A strong driver performance shows:
- **Consistent pace**: Lap times that don't vary much (excluding pit laps and safety car)
- **Good strategy**: Pitting at the right time, choosing the right tires
- **Race craft**: Gaining positions, defending well, faster in wheel-to-wheel battles

---

## The Data

Real data from the **2024 United States Grand Prix** (Circuit of the Americas, Austin).
56 laps, 20 drivers, 10 teams.

| File | What's In It | Records |
|------|-------------|---------|
| `data/race.json` | Race metadata (name, date, circuit, total laps) | 1 |
| `data/drivers.json` | All 20 drivers (name, team, car number, team color) | 20 |
| `data/laps.json` | Every lap for every driver (lap time, sectors, pit-out flag) | ~1,100 |
| `data/pit-stops.json` | Every pit stop (lap, duration, stop time) | ~23 |
| `data/stints.json` | Tire stints (which compound, which laps) | ~40 |

**TypeScript interfaces are in `src/types.ts`.** Data loading examples are in `src/api/data.ts`.

### Key Data Notes

- `lap_duration` is in **seconds** (e.g., `99.97` = 1:39.970). You'll need to format this for display.
- `team_colour` is a hex color **without the `#`** prefix (e.g., `"3671C6"` → use as `#3671C6`).
- `is_pit_out_lap: true` means the lap time includes pit lane exit — it's not representative of race pace.
- Some drivers have fewer laps than others (DNF — they didn't finish the race).
- Some laps have `null` values for `lap_duration` — skip these gracefully.

---

## Suggested Matchups

We've pre-loaded data from the 2024 United States Grand Prix. Here are interesting
comparisons to try:

### Leclerc (#16) vs Sainz (#55) — "Same team, different strategies"

Both Ferrari drivers, same car. Leclerc won, Sainz finished 2nd — but they pitted
5 laps apart (Sainz lap 21, Leclerc lap 26). How did that affect their pace?
Who was actually faster on raw speed?

### Verstappen (#1) vs Norris (#4) — "The title fight"

Verstappen finished 3rd, Norris 4th (after a 5-second penalty). Norris ran 6 laps
longer on medium tires before pitting (lap 31 vs lap 25). In the closing laps,
Norris on fresher hard tires was catching Verstappen. Where was each driver faster?

### Pick any two drivers

The data includes all 20. Compare whoever interests you.

---

## Requirements

### Tier 1: MVP (This is "done")

1. **Driver Selection**
   - Two dropdown/selectors to pick Driver A and Driver B
   - Populated from the driver data (show name + car number)

2. **Lap Time Comparison**
   - A table or list showing: lap number, Driver A time, Driver B time, delta
   - Times formatted readably (not raw seconds)
   - Delta shows who was faster on each lap

**If you complete Tier 1, you've finished the exercise.**

---

### Tier 2: Better (If you have time)

3. **Pit Stop & Stint Integration**
   - Show where each driver pitted (which lap, how long)
   - Show tire compound per stint
   - Calculate average lap time per stint (excluding pit-in and pit-out laps)

4. **Handle Outliers**
   - Identify and handle unusually slow laps (safety car, pit laps)
   - Don't let outliers skew pace averages

---

### Tier 3: Exceptional (Bonus)

5. **Tell the Story**
   - Surface a summary: who was faster overall? By how much?
   - Show trends: was one driver getting faster or slower over the race?
   - Make it something a non-technical person could glance at and understand

---

## Time

~35 minutes. Work however you normally work.

---

## Notes

- Use any AI tools you want — we want to see your real workflow
- Ask questions if something about F1 is unclear
- Completing Tier 1 is success — Tiers 2-3 are bonus
- We're watching how you work, not just the output
