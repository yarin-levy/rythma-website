import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Rythma",
  description:
    "Terms of Service governing your use of the Rythma mobile application and related services.",
};

export default function TermsOfService() {
  return (
    <article className="mx-auto mt-16 max-w-3xl px-4 pb-16 sm:mt-20 sm:px-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Last Updated: April 13, 2026
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-7 text-foreground/90">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the Rythma mobile application (&ldquo;App&rdquo;) and related
          services (collectively, the &ldquo;Services&rdquo;) provided by Rythma
          (&ldquo;We,&rdquo; &ldquo;Us,&rdquo; or &ldquo;Our&rdquo;). By
          downloading, installing, or using our Services, you agree to be bound
          by these Terms and our{" "}
          <a
            href="/privacy"
            className="text-raspberry underline underline-offset-2"
          >
            Privacy Policy
          </a>
          . If you do not agree, do not use our Services.
        </p>
        <p>
          Our Services are licensed, not sold, to you. Your license is subject to
          these Terms and, where applicable, Apple&apos;s Licensed Application
          End User License Agreement.
        </p>

        {/* Section 1 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            1. Acceptance of Terms
          </h2>
          <p>
            You must be at least 18 years old (or the age of majority in your
            jurisdiction) to use our Services. By using the Services, you
            represent that you meet this requirement and have the legal capacity
            to enter into these Terms.
          </p>
          <p>
            We may update these Terms from time to time. Continued use after
            changes constitutes acceptance. We will notify you of material
            changes via the App or email.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            2. Account Registration and Security
          </h2>
          <p>
            To use the Services, you must create an account via Sign in with
            Apple, Sign in with Google, or email/password registration. You agree
            to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Provide accurate information and keep it updated.</li>
            <li>Maintain the confidentiality of your credentials.</li>
            <li>
              Notify us immediately of any unauthorized access to your account.
            </li>
          </ul>
          <p>
            You are responsible for all activities that occur under your account.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            3. Use of Services
          </h2>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">3.1 License Grant</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable
              license to use the App on Apple-branded devices you own or control,
              solely for personal, non-commercial purposes, in accordance with
              these Terms and Apple&apos;s Usage Rules.
            </p>
            <p>You may not:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Modify, reverse-engineer, decompile, disassemble, or create
                derivative works of the App.
              </li>
              <li>
                Use the Services for any illegal purpose or in violation of any
                applicable laws.
              </li>
              <li>Interfere with or disrupt the Services or servers.</li>
              <li>
                Attempt to access other users&apos; data or accounts.
              </li>
              <li>
                Use the App to provide medical advice or services to others.
              </li>
              <li>
                Upload malicious content or misuse any feature of the App.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">3.2 Features</h3>
            <p>
              Our Services include symptom tracking, period tracking, AI-powered
              predictions, an AI chat guide, doctor report generation, pattern
              insights, and Apple Health integration. All features require a paid
              subscription.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              3.3 Apple Health Integration
            </h3>
            <p>
              By enabling Apple Health integration, you consent to the App
              reading and/or writing health data categories you have approved.
              You can modify or revoke this access at any time via the app or iOS
              Settings. We are not responsible for the accuracy of data received
              from Apple Health.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              3.4 AI Features and Medical Disclaimer
            </h3>
            <p className="font-semibold">
              IMPORTANT: Rythma is NOT a medical device. The App does NOT provide
              medical advice, diagnosis, or treatment.
            </p>
            <p>
              The AI chat guide (&ldquo;Stella&rdquo;) and prediction features
              provide informational responses only, based on self-reported data
              and statistical pattern analysis. AI responses are generated by
              third-party language models and may contain inaccuracies or errors.
            </p>
            <p>You acknowledge and agree that:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Predictions of &ldquo;difficult days&rdquo; are estimates based
                on patterns in your logged data and are not guaranteed to be
                accurate.
              </li>
              <li>
                AI chat responses are for informational purposes only and must
                not be relied upon for medical decisions.
              </li>
              <li>
                You should always consult a qualified healthcare provider before
                making any health-related decisions.
              </li>
              <li>
                Doctor Reports generated by the App are summaries of your
                self-reported data, not medical records or clinical assessments.
              </li>
              <li>
                The App is not a substitute for professional medical care, and
                any delay in seeking medical attention based on information from
                the App is at your own risk.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            4. Subscriptions and Payments
          </h2>
          <p>
            Our Services require a paid subscription. By subscribing:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Pricing:</strong> Monthly plan at $9.99/month or Annual
              plan at $79.99/year.
            </li>
            <li>
              <strong>Free Trial:</strong> New subscribers may be eligible for a
              7-day free trial. If you do not cancel before the trial ends, you
              will be charged for the selected subscription plan.
            </li>
            <li>
              <strong>Auto-Renewal:</strong> Subscriptions automatically renew at
              the end of each billing period unless canceled at least 24 hours
              before the renewal date.
            </li>
            <li>
              <strong>Payment Processing:</strong> All payments are processed by
              Apple through the App Store. We do not collect or store payment
              information.
            </li>
            <li>
              <strong>Managing Subscriptions:</strong> You can manage or cancel
              your subscription through your Apple ID settings (Settings &gt;
              Apple ID &gt; Subscriptions). Cancellation takes effect at the end
              of the current billing period.
            </li>
            <li>
              <strong>Refunds:</strong> Refund requests are handled by Apple in
              accordance with their refund policies. We do not process refunds
              directly.
            </li>
            <li>
              <strong>Price Changes:</strong> We reserve the right to change
              subscription pricing. Existing subscribers will be notified before
              any price increase takes effect.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            5. Intellectual Property
          </h2>
          <p>
            All content, trademarks, logos, designs, code, algorithms, and
            materials in the Services are owned by Rythma or our licensors. You
            may not reproduce, distribute, modify, or create derivative works
            from any part of the Services without our prior written permission.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            6. User Content
          </h2>
          <p>
            Any data you input into the App (symptoms, notes, period data, chat
            messages) remains yours. You grant us a limited license to process
            this data solely as necessary to provide the Services to you. We do
            not claim ownership of your health data.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            7. Data Export and Account Deletion
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              You may export all your data at any time through the Profile
              section of the App.
            </li>
            <li>
              You may delete your account at any time through the Profile section
              of the App. Account deletion permanently removes all your data from
              our systems and is irreversible.
            </li>
            <li>
              Deleting the App from your device does not delete your account. You
              must explicitly delete your account through the App or by
              contacting us.
            </li>
            <li>
              Canceling your subscription does not delete your account or data.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            8. Disclaimers and Limitations of Liability
          </h2>
          <p className="font-semibold uppercase">
            THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY OF
            PREDICTIONS, ACCURACY OF AI RESPONSES, AND NON-INFRINGEMENT.
          </p>
          <p className="font-semibold uppercase">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RYTHMA SHALL NOT
            BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF
            PROFITS, PERSONAL INJURY, OR PROPERTY DAMAGE ARISING FROM YOUR USE
            OF THE SERVICES.
          </p>
          <p className="font-semibold uppercase">
            OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID
            FOR THE SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
          </p>
          <p className="font-semibold uppercase">
            YOU EXPRESSLY ACKNOWLEDGE THAT THE APP IS NOT A MEDICAL DEVICE AND
            THAT YOU USE THE PREDICTIONS, INSIGHTS, AND AI FEATURES AT YOUR OWN
            RISK. WE ARE NOT LIABLE FOR ANY HEALTH OUTCOMES RESULTING FROM YOUR
            RELIANCE ON INFORMATION PROVIDED BY THE APP.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            9. Indemnification
          </h2>
          <p>
            You agree to indemnify, defend, and hold harmless Rythma and its
            officers, directors, employees, and agents from any claims, damages,
            losses, liabilities, and expenses (including attorneys&apos; fees)
            arising from your misuse of the Services, violation of these Terms,
            or infringement of any third party&apos;s rights.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            10. Termination
          </h2>
          <p>
            We may suspend or terminate your access to the Services at any time,
            with or without cause, including for violation of these Terms. Upon
            termination:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Your license to use the App ends immediately.</li>
            <li>
              You may request export of your data before termination takes
              effect.
            </li>
            <li>We may delete your account and all associated data.</li>
          </ul>
          <p>
            You may terminate your account at any time by deleting your account
            through the App.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            11. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms are governed by the laws of the State of Delaware, USA,
            without regard to conflict of laws principles. Any disputes arising
            from these Terms or the Services shall be resolved through binding
            arbitration in accordance with the rules of the American Arbitration
            Association, except where prohibited by law. You agree to waive any
            right to participate in class action lawsuits.
          </p>
        </section>

        {/* Section 12 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            12. Severability
          </h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the
            remaining provisions will remain in full force and effect.
          </p>
        </section>

        {/* Section 13 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            13. Entire Agreement
          </h2>
          <p>
            These Terms, together with our{" "}
            <a
              href="/privacy"
              className="text-raspberry underline underline-offset-2"
            >
              Privacy Policy
            </a>
            , constitute the entire agreement between you and Rythma regarding
            the use of the Services.
          </p>
        </section>

        {/* Section 14 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            14. Contact Us
          </h2>
          <p>
            For questions about these Terms, contact us at:
          </p>
          <div className="space-y-1">
            <p className="font-medium">Rythma</p>
            <p>
              Email:{" "}
              <a
                href="mailto:support@rythma.co"
                className="text-raspberry underline underline-offset-2"
              >
                support@rythma.co
              </a>
            </p>
            <p>
              Website:{" "}
              <a
                href="https://rythma.co"
                className="text-raspberry underline underline-offset-2"
              >
                https://rythma.co
              </a>
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}
