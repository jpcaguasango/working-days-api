import { DateTime } from "luxon";

let holidaySet: string[] = [];

async function loadHolidays(): Promise<string[]> {
  if (holidaySet.length) return holidaySet;

  const res = await fetch(
    "https://content.capta.co/Recruitment/WorkingDays.json",
  );
  if (!res.ok) throw new Error("Cannot fetch holidays list");

  holidaySet = await res.json();
  return holidaySet;
}

export async function isHoliday(dt: DateTime): Promise<boolean> {
  const isoDate = dt.toISODate();

  if (!isoDate) return false;

  const holidays: string[] = await loadHolidays();
  return holidays.includes(isoDate);
}
