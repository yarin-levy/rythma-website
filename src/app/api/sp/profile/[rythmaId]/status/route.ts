import { NextResponse } from "next/server";
import { recallCode } from "@/lib/sp/code-store";

// What screen 31 polls after checkout succeeds, every 2s for at most 30s.
//
// Returns her code once the webhook has been and gone. A miss is not an error:
// Stripe's webhook and her poll race each other, and the webhook can also land
// on a different serverless instance than this request (see code-store.ts). The
// screen stops after 30 seconds and points her at the email, which the webhook
// has already sent.
//
// The rythma_id is the only credential here, and she is the only person who has
// it — it never appears in a URL she did not create. The code is returned to
// that same browser and nowhere else.

export async function GET(_request: Request, { params }: { params: Promise<{ rythmaId: string }> }) {
  const { rythmaId } = await params;
  const paid = recallCode(rythmaId);
  if (!paid) return NextResponse.json({ paid: false });
  return NextResponse.json({ paid: true, code: paid.code, plan: paid.plan });
}
