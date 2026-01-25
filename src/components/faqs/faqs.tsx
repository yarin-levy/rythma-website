import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Link from "next/link";

function AccordionItemFAQs(props: React.ComponentProps<typeof AccordionItem>) {
  return (
    <AccordionItem
      {...props}
      className={cn(
        "bg-secondary/30 data-[state=open]:bg-card data-[state=open]:border-border rounded-lg border border-transparent px-5 py-2 transition-colors data-[state=open]:shadow-sm lg:px-7",
        props.className,
      )}
    />
  );
}

function AccordionTriggerFAQs(props: React.ComponentProps<typeof AccordionTrigger>) {
  return (
    <AccordionTrigger
      {...props}
      className={cn("[&[data-state=open]>svg]:text-foreground text-base lg:text-lg text-left", props.className)}
    />
  );
}

function AccordionContentFAQs(props: React.ComponentProps<typeof AccordionContent>) {
  return <AccordionContent {...props} className={cn("text-muted-foreground lg:text-base", props.className)} />;
}

export function FAQs() {
  return (
    <div id="faq" className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-2 md:gap-14 md:px-10 md:py-25">
      <div className="flex w-full flex-col gap-6">
        <Badge variant="secondary" className="mb-2 uppercase w-fit">
          FAQ
        </Badge>
        <h2 className="text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
          Frequently
          <br />
          Asked <span className="text-muted-foreground">Questions</span>
        </h2>
        <p className="max-w-lg text-sm leading-6 tracking-tight sm:text-base text-muted-foreground">
          Get answers to commonly asked questions about Rythma and perimenopause tracking.
        </p>
        <Button className="w-fit" size="lg" asChild>
          <Link href="/#waitlist">Join the Waitlist</Link>
        </Button>
      </div>
      <Accordion type="single" collapsible defaultValue="perimenopause" className="grid w-full gap-4">
        <AccordionItemFAQs value="perimenopause">
          <AccordionTriggerFAQs>What is perimenopause?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              Perimenopause is the transition period before menopause, typically starting in your mid-40s. It&apos;s marked by irregular cycles, hormonal fluctuations, and symptoms like hot flashes, brain fog, and sleep issues. It can last 4-10 years.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="different">
          <AccordionTriggerFAQs>How is Rythma different from other period trackers?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              Most trackers assume a 28-day cycle and just count days. Rythma is built for irregular cycles (21-50+ days), predicts symptoms before they hit, and finds patterns in YOUR data, not generic averages.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="prediction">
          <AccordionTriggerFAQs>How does the prediction work?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              Rythma learns from your daily logs: symptoms, sleep, stress, and more. After a few weeks, it identifies YOUR patterns and can predict hard days with increasing accuracy.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="logging">
          <AccordionTriggerFAQs>Do I need to log every day?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              The more you log, the better the predictions. But even logging 3-4 times a week helps. Each entry takes about 30 seconds.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="doctor">
          <AccordionTriggerFAQs>Can I share data with my doctor?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              Yes! One tap generates a professional PDF report with your symptoms, patterns, and cycle data. Perfect for appointments.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="privacy">
          <AccordionTriggerFAQs>Is my data private?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              Absolutely. Your health data stays on your device and is never sold. We take privacy seriously.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
      </Accordion>
    </div>
  );
}
