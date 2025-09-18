export interface ParsedParams {
  days?: number;
  hours?: number;
  date?: string;
}

export function parseParams(q: Record<string, any>): ParsedParams {
  const out: ParsedParams = {};
  if (q.days !== undefined) {
    const d = Number(q.days);
    if (!Number.isInteger(d) || d < 0) throw new Error("days must be a positive integer");
    out.days = d;
  }
  if (q.hours !== undefined) {
    const h = Number(q.hours);
    if (!Number.isFinite(h) || h < 0) throw new Error("hours must be a positive number");
    out.hours = h;
  }
  if (q.date !== undefined) {
    const s = String(q.date);
    if (!s.endsWith("Z")) throw new Error("date must be an ISO 8601 string with trailing Z (UTC)");
    out.date = s;
  }
  return out;
}
