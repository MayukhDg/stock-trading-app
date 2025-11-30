import Link from "next/link";

const links = [
  { label: "Docs", href: "/docs" },
  { label: "Status", href: "https://status.pulseiq.money" },
  { label: "Security", href: "/security" },
  { label: "Support", href: "mailto:support@pulseiq.money" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">PulseIQ</p>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} PulseIQ Labs. Built in Bengaluru.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/60">
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

