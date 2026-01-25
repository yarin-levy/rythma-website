import { FooterBlur } from "@/components/footer/footer-blur";
import { InstagramIcon, TikTokIcon } from "@/components/footer/icons";
import Link from "next/link";

const links = [
  {
    title: "Rythma",
    links: [
      {
        label: "Features",
        href: "/#features",
        title: "See our features",
      },
      {
        label: "FAQ",
        href: "/#faq",
        title: "Frequently asked questions",
      },
      {
        label: "Join Waitlist",
        href: "/#waitlist",
        title: "Join the waitlist",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
        title: "Read our Privacy Policy",
      },
      {
        label: "Terms of Service",
        href: "/terms-and-conditions",
        title: "Read our Terms of Service",
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: (
          <div className="flex items-center gap-2">
            <InstagramIcon className="h-4 w-4" />
            <span>Instagram</span>
          </div>
        ),
        href: "https://instagram.com/rythma.app",
        title: "Follow us on Instagram",
      },
      {
        label: (
          <div className="flex items-center gap-2">
            <TikTokIcon className="h-4 w-4" />
            <span>TikTok</span>
          </div>
        ),
        href: "https://tiktok.com/@rythma.app",
        title: "Follow us on TikTok",
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative -mt-25 overflow-hidden py-12 pt-37 md:py-25 md:pt-37">
      <FooterBlur />
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Top section with logo and links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 tracking-tight">
          {/* Logo and tagline */}
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
            <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
              Rythma
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Know your hard days before they hit.
            </p>
          </div>

          {/* Links */}
          {links.map((link) => (
            <div key={link.title} className="text-left">
              <h3 className="text-muted-foreground mb-4 font-medium">{link.title}</h3>
              <ul className="flex flex-col gap-3">
                {link.links.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      title={item.title}
                      target={item.href.startsWith("https://") ? "_blank" : undefined}
                      className="text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rythma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
