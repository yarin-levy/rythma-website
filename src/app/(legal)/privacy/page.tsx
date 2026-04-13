import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Rythma",
  description:
    "Learn how Rythma collects, uses, and protects your personal and health information.",
};

export default function PrivacyPolicy() {
  return (
    <article className="mx-auto mt-16 max-w-3xl px-4 pb-16 sm:mt-20 sm:px-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Last Updated: April 13, 2026
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-7 text-foreground/90">
        <p>
          Rythma (&ldquo;We,&rdquo; &ldquo;Us,&rdquo; or &ldquo;Our&rdquo;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your personal information when
          you use our mobile application (&ldquo;App&rdquo;) and related
          services (collectively, the &ldquo;Services&rdquo;). The App is
          designed to help women navigating perimenopause track symptoms,
          understand cycle patterns, and receive personalized health insights in
          a privacy-first manner.
        </p>
        <p>
          By using our Services, you agree to the collection and use of
          information in accordance with this Privacy Policy. If you do not
          agree, please do not use our Services.
        </p>
        <p>
          We may update this Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the &ldquo;Last Updated&rdquo; date.
        </p>

        {/* Section 1 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            1. Information We Collect
          </h2>
          <p>
            We adhere to a data minimization philosophy, collecting only the
            information necessary to provide symptom tracking, pattern detection,
            predictions, and related features. We categorize the information we
            collect as follows:
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">1.1 Personal Information</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Authentication Data:</strong> Name and email address
                obtained from your chosen authentication provider (Apple, Google,
                or email registration).
              </li>
              <li>
                <strong>Age Range:</strong> Selected during onboarding (38–42,
                43–47, 48–52, 53–55, 56+). We do not collect your exact date of
                birth.
              </li>
              <li>
                <strong>Onboarding Preferences:</strong> Cycle regularity status,
                symptom impact level, doctor relationship history, current
                tracking habits, and feature priorities.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              1.2 Health and Medical Data
            </h3>
            <p>
              Because Rythma is a health tracking app, we collect sensitive
              health-related information that you voluntarily provide:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Menstrual Cycle Data:</strong> Period start/end dates,
                flow intensity (Light/Medium/Heavy), cycle length, and cycle
                regularity status.
              </li>
              <li>
                <strong>Symptom Data:</strong> Daily tracking of up to 18
                symptoms including hot flashes, night sweats, brain fog, anxiety,
                mood swings, irritability, sleep disruption, fatigue, joint pain,
                headaches, bloating, breast tenderness, heart palpitations,
                weight changes, hair changes, low libido, vaginal dryness, and
                digestive issues.
              </li>
              <li>
                <strong>Daily Ratings:</strong> Self-reported daily severity
                rating (Mild, Moderate, Rough, or Terrible).
              </li>
              <li>
                <strong>Daily Notes:</strong> Optional free-text notes you may
                enter alongside your daily log.
              </li>
              <li>
                <strong>Medications and HRT:</strong> Names of medications or
                hormone replacement therapy you choose to disclose, or indication
                that you prefer not to answer.
              </li>
              <li>
                <strong>Past Period History:</strong> Optional historical period
                dates entered during onboarding.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              1.3 Apple Health Data (HealthKit)
            </h3>
            <p>
              With your explicit permission, we may read and/or write the
              following data from Apple Health:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Menstrual Cycle Data (read and write):</strong> We sync
                period data bidirectionally with Apple Health.
              </li>
              <li>
                <strong>Sleep Data (read only):</strong> Used to detect
                sleep-related patterns in your symptoms.
              </li>
              <li>
                <strong>Steps and Activity Data (read only):</strong> Used to
                correlate activity levels with symptom patterns.
              </li>
              <li>
                <strong>Heart Rate Data (read only):</strong> Used to identify
                potential correlations with symptoms like hot flashes or
                palpitations.
              </li>
            </ul>
            <p>
              You control which Apple Health categories to share. You can revoke
              access at any time through the app or through iOS Settings &gt;
              Health &gt; Data Access &amp; Devices.
            </p>
            <p>
              Apple Health data is never transferred to our servers. It is
              processed on-device only for pattern detection and is never used
              for advertising or shared with third parties.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">1.4 AI Interaction Data</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Chat Messages:</strong> Messages you send to our AI
                guide (&ldquo;Stella&rdquo;) and the responses generated. Your
                symptom history and cycle data may be included as context to
                generate personalized responses.
              </li>
              <li>
                <strong>Prediction Feedback:</strong> Thumbs up/down ratings you
                provide on predictions, and &ldquo;felt better/felt
                worse&rdquo; overrides.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">1.5 Usage Data</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Logging streaks (consecutive days of symptom logging)</li>
              <li>Feature interaction patterns</li>
              <li>
                Device type, operating system version, and app version for
                troubleshooting
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">1.6 Payment Information</h3>
            <p>
              Subscription payments are processed entirely by Apple through the
              App Store. We do not collect, store, or have access to your payment
              details (credit card numbers, billing address, etc.). We only
              receive confirmation of your subscription status from Apple.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            2. How We Use Your Information
          </h2>
          <p>
            We use collected information solely to provide, maintain, and improve
            our Services:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              To enable core features: symptom tracking, cycle tracking, pattern
              detection, and daily logging.
            </li>
            <li>
              To generate AI-powered predictions of upcoming difficult days based
              on your logged patterns.
            </li>
            <li>
              To power the AI chat guide with personalized, contextual responses
              about your symptoms and cycle.
            </li>
            <li>
              To generate Doctor Report PDFs summarizing your health data over
              selected time periods.
            </li>
            <li>
              To detect and surface pattern insights (e.g., correlations between
              specific symptoms and cycle phases).
            </li>
            <li>
              To sync menstrual data with Apple Health (when you grant
              permission).
            </li>
            <li>
              To authenticate your account and keep your data secure.
            </li>
            <li>
              To send you notifications you have opted into (evening check-in
              reminders, hard day alerts, weekly summaries, streak milestones).
            </li>
            <li>
              To improve prediction accuracy through your feedback (thumbs
              up/down, felt better/worse).
            </li>
            <li>
              To comply with legal obligations or enforce our Terms of Service.
            </li>
          </ul>
          <p>
            We do <strong>NOT</strong> use your data for advertising, marketing
            to third parties, or any purpose unrelated to providing the Services.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            3. Sharing Your Information
          </h2>
          <p>
            We do not sell, rent, or share your personal information with third
            parties for their marketing or advertising purposes. We may share
            information only in these limited circumstances:
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">3.1 Service Providers</h3>
            <p>
              We use trusted third-party service providers to operate our
              Services, under strict data processing agreements:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Supabase</strong> (database hosting, authentication,
                serverless functions, file storage): Stores your account data,
                health logs, predictions, chat messages, and generated reports.
                Supabase implements Row Level Security ensuring users can only
                access their own data.
              </li>
              <li>
                <strong>Apple</strong> (Sign in with Apple, HealthKit, StoreKit):
                Processes authentication, health data sync, and subscription
                payments.
              </li>
              <li>
                <strong>Google</strong> (Sign in with Google): Processes
                authentication only — receives your email and name when you
                choose Google sign-in.
              </li>
              <li>
                <strong>AI/LLM Provider</strong> (via Supabase Edge Functions):
                Receives your symptom data and chat messages to generate AI
                responses and predictions. Data is transmitted securely and is
                not used to train AI models.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">3.2 Legal Requirements</h3>
            <p>
              We may disclose information if required by law, such as in response
              to a court order, subpoena, or government request, or to protect
              our rights, safety, users, or the public.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">3.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or asset sale, your
              information may be transferred to the acquiring entity, subject to
              the same privacy protections described in this policy.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            4. Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            data:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Encryption in transit (TLS/SSL) for all data transmitted between
              the App and our servers.
            </li>
            <li>
              Row Level Security (RLS) on all database tables, ensuring each user
              can only access their own data.
            </li>
            <li>Secure session management using iOS Keychain.</li>
            <li>
              Authentication via industry-standard protocols (OAuth 2.0, OIDC
              with nonce verification for Apple Sign In).
            </li>
          </ul>
          <p>
            While we strive to protect your information, no method of
            transmission or storage is 100% secure. You are responsible for
            maintaining the security of your device and authentication
            credentials.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            5. Data Retention
          </h2>
          <p>
            We retain your personal information only as long as your account is
            active and as necessary to provide our Services. Upon account
            deletion:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              All your data is permanently and immediately deleted across all
              database tables, including: profile information, symptom logs,
              daily logs, period history, medications, predictions, prediction
              feedback, chat messages, generated reports, and pattern insights.
            </li>
            <li>Your Supabase authentication record is also deleted.</li>
            <li>No backups of your data are retained after deletion.</li>
            <li>This deletion is irreversible.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            6. Your Rights and Controls
          </h2>
          <p>
            You have full control over your data within the App:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Export Your Data:</strong> You can export all your data as a
              JSON file from the Profile screen at any time.
            </li>
            <li>
              <strong>Delete Your Account:</strong> You can permanently delete
              your account and all associated data from the Profile screen.
              Deletion is immediate and irreversible.
            </li>
            <li>
              <strong>Manage Apple Health Access:</strong> You can connect or
              disconnect Apple Health data categories at any time through the app
              or iOS Settings.
            </li>
            <li>
              <strong>Manage Notifications:</strong> You have granular control
              over which notifications you receive (evening check-in, hard day
              alerts, weekly summary, streak reminders).
            </li>
          </ul>
          <p>
            Depending on your location, you may also have the following rights:
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              For EU/EEA Residents (GDPR)
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Right to access, correct, or delete your personal data.</li>
              <li>Right to restrict or object to processing.</li>
              <li>Right to data portability.</li>
              <li>Right to withdraw consent at any time.</li>
              <li>
                Right to lodge a complaint with your local data protection
                authority.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              For California Residents (CCPA/CPRA)
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Right to know what personal information is collected, used, and
                shared.
              </li>
              <li>Right to request deletion of personal information.</li>
              <li>
                Right to opt-out of the sale of personal information (we do not
                sell your data).
              </li>
              <li>
                Right to non-discrimination for exercising your privacy rights.
              </li>
            </ul>
          </div>

          <p>
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:privacy@rythma.co"
              className="text-raspberry underline underline-offset-2"
            >
              privacy@rythma.co
            </a>
            . We will respond within 30 days (or as required by applicable law).
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            7. International Data Transfers
          </h2>
          <p>
            Your data may be processed in the United States or other countries
            where our service providers (Supabase) operate. We ensure appropriate
            safeguards are in place for international transfers in accordance
            with applicable data protection laws.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            8. Children&apos;s Privacy
          </h2>
          <p>
            Our Services are not intended for anyone under 18 years old. We do
            not knowingly collect personal information from individuals under 18.
            If we become aware that we have collected data from someone under 18,
            we will promptly delete it. If you believe a minor has provided us
            with personal information, please contact us at{" "}
            <a
              href="mailto:privacy@rythma.co"
              className="text-raspberry underline underline-offset-2"
            >
              privacy@rythma.co
            </a>
            .
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            9. Cookies and Tracking
          </h2>
          <p>
            The Rythma App does not use cookies, advertising trackers, or
            third-party analytics services. We do not engage in cross-app
            tracking or behavioral advertising. We do not use tracking pixels or
            fingerprinting techniques.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            10. Medical Disclaimer
          </h2>
          <p>
            Rythma is not a medical device and is not intended to provide medical
            advice, diagnosis, or treatment. The predictions, insights, and AI
            responses provided by the App are based on self-reported data and
            statistical pattern analysis. They should not be used as a substitute
            for professional medical advice. Always consult a qualified
            healthcare provider for medical decisions.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            11. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or our data
            practices, contact us at:
          </p>
          <div className="space-y-1">
            <p className="font-medium">Rythma</p>
            <p>
              Email:{" "}
              <a
                href="mailto:privacy@rythma.co"
                className="text-raspberry underline underline-offset-2"
              >
                privacy@rythma.co
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
