/**
 * Calendar-date (UTC) publish gate.
 *
 * Contentlayer parses frontmatter `date` values as UTC midnight, so comparing
 * them against a *local* midnight threshold misfires in timezones ahead of UTC
 * (a post dated "today" parses to a few hours past local midnight and looks
 * "in the future"). We compare UTC calendar dates on both sides instead, which
 * is timezone-stable and still supports scheduling future-dated posts.
 */
export function isPublished(date: string): boolean {
  const todayUTC = new Date().toISOString().slice(0, 10);
  const postUTC = new Date(date).toISOString().slice(0, 10);
  return postUTC <= todayUTC;
}
