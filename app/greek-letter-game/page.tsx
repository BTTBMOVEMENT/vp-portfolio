import type { Metadata } from "next";
import GreekLetterForest from "../greek-blocks/GreekLetterForest";

export const metadata: Metadata = {
  title: "Greek Letter Game",
  description: "Play with Greek letters in a cozy, miniature 3D woodland using a sculpted Greek mechanical keyboard.",
  alternates: { canonical: "/greek-letter-game" },
  robots: { index: false, follow: false },
};

export default function GreekLetterGamePage() {
  return <GreekLetterForest />;
}
