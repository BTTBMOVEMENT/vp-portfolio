import { redirect } from "next/navigation";

export default function LegacyMyVisionRedirect() {
  redirect("/my-album");
}