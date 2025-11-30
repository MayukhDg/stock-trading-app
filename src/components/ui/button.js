export function Button({
  children,
  variant = "primary",
  as = "button",
  href,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const styles = {
    primary:
      "bg-emerald-400 text-slate-900 hover:bg-emerald-300 focus-visible:outline-emerald-400",
    secondary:
      "border border-white/20 text-white/80 hover:text-white focus-visible:outline-white/60",
    ghost: "text-white/70 hover:text-white",
  };

  const Comp = as === "a" ? "a" : "button";

  return (
    <Comp
      href={href}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}

