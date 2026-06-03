/**
 * Time-based publish gate.
 *
 * A post goes live at 11:00 UTC (7:00 AM US Eastern / 6:00 AM in winter) on its
 * frontmatter `date`. We gate on a full datetime, not just the calendar date, so
 * posts publish at a consistent US-morning time rather than at UTC midnight.
 *
 * Because the blog routes render dynamically (see `export const dynamic` in the
 * blog pages and sitemap), this check is evaluated per request — so a post flips
 * from hidden to live the moment its publish time passes, with no rebuild, cron,
 * or external scheduler required.
 */
const PUBLISH_HOUR_UTC = 11; // 7:00 AM US Eastern (EDT)

export function isPublished(date: string): boolean {
  const day = String(date).slice(0, 10); // YYYY-MM-DD
  const publishAt = Date.parse(`${day}T${String(PUBLISH_HOUR_UTC).padStart(2, "0")}:00:00Z`);
  if (Number.isNaN(publishAt)) return false;
  return Date.now() >= publishAt;
}
