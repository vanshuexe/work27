import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole, Sparkles } from "lucide-react";
import { getAdmin } from "@/lib/supabase/server";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  if (await getAdmin()) redirect("/admin");
  const { expired } = await searchParams;
  return (
    <main className="admin-auth">
      <div className="admin-auth-brand"><Sparkles size={24} /><span>Kali Charan <small>WEBSITE MANAGER</small></span></div>
      <div className="admin-auth-card">
        <div className="admin-auth-icon"><LockKeyhole size={25} /></div>
        <span className="admin-eyebrow">YOUR WEBSITE, IN YOUR HANDS</span>
        <h1>Welcome back.</h1>
        <p>Sign in to manage your services and keep your website up to date.</p>
        {expired && <div className="admin-notice error" role="alert">This setup link has expired or was already used. Sign in with your password, or ask for a new setup link.</div>}
        <LoginForm />
        <div className="admin-auth-note"><LockKeyhole size={14} /> Access is limited to approved administrators.</div>
      </div>
      <Link className="admin-back" href="/"><ArrowLeft size={16} /> Back to website</Link>
    </main>
  );
}
