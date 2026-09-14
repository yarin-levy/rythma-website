import { NextResponse } from "next/server";

// `https://rythma.co/open?t=<link_token>` — the deferred deep link in every
// funnel email (blueprint §8.2, build brief §2b).
//
// When the app is installed and the universal link is associated, iOS opens the
// app and this route is never reached. When it isn't, the tap lands here and the
// only useful thing to do is send her to the App Store. The token is carried in
// the URL for the app, never read here.
//
// Brought forward from M3 because M2's email links to it and a 404 at the end of
// the abandoner rescue is worse than a redirect. What is still M3: serving
// `/.well-known/apple-app-site-association` with the team id, which is what
// makes iOS open the app instead of this route at all.
//
// The redirect target is the site's own `/app` hop (next.config.ts), so no
// condition term ever appears in a URL she is sent to (blueprint §9).

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  // 307, not 308: the destination is a hop we want to be able to repoint.
  return NextResponse.redirect(`${origin}/app`, 307);
}
