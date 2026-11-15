// Single source of truth for every date that renders on the site.
//
// Background: Astro pre-renders pages at build time, so any `new Date()`
// evaluated in frontmatter freezes at the build date on the deployed site.
// Server-rendered values below are therefore build-time fallbacks only —
// visible dates re-compute on page load, in the browser, from this same
// module, so server and client can never drift apart.

/** First month of professional experience. Month is 0-indexed: 11 = Dec. */
export const CAREER_START = new Date(2021, 11);

export interface Tenure {
  years: number;
  months: number;
  /** Compact display form, e.g. "4.11". Kept as-is by team decision. */
  exp: string;
}

/** Elapsed whole years/months between two dates. */
export function diffTenure(start: Date, end: Date): Tenure {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, exp: months > 0 ? `${years}.${months}` : `${years}` };
}

/** Total experience since career start. Defaults to right now. */
export function getExperience(now: Date = new Date()): Tenure {
  return diffTenure(CAREER_START, now);
}

/** Site copyright year. Defaults to right now. */
export function getSiteYear(now: Date = new Date()): number {
  return now.getFullYear();
}

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Sept: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/** Parse "Jun 2025" into a date. */
export function parseMonthYear(s: string): Date {
  const [mon, yr] = s.trim().split(" ");
  return new Date(parseInt(yr), MONTHS[mon] ?? 0);
}

/**
 * Human duration between two "Mon YYYY" labels, e.g. "1 yr 5 mo".
 * `end` may be "Present", which resolves against `now` (default: right now,
 * so pass an explicit date only in tests).
 */
export function computeDuration(
  startStr: string,
  endStr: string,
  now: Date = new Date(),
): string {
  const start = parseMonthYear(startStr);
  const end = endStr === "Present" ? now : parseMonthYear(endStr);
  const { years, months } = diffTenure(start, end);
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo`);
  return parts.join(" ") || "< 1 mo";
}
