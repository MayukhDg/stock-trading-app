import Link from "next/link";
import { Button } from "../ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Automations", href: "#automations" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          PulseIQ
        </Link>

        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button as="a" href="/dashboard" variant="ghost">
            Launch app
          </Button>
          <Button as="a" href="/subscribe">
            Upgrade
          </Button>
        </div>
      </div>
    </header>
  );
}

