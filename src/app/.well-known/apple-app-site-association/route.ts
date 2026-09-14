// The universal-link association for `https://rythma.co/open?t=<token>`.
//
// Served with no file extension and `application/json`, which is what Apple's
// CDN requires. When the app is installed and this file names it, iOS opens the
// app instead of the browser and `/open` is never reached — that is the whole
// point of the deferred deep link (blueprint §8.2, app handout §3.3).
//
// The app side also needs the Associated Domains entitlement
// (`applinks:rythma.co`) in `rythma.entitlements`, which is Yarin's job in the
// developer portal.
//
// WHAT THIS REPLACED. Until now the route served the Paddle starter's config
// with `paths: ["/checkout_redirect*"]` and, because neither env var was ever
// set in Vercel, an appID of the literal string "undefined.undefined". It has
// been a non-functional file in production the whole time; nothing depended on
// it, so replacing it breaks nothing.

/**
 * The app's bundle id is fixed (build brief M3); only the team id is a secret,
 * and it is Yarin's to supply. With it unset the route says so rather than
 * serving "undefined.TEAM" and looking like it works.
 */
const BUNDLE_ID = "co.rythma.rythma";

export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID;

  if (!teamId) {
    console.error("apple-app-site-association: APPLE_TEAM_ID is not set — universal links cannot work");
    return Response.json(
      { applinks: { apps: [], details: [] } },
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  const appID = `${teamId}.${BUNDLE_ID}`;

  return Response.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID,
            // Only the deferred deep link. The funnel itself must NOT open in
            // the app: /quiz has to stay a web page, or Meta's click-through
            // lands nowhere.
            paths: ["/open*"],
          },
        ],
      },
      // Password-manager association, so Sign in with Apple and saved
      // credentials work across the site and the app.
      webcredentials: { apps: [appID] },
    },
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
