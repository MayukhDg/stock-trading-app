import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PulseIQ | AI Stock Copilot",
  description:
    "AI-powered stock market copilot delivering Zerodha portfolio sync, live news, and continuous trade guidance.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-slate-950">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-slate-100 antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
