import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { getAdmin } from "@/lib/supabase/server";
import PasswordForm from "@/components/admin/PasswordForm";

export default async function PasswordPage() {
  if (!await getAdmin()) redirect("/admin/login");
  return <main className="admin-auth"><div className="admin-auth-card">
    <div className="admin-auth-icon"><KeyRound size={24} /></div>
    <span className="admin-eyebrow">ADMIN ACCOUNT</span>
    <h1>Set your password.</h1>
    <p>Choose a strong password for your website manager.</p>
    <PasswordForm />
  </div></main>;
}
