import { redirect } from "next/navigation";

export default function HomePage() {
  // The middleware already routes authenticated users from /login to /dashboard.
  // Sending unauthenticated visitors to /login keeps the entry point predictable
  // until a public landing page exists.
  redirect("/login");
}
