import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNavigation from "../components/site/SiteNavigation";
import CursorEcho from "../components/common/CursorEcho";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BTTB Movement",
    template: "%s | BTTB Movement",
  },
  description: "Virtual Production and Cinematography portfolio.",
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
        <CursorEcho />
        <div className="pb-24 md:pb-0">{children}</div>
      </body>
    </html>
  );
}