import { DateTime } from "luxon";
import {
  WORK_START_HOUR,
  LUNCH_START_HOUR,
  LUNCH_END_HOUR,
  WORK_END_HOUR,
} from "../config/constants.config";
import { isHoliday } from "../config/holidays.config";

export function isWeekend(dt: DateTime): boolean {
  return dt.weekday === 6 || dt.weekday === 7;
}

export async function isNonWorkingDay(dt: DateTime): Promise<boolean> {
  return isWeekend(dt) || (await isHoliday(dt));
}

export async function nextWorkingDayStart(dt: DateTime): Promise<DateTime> {
  let next: DateTime<boolean> = dt.plus({ days: 1 }).set({
    hour: WORK_START_HOUR,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  while (await isNonWorkingDay(next)) {
    next = next.plus({ days: 1 }).set({
      hour: WORK_START_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
  return next;
}

export async function roundBackToNearestWorkTime(
  dt: DateTime,
): Promise<DateTime> {
  let result: DateTime<boolean> = dt;

  if (result.hour < WORK_START_HOUR) {
    result = result.set({
      hour: WORK_START_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  } else if (result.hour >= LUNCH_START_HOUR && result.hour < LUNCH_END_HOUR) {
    result = result.set({
      hour: LUNCH_END_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  } else if (result.hour >= WORK_END_HOUR) {
    result = result.set({
      hour: WORK_END_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    result = await nextWorkingDayStart(result);
  }

  while (await isNonWorkingDay(result)) {
    result = await nextWorkingDayStart(result);
  }

  return result;
}

export async function addWorkingDays(
  start: DateTime,
  days: number,
): Promise<DateTime> {
  let result: DateTime<boolean> = start;
  let added: number = 0;

  while (added < days) {
    result = result.plus({ days: 1 }).set({
      hour: WORK_START_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    if (!(await isNonWorkingDay(result))) {
      added++;
    }
  }
  return result;
}

export async function addWorkingHours(
  start: DateTime,
  hours: number,
): Promise<DateTime> {
  let remaining: number = hours;
  let current: DateTime<boolean> = start;

  while (remaining > 0) {
    if (current.hour < LUNCH_START_HOUR) {
      const minutesUntilLunch: number =
        (LUNCH_START_HOUR - current.hour) * 60 - current.minute;
      const hoursUntilLunch: number = minutesUntilLunch / 60;

      if (remaining <= hoursUntilLunch) {
        current = current.plus({ hours: remaining });
        return current;
      }

      current = current.set({ hour: LUNCH_END_HOUR, minute: 0 });
      remaining -= hoursUntilLunch;
    }

    const hoursUntilEnd: number =
      WORK_END_HOUR - current.hour + current.minute / 60;

    if (remaining <= hoursUntilEnd) {
      current = current.plus({ hours: remaining });
      return current;
    }

    remaining -= hoursUntilEnd;
    current = await nextWorkingDayStart(current);
  }

  return current;
}
