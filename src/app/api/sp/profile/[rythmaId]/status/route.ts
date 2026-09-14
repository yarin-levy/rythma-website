import { NextResponse } from "next/server";
import { profileStatus } from "@/lib/sp/profile-api";
import { ProfileApiError } from "@/lib/sp/profile-contract";

// What screen 31 polls after checkout succeeds, every 2s for at most 30s.
//
// Backed by `web-profile-status` (Yarin's ruling 2026-09-14), so the code never
// sits on our infrastructure between the Stripe webhook and her screen: the app
// project mints it, holds it, and hands it back here. The website key stays on
// the server; the browser only ever sees this route.
//
// "Not paid yet" is the poll's ordinary state, not an error — Stripe's webhook
// and her first poll race each other. After 30 seconds the screen stops and
// points her at the email the webhook has already sent.
//
// The rythma_id is the only credential here, and only her browser has it. The
// response carries `paid` and `code` and nothing else: the manage URL, the plan
// and the trial end are for the server and the app, not for this screen.

export async function GET(_request: Request, { params }: { params: Promise<{ rythmaId: string }> }) {
  const { rythmaId } = await params;

  try {
    const status = await profileStatus(rythmaId);
    if (!status.paid || !status.code) return NextResponse.json({ paid: false });
    return NextResponse.json({ paid: true, code: status.code });
  } catch (error) {
    if (error instanceof ProfileApiError && error.status === 404) {
      return NextResponse.json({ paid: false }, { status: 404 });
    }
    // A failed read looks the same to her as a slow webhook: keep polling,
    // then the email. Logged, because a function that is down will look like
    // every buyer taking the slow path.
    console.error(
      "sp/status: profile status failed",
      error instanceof ProfileApiError ? { status: error.status, ...error.body } : error,
    );
    return NextResponse.json({ paid: false }, { status: 502 });
  }
}
