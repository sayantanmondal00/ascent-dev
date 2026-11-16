import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "@/styles/tokens.css";
import "@/styles/layout.css";
import "@/styles/components.css";

export const metadata: Metadata = {
  title: { default: "Ascent · MBOSE Class 9 and 10", template: "%s · Ascent" },
  description: "Climb one topic at a time. Maths, Physics and Chemistry for MBOSE Class 9 and 10, built for any phone and any connection.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0F6B5C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
