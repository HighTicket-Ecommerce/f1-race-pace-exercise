/** A driver competing in the race */
export interface Driver {
  driver_number: number;       // Car number (e.g., 1 for Verstappen, 4 for Norris)
  first_name: string;          // "Max"
  last_name: string;           // "Verstappen"
  name_acronym: string;        // "VER" — 3-letter code
  team_name: string;           // "Red Bull Racing"
  team_colour: string;         // Hex color WITHOUT # prefix (e.g., "3671C6")
  country_code: string;        // "NED"
}

/** A single lap completed by a driver */
export interface Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;        // Total lap time in SECONDS (e.g., 99.97 = 1:39.970)
  duration_sector_1: number | null;   // Sector 1 time in seconds
  duration_sector_2: number | null;   // Sector 2 time in seconds
  duration_sector_3: number | null;   // Sector 3 time in seconds
  i1_speed: number | null;            // Speed at intermediate 1 (km/h)
  i2_speed: number | null;            // Speed at intermediate 2 (km/h)
  is_pit_out_lap: boolean;            // True if driver exited pit lane this lap (lap time inflated)
}

/** A pit stop made by a driver */
export interface PitStop {
  driver_number: number;
  lap_number: number;          // The lap on which the driver pitted
  pit_duration: number | null; // Total time in pit lane in seconds (~23-25s normal)
  stop_duration: number | null;// Time stationary for tire change (~2-3s normal)
}

/** A stint — a sequence of consecutive laps on one set of tires */
export interface Stint {
  driver_number: number;
  stint_number: number;        // Sequential: 1, 2, 3...
  lap_start: number;           // First lap of this stint
  lap_end: number;             // Last lap of this stint
  compound: string;            // Tire type: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET"
  tyre_age_at_start: number;   // Laps already on this set (0 = brand new)
}

/** Race metadata */
export interface Race {
  session_key: number;
  name: string;
  date: string;
  circuit: string;
  location: string;
  total_laps: number;
}
