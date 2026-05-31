import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogNav() {
  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6 sm:px-8">
      <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
        Rythma
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          Blog
        </Link>
        <Button asChild>
          <Link href="https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611" target="_blank" rel="noopener noreferrer">
            Download
          </Link>
        </Button>
      </div>
    </nav>
  );
}
