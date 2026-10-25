import type { Metadata } from "next";
import BibleLibrary from "../../components/bible/BibleLibrary";

export const metadata: Metadata = {
  title: "The Bible",
  description: "A developing reading and research space for the Greek New Testament.",
  alternates: { canonical: "/bible" },
};

export default function BiblePage() {
  return <BibleLibrary />;
}
