import { redirect } from "next/navigation";

export default function AboutPage() {
  // Rediriger vers le provider par défaut (Jensen Huang)
  redirect("/providers/jensen-huang/about");
}
