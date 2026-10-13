import { redirect } from "next/navigation";

import { getSignupEnabled } from "@/lib/auth/config";
import { getServerAccessToken } from "@/lib/auth/server";

import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const token = await getServerAccessToken();
  if (token) {
    redirect("/overview");
  }

  const signupEnabled = await getSignupEnabled();
  return <LoginForm signupEnabled={signupEnabled} />;
}
