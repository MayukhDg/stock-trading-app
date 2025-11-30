import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "../ui/button";
import { UserButtonWrapper } from "./UserButtonWrapper";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Automations", href: "#automations" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export async function Navbar() {
  const { userId } = await auth();

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
          {userId ? (
            <>
              <Button as="a" href="/dashboard" variant="ghost">
                Dashboard
              </Button>
              <UserButtonWrapper />
            </>
          ) : (
            <>
              <Button as="a" href="/sign-in" variant="ghost">
                Sign in
              </Button>
              <Button as="a" href="/sign-up">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

