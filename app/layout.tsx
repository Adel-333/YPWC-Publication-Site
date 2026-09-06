import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.octphysicsclub.org"),
  title: {
    default: "Young Physics Writing Contest | Physics Club Magazine",
    template: "%s | Young Physics Writing Contest",
  },
  icons: {
    icon: "/assets/WWW YPWC.png",
    apple: "/assets/WWW YPWC.png",
  },
  description:
    "A magazine-style physics writing competition by Physics Club Magazine for students who explain science with clarity, creativity, and editorial craft.",
  keywords: [
    "Young Physics Writing Contest",
    "Physics Club Magazine",
    "physics writing",
    "student science competition",
    "STEM October Physics Club",
  ],
  openGraph: {
    title: "Young Physics Writing Contest",
    description:
      "Write a physics article with the clarity of a teacher and the imagination of a magazine writer.",
    siteName: "Physics Club Magazine",
    images: [
      {
        url: "/assets/ypwc-mark-text.png",
        width: 1000,
        height: 1000,
        alt: "Young Physics Writing Contest mark",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Young Physics Writing Contest",
    description:
      "A premium student competition for magazine-style physics articles.",
    images: ["/assets/ypwc-mark-text.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
