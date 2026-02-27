/**
 * Download and clean F1 race data from OpenF1 API.
 * Run once during setup — not by candidates.
 *
 * Usage: npx tsx scripts/download-data.ts
 */

const SESSION_KEY = 9617;
const BASE_URL = "https://api.openf1.org/v1";
const DATA_DIR = new URL("../public/data/", import.meta.url);

async function fetchJSON<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}?session_key=${SESSION_KEY}`;
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json() as Promise<T>;
}

async function writeJSON(filename: string, data: unknown) {
  const path = new URL(filename, DATA_DIR);
  const fs = await import("node:fs/promises");
  await fs.mkdir(new URL(".", path), { recursive: true });
  await fs.writeFile(path, JSON.stringify(data, null, 2) + "\n");
  const count = Array.isArray(data) ? data.length : 1;
  console.log(`  Wrote ${filename} (${count} record${count === 1 ? "" : "s"})`);
}

interface RawDriver {
  driver_number: number;
  first_name: string;
  last_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  [key: string]: unknown;
}

interface RawLap {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  i1_speed: number | null;
  i2_speed: number | null;
  is_pit_out_lap: boolean;
  [key: string]: unknown;
}

interface RawPitStop {
  driver_number: number;
  lap_number: number;
  pit_duration: number | null;
  stop_duration: number | null;
  [key: string]: unknown;
}

interface RawStint {
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
  tyre_age_at_start: number;
  [key: string]: unknown;
}

async function main() {
  console.log("Downloading 2024 United States Grand Prix data (session_key=9617)\n");

  // 1. Race metadata (hardcoded — not available from a single endpoint)
  const race = {
    session_key: 9617,
    meeting_key: 1247,
    name: "United States Grand Prix",
    official_name: "FORMULA 1 PIRELLI UNITED STATES GRAND PRIX 2024",
    date: "2024-10-20",
    circuit: "Circuit of the Americas",
    location: "Austin, Texas",
    total_laps: 56,
  };
  await writeJSON("race.json", race);

  // 2. Drivers
  const rawDrivers = await fetchJSON<RawDriver[]>("/drivers");
  const drivers = rawDrivers.map((d) => ({
    driver_number: d.driver_number,
    first_name: d.first_name,
    last_name: d.last_name,
    name_acronym: d.name_acronym,
    team_name: d.team_name,
    team_colour: d.team_colour,
    country_code: d.country_code,
  }));
  await writeJSON("drivers.json", drivers);

  // 3. Laps
  const rawLaps = await fetchJSON<RawLap[]>("/laps");
  const laps = rawLaps.map((l) => ({
    driver_number: l.driver_number,
    lap_number: l.lap_number,
    lap_duration: l.lap_duration,
    duration_sector_1: l.duration_sector_1,
    duration_sector_2: l.duration_sector_2,
    duration_sector_3: l.duration_sector_3,
    i1_speed: l.i1_speed,
    i2_speed: l.i2_speed,
    is_pit_out_lap: l.is_pit_out_lap,
  }));
  await writeJSON("laps.json", laps);

  // 4. Pit stops
  const rawPits = await fetchJSON<RawPitStop[]>("/pit");
  const pitStops = rawPits.map((p) => ({
    driver_number: p.driver_number,
    lap_number: p.lap_number,
    pit_duration: p.pit_duration,
    stop_duration: p.stop_duration,
  }));
  await writeJSON("pit-stops.json", pitStops);

  // 5. Stints
  const rawStints = await fetchJSON<RawStint[]>("/stints");
  const stints = rawStints.map((s) => ({
    driver_number: s.driver_number,
    stint_number: s.stint_number,
    lap_start: s.lap_start,
    lap_end: s.lap_end,
    compound: s.compound,
    tyre_age_at_start: s.tyre_age_at_start,
  }));
  await writeJSON("stints.json", stints);

  console.log("\nDone! Data saved to public/data/");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
