/**
 * Career duration, single source of truth.
 *
 * Career start: December 2021 (first frontend role at Tata
 * Consultancy Services). The production build is static, so any
 * server-rendered experience value is frozen at build time; client
 * code must recalculate from these constants on load.
 */

export const CAREER_START_YEAR = 2021;
/** 0-indexed month: December. */
export const CAREER_START_MONTH = 11;

/** Full years and fractional months of experience, e.g. 4.9. */
export function getExperienceYears(now: Date = new Date()): number {
  const months =
    (now.getFullYear() - CAREER_START_YEAR) * 12 +
    (now.getMonth() - CAREER_START_MONTH);
  return Math.max(0, months / 12);
}

/** Meter scale for the console's experience needle: 0 to 6 years. */
export const EXPERIENCE_METER_MAX = 6;
