import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

type Props = {
  items: {
    label: string;
    href: string;
  }[];
  className?: string;
};

export function MobileNav({ items, className }: Props) {
  return (
    <nav className={cn("flex w-full max-w-7xl items-center justify-between gap-4", className)}>
      <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
        Rythma
      </Link>
      <Drawer direction="top">
        <DrawerTrigger className="relative -m-2 cursor-pointer p-2">
          <span className="sr-only">Open menu</span>
          <Menu className="h-6 w-6" />
        </DrawerTrigger>
        <DrawerContent className="flex flex-col gap-4 p-8">
          <DrawerTitle className="sr-only">Menu</DrawerTitle>
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-4">
            <Link href="/#waitlist">Join Waitlist</Link>
          </Button>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}
