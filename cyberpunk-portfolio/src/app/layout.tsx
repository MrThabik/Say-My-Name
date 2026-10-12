// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thaseen Shabik N — Electrical & Electronics Engineer",
  description:
    "FANUC robotics, VMC machining and high-pressure die casting — portfolio of Thaseen Shabik N, Shift In-Charge (OPED) at TVS Sundaram-Clayton.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
