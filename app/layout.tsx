import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNavigation from "../components/site/SiteNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bttbmovement.com"),

  title: {
    default: "BTTB MOVEMENT",
    template: "%s | BTTB MOVEMENT",
  },

  description:
    "BTTB MOVEMENT is a cinematic portfolio focused on virtual production, cinematography, visual storytelling, works, journals, and image archives.",

  applicationName: "BTTB MOVEMENT",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://bttbmovement.com",
    siteName: "BTTB MOVEMENT",
    title: "BTTB MOVEMENT",
    description:
      "A cinematic portfolio focused on virtual production, cinematography, visual storytelling, works, journals, and image archives.",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "BTTB MOVEMENT",
    description:
      "A cinematic portfolio focused on virtual production, cinematography, visual storytelling, works, journals, and image archives.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased selection:bg-white selection:text-black`}
      >
        <SiteNavigation />
        <div className="pb-24 md:pb-0">{children}</div>
      </body>
    </html>
  );
}