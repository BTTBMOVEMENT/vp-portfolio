import { redirect } from "next/navigation";

// Keep older prototype links working while the game now lives at its own home destination.
export default function LegacyGreekBlocksPage() {
  redirect("/greek-letter-game");
}
