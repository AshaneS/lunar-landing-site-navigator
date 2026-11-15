// lib/dates.ts
import { format, parse, isValid } from "date-fns";

export const DATE_KEY = "yyyy-MMM-dd";

export function parseDateKey(s: string, fallback = "2026-Nov-14") {
  const d = parse(s, DATE_KEY, new Date());
  return isValid(d) ? d : parse(fallback, DATE_KEY, new Date());
}
export const toDateKey = (d: Date) => format(d, DATE_KEY);