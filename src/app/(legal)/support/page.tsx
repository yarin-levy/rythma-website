"use client";

import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const faqs = [
  {
    id: "cancel",
    question: "How do I cancel my subscription?",
    answer:
      "Rythma subscriptions are managed through Apple. To cancel, go to Settings > [your name] > Subscriptions on your iPhone, find Rythma, and tap \"Cancel Subscription.\" Your access continues until the end of your current billing period. Deleting the app does not cancel your subscription.",
  },
  {
    id: "delete",
    question: "How do I delete my account and data?",
    answer:
      "Open the app, go to Profile, scroll to the bottom, and tap \"Delete Account.\" This permanently deletes ALL your data from our servers, including your profile, symptom logs, period history, chat messages, reports, and predictions. This action is irreversible.",
  },
  {
    id: "export",
    question: "How do I export my data?",
    answer:
      "Go to Profile > Privacy & Data > Export My Data. Your data will be exported as a JSON file that you can save or share.",
  },
  {
    id: "data-collected",
    question: "What data does Rythma collect?",
    answer:
      "Rythma collects the health data you voluntarily log (symptoms, period dates, daily ratings, notes), your account information (name, email, age range), and optionally Apple Health data you choose to share (sleep, steps, heart rate, menstrual cycle). We do not collect advertising data, location data, or payment information. See our full Privacy Policy for details.",
  },
  {
    id: "predictions",
    question: "How do predictions work?",
    answer:
      "Rythma analyzes your logged symptom patterns over time to predict upcoming difficult days. The more consistently you log, the more accurate predictions become. Predictions are estimates based on statistical patterns — they are not medical advice.",
  },
  {
    id: "apple-health",
    question: "How do I connect or disconnect Apple Health?",
    answer:
      "Go to Profile > Apple Health to manage which health data categories Rythma can access. You can also manage this through iOS Settings > Health > Data Access & Devices > Rythma.",
  },
  {
    id: "data-sharing",
    question: "Is my health data shared with anyone?",
    answer:
      "Your health data is never sold or shared with advertisers. It is stored securely on our servers (Supabase) and is only used to provide the app's features. See our Privacy Policy for full details on data handling.",
  },
  {
    id: "medical",
    question: "Is Rythma a medical device?",
    answer:
      "No. Rythma is a wellness and tracking tool, not a medical device. It does not provide medical advice, diagnosis, or treatment. Always consult your healthcare provider for medical decisions.",
  },
  {
    id: "refund",
    question: "I was charged after my free trial. Can I get a refund?",
    answer:
      "Refunds are handled by Apple. You can request a refund at reportaproblem.apple.com. If your trial renewed and you didn't intend to subscribe, Apple typically processes refund requests promptly.",
  },
  {
    id: "restore",
    question: "How do I restore my subscription on a new device?",
    answer:
      "Simply sign in with the same account (Apple, Google, or email) you used originally. Your subscription status is tied to your Apple ID and will be restored automatically.",
  },
];

function SupportFAQItem(
  props: React.ComponentProps<typeof AccordionItem>
) {
  return (
    <AccordionItem
      {...props}
      className={cn(
        "bg-secondary/30 data-[state=open]:bg-card data-[state=open]:border-border rounded-lg border border-transparent px-5 py-2 transition-colors data-[state=open]:shadow-sm",
        props.className
      )}
    />
  );
}

function ContactForm() {
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) return;

    setSending(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you within 24-48 hours.");
        form.reset();
      } else {
        toast.error("Something went wrong. Please email us directly.");
      }
    } catch {
      toast.error("Something went wrong. Please email us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="border-border bg-card w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-raspberry"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border-border bg-card w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-raspberry"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="border-border bg-card w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-raspberry resize-none"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-raspberry text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default function Support() {
  return (
    <article className="mx-auto mt-16 max-w-3xl px-4 pb-16 sm:mt-20 sm:px-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Support &amp; Help Center
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
        Have a question or need help? Check our FAQ below or reach out to us
        directly.
      </p>

      {/* Contact email */}
      <div className="mt-8 flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <Mail className="h-5 w-5 text-raspberry shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Email us anytime at</p>
          <a
            href="mailto:support@rythma.co"
            className="text-lg font-medium text-raspberry underline underline-offset-2"
          >
            support@rythma.co
          </a>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="grid gap-3">
          {faqs.map((faq) => (
            <SupportFAQItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left text-[15px] font-medium [&[data-state=open]>svg]:text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[14px] leading-6">
                {faq.answer}
              </AccordionContent>
            </SupportFAQItem>
          ))}
        </Accordion>
      </section>

      {/* Contact form */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
          Send Us a Message
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <ContactForm />
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          We typically respond within 24–48 hours.
        </p>
      </section>
    </article>
  );
}
