import type { Metadata } from "next";
import GreekLetterForest from "./GreekLetterForest";

export const metadata: Metadata = {
  title: "Greek Letter Forest | Interactive Greek Alphabet Game",
  description: "A miniature 3D woodland and a sculpted Greek mechanical keyboard: drop, move and merge real 3D Greek letters.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <GreekLetterForest />;
}
