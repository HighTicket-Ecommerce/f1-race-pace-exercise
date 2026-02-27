import type { Race, Driver } from "../types";
// You'll also want: Lap, PitStop, Stint from "../types"

const DATA_PATH = "/data";

export async function getRace(): Promise<Race> {
  const res = await fetch(`${DATA_PATH}/race.json`);
  return res.json();
}

export async function getDrivers(): Promise<Driver[]> {
  const res = await fetch(`${DATA_PATH}/drivers.json`);
  return res.json();
}

// TODO: Add functions for laps, pit stops, and stints
// Hint: The files are at /data/laps.json, /data/pit-stops.json, /data/stints.json
