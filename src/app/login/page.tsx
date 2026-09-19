import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/session";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const email = await getSessionEmail();
  if (email) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <LoginForm />
    </div>
  );
}
