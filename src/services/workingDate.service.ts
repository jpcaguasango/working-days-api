import { DateTime } from "luxon";
import { COLOMBIA_TZ } from "../config/constants.config";
import { parseParams, ParsedParams } from "../utils/validation.util";
import {
  roundBackToNearestWorkTime,
  addWorkingDays,
  addWorkingHours,
} from "../utils/date.util";

export interface ServiceResult {
  date: string;
}

export async function calculateWorkingDate(
  q: Record<string, any>,
): Promise<ServiceResult> {
  const parsed: ParsedParams = parseParams(q);

  if (parsed.days === undefined && parsed.hours === undefined) {
    throw new Error("At least one of 'days' or 'hours' must be provided");
  }

  let startLocal: DateTime<true> | DateTime<false> = parsed.date
    ? DateTime.fromISO(parsed.date, { zone: "utc" }).setZone(COLOMBIA_TZ)
    : DateTime.now().setZone(COLOMBIA_TZ);

  let workingStart: DateTime<boolean> =
    await roundBackToNearestWorkTime(startLocal);

  if (parsed.days) {
    workingStart = await addWorkingDays(workingStart, parsed.days);
  }

  if (parsed.hours) {
    workingStart = await addWorkingHours(workingStart, parsed.hours);
  }

  return { date: workingStart.setZone("utc").toISO()! };
}
