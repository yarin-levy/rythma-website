import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: "Rythma <hello@rythma.co>",
      to: email,
      subject: "You're on the Rythma waitlist!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #fff5f7 0%, #ffffff 100%);">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #E11D48;">Rythma</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 40px 40px;">
                      <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #1f2937;">You're on the list!</h2>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                        Thank you for joining the Rythma waitlist. We're building something special for women navigating perimenopause, and we can't wait to share it with you.
                      </p>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                        As one of our early supporters, you'll be among the first to know when we launch. Plus, <strong style="color: #E11D48;">the first 500 members get 50% off for life</strong>.
                      </p>
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                        We'll keep you updated on our progress. Until then, take care of yourself.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 14px; color: #9ca3af; text-align: center;">
                        With care,<br>
                        <strong style="color: #4b5563;">The Rythma Team</strong>
                      </p>
                    </td>
                  </tr>
                </table>
                <p style="margin: 20px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
                  © 2025 Rythma. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
